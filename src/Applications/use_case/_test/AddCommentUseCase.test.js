const CreatedComment = require('../../../Domains/threads/entities/CreatedComment');
const NewComment = require('../../../Domains/threads/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'comment',
    };
    const expectedCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: ownerId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdComment = await addCommentUseCase.execute(ownerId, threadId, useCasePayload);

    // Assert
    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockThreadRepository.addComment)
      .toBeCalledWith(new NewComment(ownerId, threadId, useCasePayload));
  });
});
