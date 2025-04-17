import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

import { initState } from "@/lib/zustand/util.ts";

const initialState = {
  isPlaying: false,
  isBuffering: false,
  currentTime: 0,
}

export class PlayerManager {
  readonly store = createStore(immer(initState(initialState)))
}