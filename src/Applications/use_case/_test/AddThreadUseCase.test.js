const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread body',
    };
    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'Thread Title',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await addThreadUseCase.execute(ownerId, useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(ownerId, {
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
