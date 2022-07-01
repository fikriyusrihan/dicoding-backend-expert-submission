const NewReply = require('../NewReply');

describe('a NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: undefined,
    };

    // Action & Assert
    expect(() => new NewReply(ownerId, threadId, commentId, payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewReply(ownerId, threadId, commentId, payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'Reply content',
    };

    // Action
    const {
      content, ownerId: ownerId_, threadId: threadId_, commentId: commentId_,
    } = new NewReply(ownerId, threadId, commentId, payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(ownerId_).toEqual(ownerId);
    expect(threadId_).toEqual(threadId);
    expect(commentId_).toEqual(commentId);
  });
});
