const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewComment = require('../../../Domains/threads/entities/NewComment');
const NewReply = require('../../../Domains/threads/entities/NewReply');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreatedComment = require('../../../Domains/threads/entities/CreatedComment');
const CreatedReply = require('../../../Domains/threads/entities/CreatedReply');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user-234' });
  });

  beforeEach(async () => {
    await ThreadsTableTestHelper.addThread({ id: 'thread-234' });
    await CommentsTableTestHelper.addComment({ id: 'comment-forReply', threadId: 'thread-234' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
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

  describe('getThreadById function', () => {
    it('should return thread payload correctly', async () => {
      // Arrange
      const threadId = 'thread-getThreadById';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toBeDefined();
      expect(thread.body).toBeDefined();
      expect(thread.created_at).toBeDefined();
      expect(thread.updated_at).toBeDefined();
      expect(thread.owner).toBeDefined();
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

  describe('verifyCommentExsists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentExists('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw Not Found Error when comment found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-234' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when the owner is invalid', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-234', ownerId: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-xxx')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the owner is valid', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-234', ownerId: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments payload correctly', async () => {
      // Arrange
      const threadId = 'thread-getCommentsByThreadId';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId, ownerId: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId, ownerId: 'user-2' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const comments = await threadRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-1');
      expect(comments[0].thread).toEqual(threadId);
      expect(comments[1].id).toEqual('comment-2');
      expect(comments[1].thread).toEqual(threadId);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-234' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await threadRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const result = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(result[0].is_delete).toBe(true);
    });
  });

  describe('addReply function', () => {
    it('should persist reply and return created reply correctly', async () => {
      // Arrange
      const ownerId = 'user-234';
      const threadId = 'thread-234';
      const commentId = 'comment-forReply';
      const newReply = new NewReply(ownerId, threadId, commentId, {
        content: 'Reply content',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addReply(newReply);

      // Assert
      const comment = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(comment).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      // Arrange
      const ownerId = 'user-234';
      const threadId = 'thread-234';
      const commentId = 'comment-forReply';
      const newReply = new NewReply(ownerId, threadId, commentId, {
        content: 'Reply content',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await threadRepositoryPostgres.addReply(newReply);

      // Assert
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: 'Reply content',
        owner: 'user-234',
      }));
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies payload correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-forReply' });
      await RepliesTableTestHelper.addReply({ id: 'reply-234', commentId: 'comment-forReply' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const replies = await threadRepositoryPostgres.getRepliesByCommentId('comment-forReply');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[1].id).toEqual('reply-234');
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-forReply' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      await threadRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const result = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(result[0].is_delete).toBe(true);
    });
  });
});
