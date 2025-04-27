import { useState } from "react";

import { DraftManagerProvider } from "@/feature/editor/block/context/draft.tsx";
import { PlayerManagerProvider } from "@/feature/editor/block/context/player.tsx";
import { EditorHeader } from "@/feature/editor/block/editor-header.tsx";
import { EditorSidebar } from "@/feature/editor/block/editor-sidebar.tsx";
import { PropertyPanel } from "@/feature/editor/block/property-panel";
import { ResourcePanel } from "@/feature/editor/block/resource-panel";
import { Stage } from "@/feature/editor/block/stage";
import { Timeline } from "@/feature/editor/block/timeline/timeline.tsx";
import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { PlayerManager } from "@/feature/editor/manager/player-manager.ts";
import { editorMockDraft } from "@/feature/editor/util";

type EditorPageProps = {
    videoId?: string
}

function Editor(props: EditorPageProps) {
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

export function EditorPage(props: EditorPageProps){
  const [draftManager] = useState(new DraftManager(editorMockDraft))
  const [playerManager] = useState(new PlayerManager(draftManager))

  return (
    <DraftManagerProvider value={draftManager}>
      <PlayerManagerProvider value={playerManager}>
        <Editor { ...props}/>
      </PlayerManagerProvider>
    </DraftManagerProvider>
  )
  

}