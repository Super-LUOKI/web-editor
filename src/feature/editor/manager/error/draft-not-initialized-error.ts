export class DraftNotInitializedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Draft not initialize.')
    this.name = 'DraftNotInitializedError'
  }
}
