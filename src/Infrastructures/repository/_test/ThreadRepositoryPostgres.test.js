const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewComment = require('../../../Domains/threads/entities/NewComment');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreatedComment = require('../../../Domains/threads/entities/CreatedComment');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user-234' });
  });

  beforeEach(async () => {
    await ThreadsTableTestHelper.addThread({ id: 'thread-234' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return created thread correctly', async () => {
      // Arrange
      const ownerId = 'user-123';
      const newThread = new NewThread(ownerId, {
        title: 'Thread Title',
        body: 'Thread body',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      // Arrange
      const ownerId = 'user-123';
      const newThread = new NewThread(ownerId, {
        title: 'Thread Title',
        body: 'Thread body',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'Thread Title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw Not Found Error when thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    it('should persist comment and return created comment correctly', async () => {
      // Arrange
      const ownerId = 'user-234';
      const threadId = 'thread-234';
      const newComment = new NewComment(ownerId, threadId, {
        content: 'Comment content',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      const ownerId = 'user-234';
      const threadId = 'thread-234';
      const newComment = new NewComment(ownerId, threadId, {
        content: 'Comment content',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await threadRepositoryPostgres.addComment(newComment);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'Comment content',
        owner: 'user-234',
      }));
    });
  });
});
