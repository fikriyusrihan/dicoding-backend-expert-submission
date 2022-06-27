const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  // Throw error when payload did not contain needed property
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: 'owner',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 255 characters', () => {
    // Arrange
    const payload = {
      title: 'ETmT6F7kfROAV4gwglIkovnYNpvDAYPI4dZcMR55lK1pPgulm9T05SYL1LyHSVthcIbB9LQYeJYYwE1Vzs6AlNoXNgbDZDZw0J4HM0rYJgpaIgsJO4q78lhE41Ft29EhptzrEnxrss0aaAwGGnfhyLPBDjGT06v7KduK3Qt3N6GwTyke97M3mrvZenQbUuNJWdu4UBgzglHYGRfvAgxyjMviX3PMbNnPFqXSrRhKa4TggVXc6XOowQcEJLcCdQ5D',
      body: 'abc',
      owner: 'abc',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
      body: 'Thread body',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
