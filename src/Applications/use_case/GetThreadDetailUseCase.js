const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/replies/entities/Reply');
const Thread = require('../../Domains/threads/entities/Thread');

class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, userRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);

    const threadPayload = await this._threadRepository.getThreadById(threadId);
    const username = await this._userRepository.getUsernameById(threadPayload.owner);
    const commentsPayload = await this._commentRepository.getCommentsByThreadId(threadId);

    const comments = await Promise.all(commentsPayload.map(async (commentPayload) => {
      const commentOwnerUsername = await this._userRepository.getUsernameById(commentPayload.owner);
      const commentContent = commentPayload.is_delete ? '**komentar telah dihapus**' : commentPayload.content;

      const repliesPayload = await this._replyRepository.getRepliesByCommentId(commentPayload.id);
      const replies = await Promise.all(repliesPayload.map(async (replyPayload) => {
        const replyOwnerUsername = await this._userRepository.getUsernameById(replyPayload.owner);
        const replyContent = replyPayload.is_delete ? '**balasan telah dihapus**' : replyPayload.content;

        return new Reply({
          id: replyPayload.id,
          content: replyContent,
          date: replyPayload.created_at,
          username: replyOwnerUsername,
        });
      }));

      return new Comment({
        id: commentPayload.id,
        username: commentOwnerUsername,
        date: commentPayload.created_at,
        content: commentContent,
        replies,
      });
    }));

    return new Thread({
      id: threadPayload.id,
      title: threadPayload.title,
      body: threadPayload.body,
      date: threadPayload.created_at,
      username,
      comments,
    });
  }
}

module.exports = GetThreadDetailUseCase;
