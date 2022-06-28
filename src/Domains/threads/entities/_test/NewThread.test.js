const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  // Throw error when payload did not contain needed property
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const ownerId = 'user-123';
    const payload = {
      title: 'abc',
    };

    // Action & Assert
    expect(() => new NewThread(ownerId, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const ownerId = 'user-123';
    const payload = {
      title: 123,
      body: true,
    };

    // Action & Assert
    expect(() => new NewThread(ownerId, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 255 characters', () => {
    // Arrange
    const ownerId = 'user-123';
    const payload = {
      title: 'Thread Title'.repeat(256),
      body: 'abc',
    };

    // Action & Assert
    expect(() => new NewThread(ownerId, payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const ownerId = 'user-123';
    const payload = {
      title: 'Thread Title',
      body: 'Thread body',
    };

    // Action
    const { title, body, owner } = new NewThread(ownerId, payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(ownerId);
  });
});
