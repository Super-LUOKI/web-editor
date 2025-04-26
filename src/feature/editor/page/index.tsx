import { PropsWithChildren, useState } from "react";

import { PlayerManagerProvider } from "@/feature/editor/block/context/player.tsx";
import { EditorHeader } from "@/feature/editor/block/editor-header.tsx";
import { EditorSidebar } from "@/feature/editor/block/editor-sidebar.tsx";
import { PropertyPanel } from "@/feature/editor/block/property-panel";
import { ResourcePanel } from "@/feature/editor/block/resource-panel";
import { Stage } from "@/feature/editor/block/stage";
import { Timeline } from "@/feature/editor/block/timeline/timeline.tsx";
import { PlayerManager } from "@/feature/editor/manager/player-manager.ts";

type EditorPageProps = {
    videoId?: string
}

export function EditorPage(props: EditorPageProps) {
  const { videoId } = props
  console.log('videoId', videoId)
  return (
    <div className='size-full flex flex-row'>
      <EditorSidebar/>
      <div className='h-full w-0 flex flex-col flex-1'>
        <EditorHeader/>
        <div className='w-full h-0 flex-1 flex flex-row'>
          <ResourcePanel/>
          <Stage className='w-0 flex-1 h-full'/>
          <PropertyPanel/>
        </div>
        <Timeline/>
      </div>

    </div>
  )
}

export function EditorProvider(props: PropsWithChildren){
  const [playerManager] = useState(new PlayerManager())

  return <PlayerManagerProvider value={playerManager}>{props.children}</PlayerManagerProvider>
}