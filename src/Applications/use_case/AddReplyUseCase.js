const NewReply = require('../../Domains/threads/entities/NewReply');

class AddReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(ownerId, threadId, commentId, useCasePayload) {
    const newReply = new NewReply(ownerId, threadId, commentId, useCasePayload);
    await this._threadRepository.verifyThreadExists(threadId);
    await this._threadRepository.verifyCommentExists(commentId);
    return this._threadRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
