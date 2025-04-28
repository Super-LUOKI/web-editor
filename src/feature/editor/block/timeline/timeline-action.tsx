import { useZustand } from "use-zustand";

import { Button } from "@/component/ui/button.tsx";
import { usePlayerManager } from "@/feature/editor/context/player-manager.tsx";
import { IconPark } from "@/lib/iconpark";
import { cn } from "@/lib/shadcn/util.ts";

type TimelineActionProps = {
    className?: string
}

export function TimelineAction(props: TimelineActionProps) {
  const { className } = props
  const playerManager = usePlayerManager()
  const isPlaying = useZustand(playerManager.store, s => s.isPlaying)
  const isBuffering = useZustand(playerManager.store, s => s.isBuffering)
    
  const renderPlayIcon = ()=>{
    let icon = <IconPark icon='play' size={20}/>  
    
    if(isBuffering) icon = <IconPark icon='loading' size={20} spin/>
    if(isPlaying) icon = <IconPark icon='pause' size={20}/>
      
    return icon
  }
    
  return (
    <div
      className={cn('w-full h-[48px] border-b-[1px] border-b-gray-100 flex justify-between items-center px-3', className)}>
      <div>Left Actions</div>
      <div>
        <Button 
          variant='outline' 
          onClick={()=>{
            if(isBuffering) return
            if(isPlaying){
              playerManager.pause()
            }else{
              playerManager.play()
            }
          }}>{renderPlayIcon()}</Button>
      </div>
      <div>Slide Actions</div>
    </div>
  )
}