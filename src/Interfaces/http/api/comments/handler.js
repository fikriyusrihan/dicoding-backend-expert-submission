const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentByIdHandler = this.postThreadCommentByIdHandler.bind(this);
    this.deleteThreadCommentByIdHandler = this.deleteThreadCommentByIdHandler.bind(this);
  }

  async postThreadCommentByIdHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const ownerId = request.auth.credentials.id;
    const { threadId } = request.params;
    const payload = { content: request.payload.content };
    const addedComment = await addCommentUseCase.execute(ownerId, threadId, payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentByIdHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const ownerId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(threadId, commentId, ownerId);
    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
