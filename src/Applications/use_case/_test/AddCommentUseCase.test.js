const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
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
      content: 'comment',
      owner: ownerId,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new CreatedComment({
        id: 'comment-123',
        content: 'comment',
        owner: ownerId,
      }),
    ));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualCreatedComment = await addCommentUseCase.execute(ownerId, threadId, useCasePayload);

    // Assert
    expect(actualCreatedComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new NewComment(ownerId, threadId, useCasePayload));
  });
});
