class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, ownerId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._threadRepository.verifyCommentExists(commentId);
    await this._threadRepository.verifyCommentOwner(commentId, ownerId);
    await this._threadRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
