class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);
    return this._threadRepository.getThreadDetail(threadId);
  }
}

module.exports = GetThreadDetailUseCase;
