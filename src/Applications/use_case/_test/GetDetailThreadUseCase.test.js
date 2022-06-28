const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const expectedThread = new Thread(
      {
        id: threadId,
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2020-01-01',
        username: 'dicoding',
        comments: [],
      },
    );

    /** mocking implementation */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    /** create use case implementation */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualThreadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(actualThreadDetail).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadExists)
      .toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetail)
      .toBeCalledWith(threadId);
  });
});
