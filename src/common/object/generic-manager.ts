import { StateManager } from "@/common/object/state-manager.ts";

export abstract class GenericManager<State extends object,
    InitOptions = any
> extends StateManager<State>{
  protected disposers: (() => void)[] = [];
  private readonly _initialState: State;
  private lifeCycleTasks: (() => Promise<void>)[] = [];
  private isExecutingLifeCycleTasks = false;

  protected constructor(initialState: State){
    super(initialState)
    this._initialState = initialState
  }

  protected addDisposers(...disposers: (() => void)[]){
    this.disposers.push(...disposers);
  }

  protected clearDisposers(){
    this.disposers.forEach((dispose) => dispose());
    this.disposers = [];
  }
  
  private async flushLifeCycleTasks(){
    if(this.isExecutingLifeCycleTasks) return
    while(true){
      const task = this.lifeCycleTasks.shift();
      if(!task) {
        this.isExecutingLifeCycleTasks = false;
        break;
      }
      await task();
    }
  }

  abstract onInit(options: InitOptions):void | Promise<void>;

  onDestroy():void | Promise<void>{}

  init(options: InitOptions){
    this.lifeCycleTasks.push(async()=>this.onInit(options))
    this.flushLifeCycleTasks()
  }
  
  destroy(){
    this.lifeCycleTasks.push(async()=>{
      this.clearDisposers()
      this.store.setState(this._initialState);
      await this.onDestroy()
    })
    this.flushLifeCycleTasks()
  }
}