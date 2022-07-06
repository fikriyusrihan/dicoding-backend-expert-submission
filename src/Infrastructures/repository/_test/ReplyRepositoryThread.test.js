const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  const userId = 'user-reply-test';
  const threadId = 'thread-reply-test';
  const commentId = 'comment-reply-test';
  const fakeIdGenerator = () => '123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply and return created reply correctly', async () => {
      // Arrange
      const payload = { content: 'Reply content' };
      const newReply = new NewReply(userId, threadId, commentId, payload);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const comment = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(comment).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      // Arrange
      const payload = { content: 'Reply content' };
      const newReply = new NewReply(userId, threadId, commentId, payload);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: 'Reply content',
        owner: userId,
      }));
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies payload correctly', async () => {
      // Arrange
      const firstReplyId = 'reply-1';
      const secondReplyId = 'reply-2';
      await RepliesTableTestHelper.addReply({
        id: firstReplyId, comment: commentId, owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: secondReplyId, comment: commentId, owner: userId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      const [firstReply, secondReply] = replies;
      expect(replies).toHaveLength(2);
      expect(firstReply).toBeDefined();
      expect(secondReply).toBeDefined();
      expect(firstReply.id).toEqual(firstReplyId);
      expect(secondReply.id).toEqual(secondReplyId);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply', async () => {
      // Arrange
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ id: replyId, comment: commentId, owner: userId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      await replyRepositoryPostgres.deleteReply(replyId);

      // Assert
      const results = await RepliesTableTestHelper.findReplyById(replyId);
      expect(results[0].is_delete).toBe(true);
    });
  });
});
