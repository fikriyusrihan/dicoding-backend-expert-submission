const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-comment-test';
  const threadId = 'thread-comment-test';
  const fakeIdGenerator = () => '123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return created comment correctly', async () => {
      // Arrange
      const payload = { content: 'Comment content' };
      const newComment = new NewComment(userId, threadId, payload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      const payload = { content: 'Comment content' };
      const newComment = new NewComment(userId, threadId, payload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'Comment content',
        owner: userId,
      }));
    });
  });

  describe('verifyCommentExsists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw Not Found Error when comment found', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists(commentId))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when the owner is invalid', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, ''))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the owner is valid', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments payload correctly', async () => {
      // Arrange
      const firstCommentId = 'comment-1';
      const secondCommentId = 'comment-2';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({
        id: firstCommentId, thread: threadId, owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: secondCommentId, thread: threadId, owner: userId,
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      const [firstComment, secondComment] = comments;
      expect(comments).toHaveLength(2);
      expect(firstComment.id).toEqual(firstCommentId);
      expect(secondComment.id).toEqual(secondCommentId);
      expect(firstComment.thread).toEqual(threadId);
      expect(secondComment.thread).toEqual(threadId);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const result = await CommentsTableTestHelper.findCommentsById(commentId);
      const { id, is_delete: isDelete } = result[0];
      expect(id).toEqual(commentId);
      expect(isDelete).toBe(true);
    });
  });
});
