const NewComment = require('../NewComment');

describe('A NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: undefined,
    };

    // Action & Assert
    expect(() => new NewComment(ownerId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewComment(ownerId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 'Comment content',
    };

    // Action
    const {
      content,
      thread: threadId_,
      owner: ownerId_,
    } = new NewComment(ownerId, threadId, payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId_).toEqual(threadId);
    expect(ownerId_).toEqual(ownerId);
  });
});
