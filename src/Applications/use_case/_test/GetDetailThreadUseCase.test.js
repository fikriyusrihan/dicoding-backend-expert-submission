const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const Comment = require('../../../Domains/threads/entities/Comment');
const Reply = require('../../../Domains/threads/entities/Reply');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** dummies */
    const threadPayload = {
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      created_at: '2020-01-01',
      updated_at: '2020-01-01',
      owner: 'user-123',
    };

    const commentPayload = {
      id: 'comment-123',
      content: 'Comment Content',
      created_at: '2020-01-01',
      updated_at: '2020-01-01',
      is_delete: false,
      owner: 'user-123',
      thread: threadId,
    };

    const commentPayloadDeleted = {
      id: 'comment-234',
      content: 'Comment Content',
      created_at: '2020-01-01',
      updated_at: '2020-01-01',
      is_delete: true,
      owner: 'user-123',
      thread: threadId,
    };

    const replyPayload = {
      id: 'reply-123',
      content: 'Reply Content',
      created_at: '2020-01-01',
      updated_at: '2020-01-01',
      is_delete: false,
      owner: 'user-123',
      comment: commentPayload.id,
    };

    const replyPayloadDeleted = {
      id: 'reply-234',
      content: 'Reply Content',
      created_at: '2020-01-01',
      updated_at: '2020-01-01',
      is_delete: true,
      owner: 'user-123',
      comment: commentPayload.id,
    };

    const expectedThread = new Thread(
      {
        id: threadId,
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2020-01-01',
        username: 'dicoding',
        comments: [
          new Comment({
            id: 'comment-123',
            username: 'dicoding',
            date: '2020-01-01',
            content: 'Comment Content',
            replies: [
              new Reply({
                id: 'reply-123',
                content: 'Reply Content',
                date: '2020-01-01',
                username: 'dicoding',
              }),
              new Reply({
                id: 'reply-234',
                content: '**balasan telah dihapus**',
                date: '2020-01-01',
                username: 'dicoding',
              }),
            ],
          }),
          new Comment({
            id: 'comment-234',
            username: 'dicoding',
            date: '2020-01-01',
            content: '**komentar telah dihapus**',
            replies: [
              new Reply({
                id: 'reply-123',
                content: 'Reply Content',
                date: '2020-01-01',
                username: 'dicoding',
              }),
              new Reply({
                id: 'reply-234',
                content: '**balasan telah dihapus**',
                date: '2020-01-01',
                username: 'dicoding',
              }),
            ],
          }),
        ],
      },
    );

    /** mocking implementation */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(threadPayload));
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve('dicoding'));
    mockThreadRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([commentPayload, commentPayloadDeleted]));
    mockThreadRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([replyPayload, replyPayloadDeleted]));

    /** create use case implementation */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const actualThreadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(actualThreadDetail).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(threadPayload.owner);
    expect(mockThreadRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getRepliesByCommentId).toBeCalledWith(commentPayload.id);
  });
});
