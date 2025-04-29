import { useZustand } from "use-zustand";

import { formatSeconds } from "@/common/util/date.ts";
import { Button } from "@/component/ui/button.tsx";
import { useDraftManager } from "@/feature/editor/context/draft-manager.tsx";
import { usePlayerManager } from "@/feature/editor/context/player-manager.tsx";
import { IconPark } from "@/lib/iconpark";
import { cn } from "@/lib/shadcn/util.ts";

type TimelineActionProps = {
    className?: string
}

export function TimelineAction(props: TimelineActionProps) {
  const { className } = props
  const playerManager = usePlayerManager()
  const draftManager = useDraftManager()
  const isPlaying = useZustand(playerManager.store, s => s.isPlaying)
  const isBuffering = useZustand(playerManager.store, s => s.isBuffering)
  const currentTime = useZustand(playerManager.store, s => s.currentTime)
  const duration = useZustand(draftManager.store, s => s.duration)
    
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
      <div className='flex items-center gap-2'>
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
        <div className='flex items-center gap-1'>
          <span>{formatSeconds(currentTime)}</span>
          <span>/</span>
          <span>{formatSeconds(duration)}</span>
        </div>
      </div>
      <div>Slide Actions</div>
    </div>
  )
}