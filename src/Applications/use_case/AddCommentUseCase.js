const NewComment = require('../../Domains/threads/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(ownerId, threadId, useCasePayload) {
    const newComment = new NewComment(ownerId, threadId, useCasePayload);
    await this._threadRepository.verifyThreadExists(newComment.threadId);
    return this._threadRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
