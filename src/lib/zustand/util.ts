import { combine } from 'zustand/middleware'

export function initState<T extends object>(state: T) {
  return combine(state, () => ({}))
}
