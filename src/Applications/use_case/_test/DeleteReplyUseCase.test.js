const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const ownerId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyReplyExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId);

    // Assert
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.verifyCommentExists)
      .toHaveBeenCalledWith(commentId);
    expect(mockThreadRepository.verifyReplyExist)
      .toHaveBeenCalledWith(replyId);
    expect(mockThreadRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(replyId, ownerId);
    expect(mockThreadRepository.deleteReply)
      .toHaveBeenCalledWith(replyId);
  });
});
