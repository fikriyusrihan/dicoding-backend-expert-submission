const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentByIdHandler = this.postThreadCommentByIdHandler.bind(this);
    this.deleteThreadCommentByIdHandler = this.deleteThreadCommentByIdHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.postThreadCommentReplyByIdHandler = this.postThreadCommentReplyByIdHandler.bind(this);
    this.deleteThreadCommentReplyByIdHandler = this.deleteThreadCommentReplyByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const ownerId = request.auth.credentials.id;
    const payload = {
      title: request.payload.title,
      body: request.payload.body,
    };
    const addedThread = await addThreadUseCase.execute(ownerId, payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentByIdHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const ownerId = request.auth.credentials.id;
    const { threadId } = request.params;
    const payload = {
      content: request.payload.content,
    };
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

  async getThreadByIdHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);

    const { threadId } = request.params;
    const thread = await getThreadDetailUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
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

module.exports = ThreadsHandler;
