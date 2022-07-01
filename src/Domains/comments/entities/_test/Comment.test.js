const Comment = require('../Comment');

describe('A Comment', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'developer',
      date: '2020-01-01',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'developer',
      date: '2020-01-01',
      content: 'Comment content',
      replies: [],
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'developer',
      date: '2020-01-01',
      content: 'Comment content',
      replies: [],
    };

    // Action
    const {
      id,
      username,
      date,
      content,
      replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(replies).toEqual(payload.replies);
  });
});
