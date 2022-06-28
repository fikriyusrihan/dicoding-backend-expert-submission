const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentByIdHandler = this.postThreadCommentByIdHandler.bind(this);
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
}

module.exports = ThreadsHandler;
