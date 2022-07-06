const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentReplyByIdHandler = this.postThreadCommentReplyByIdHandler.bind(this);
    this.deleteThreadCommentReplyByIdHandler = this.deleteThreadCommentReplyByIdHandler.bind(this);
  }

  async postThreadCommentReplyByIdHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const ownerId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;
    const payload = {
      content: request.payload.content,
    };

    const addedReply = await addReplyUseCase.execute(ownerId, threadId, commentId, payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentReplyByIdHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    const ownerId = request.auth.credentials.id;
    const { threadId, commentId, replyId } = request.params;

    await deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId);
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
