const CreatedComment = require('../CreatedComment');

describe('A CreatedComment should', () => {
  it('throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Comment content',
    };

    // Action & Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'Comment content',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('create createdComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Comment content',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new CreatedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
