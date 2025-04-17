import { combine } from "zustand/middleware/combine";

export function initState<T extends object>(state:T){
  return combine(state, (()=>({})))
} 