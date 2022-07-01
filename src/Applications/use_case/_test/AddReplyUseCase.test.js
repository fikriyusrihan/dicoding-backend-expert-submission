const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const useCasePayload = { content: 'reply' };
    const expectedCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: ownerId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(
      new CreatedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: ownerId,
      }),
    ));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const createdReply = await addReplyUseCase
      .execute(ownerId, threadId, commentId, useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new NewReply(ownerId, threadId, commentId, useCasePayload));
  });
});
