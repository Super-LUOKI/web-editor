import { produce } from "immer";
import { createStore } from "zustand/vanilla";

export class StateManager<T extends object> {
  readonly store = createStore<T>(() => ({} as T));

  constructor(initialState: T) {
    this.store.setState(initialState);
  }

  get state() {
    return this.store.getState();
  }

  setState(updater: (state: T) => void) {
    this.store.setState(produce(this.state, updater));
  }
}