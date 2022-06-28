const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const CreatedComment = require('../../Domains/threads/entities/CreatedComment');
const Comment = require('../../Domains/threads/entities/Comment');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CreatedReply = require('../../Domains/threads/entities/CreatedReply');
const Reply = require('../../Domains/threads/entities/Reply');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async getThreadDetail(threadId) {
    const queryComments = {
      text: `SELECT c.id, u.username, c.created_at, c.content, c.is_delete
      FROM comments c
      INNER JOIN users u
      ON c.owner = u.id
      WHERE c.thread = $1
      ORDER BY c.created_at ASC`,
      values: [threadId],
    };

    const queryThread = {
      text: `SELECT t.id, title, body, created_at, username
      FROM threads t
      INNER JOIN users u
      ON t.owner = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const commentsResult = await this._pool.query(queryComments);
    const comments = await Promise.all(commentsResult.rows.map(async (comment) => {
      const content = comment.is_delete ? '**komentar telah dihapus**' : comment.content;

      const queryReplies = {
        text: `SELECT r.id, u.username, r.created_at, r.content, r.is_delete
        FROM replies r
        INNER JOIN users u
        ON r.owner = u.id
        WHERE r.comment = $1
        ORDER BY r.created_at ASC`,
        values: [comment.id],
      };
      const repliesResult = await this._pool.query(queryReplies);
      const replies = repliesResult.rows.map((reply) => {
        const replyContent = reply.is_delete ? '**balasan telah dihapus**' : reply.content;
        return new Reply({ ...reply, content: replyContent, date: reply.created_at });
      });

      return new Comment({
        ...comment, content, date: comment.created_at, replies,
      });
    }));

    const threadResult = await this._pool.query(queryThread);
    return new Thread({
      ...threadResult.rows[0],
      date: threadResult.rows[0].created_at,
      comments,
    });
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addComment(newComment) {
    const { content, threadId, ownerId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, updatedAt, isDeleted, ownerId, threadId],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, ownerId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk menghapus komentar');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async addReply(newReply) {
    const { content, commentId, ownerId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, updatedAt, isDelete, ownerId, commentId],
    };

    const result = await this._pool.query(query);

    return new CreatedReply({ ...result.rows[0] });
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, ownerId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk menghapus reply');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;
