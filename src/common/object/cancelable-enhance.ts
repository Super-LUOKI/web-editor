export class PromiseCancelError extends Error {
  constructor(message = 'Promise was canceled') {
    super(message)
    this.name = 'PromiseCancelError'
  }
}

export class CancelablePromise<T> extends Promise<T> {
  private _abortController: AbortController

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      signal: AbortSignal
    ) => void
  ) {
    const abortController = new AbortController()
    let rejectFn: ((reason?: any) => void) | undefined = undefined

    super((resolve, reject) => {
      rejectFn = reject
      executor(resolve, reject, abortController.signal)
    })

    this._abortController = abortController

    abortController.signal.addEventListener('abort', () => {
      if (rejectFn) {
        rejectFn(new PromiseCancelError())
      }
    })
  }

  cancel() {
    if (!this._abortController.signal.aborted) {
      this._abortController.abort()
    }
  }
}

export function cancelable<T>(promise: Promise<T>): CancelablePromise<T> {
  return new CancelablePromise<T>((resolve, reject, signal) => {
    signal.addEventListener('abort', () => {
      reject(new PromiseCancelError())
    })

    promise.then(
      value => {
        if (!signal.aborted) {
          resolve(value)
        }
      },
      error => {
        if (!signal.aborted) {
          reject(error)
        }
      }
    )
  })
}

export function createControlledPromise<T = any>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: any) => void

  const promise = new CancelablePromise<T>((res, rej, signal) => {
    resolve = value => {
      if (!signal.aborted) res(value)
    }
    reject = err => {
      if (!signal.aborted) rej(err)
    }
  })

  return {
    promise,
    resolve,
    reject,
    cancel: () => promise.cancel(),
  }
}
