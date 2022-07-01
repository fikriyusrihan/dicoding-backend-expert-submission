const Reply = require('../Reply');

describe('A Reply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply body',
      date: '2020-01-01',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'Reply body',
      date: '2020-01-01',
      username: 'developer',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply body',
      date: '2020-01-01',
      username: 'developer',
    };

    // Action
    const {
      id,
      content,
      date,
      username,
    } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
