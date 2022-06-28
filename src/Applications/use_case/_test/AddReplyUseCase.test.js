const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedReply = require('../../../Domains/threads/entities/CreatedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/threads/entities/NewReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'reply',
    };
    const expectedCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: ownerId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdReply = await addReplyUseCase
      .execute(ownerId, threadId, commentId, useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyCommentExists).toBeCalledWith(commentId);
    expect(mockThreadRepository.addReply)
      .toBeCalledWith(new NewReply(ownerId, threadId, commentId, useCasePayload));
  });
});
