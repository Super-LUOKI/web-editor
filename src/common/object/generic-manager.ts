import { StateManager } from "@/common/object/state-manager.ts";

export class GenericManager<T extends object> extends StateManager<T>{
  protected disposers: (() => void)[] = [];
  private readonly _initialState: T;

  constructor(initialState: T){
    super(initialState)
    this._initialState = initialState
  }

  protected addDisposers(...disposers: (() => void)[]){
    this.disposers.push(...disposers);
  }
  
  destroy(){
    this.disposers.forEach((dispose) => dispose());
    this.store.setState(this._initialState);
  }
}