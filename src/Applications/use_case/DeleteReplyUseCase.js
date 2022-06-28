class DeleteReplyUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(threadId, commentId, replyId, ownerId) {
    await this.threadRepository.verifyThreadExists(threadId);
    await this.threadRepository.verifyCommentExists(commentId);
    await this.threadRepository.verifyReplyExists(replyId);
    await this.threadRepository.verifyReplyOwner(replyId, ownerId);
    await this.threadRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
