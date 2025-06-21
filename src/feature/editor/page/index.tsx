import { useEffect, useState } from 'react'

import { EditorHeader } from '@/feature/editor/block/editor-header.tsx'
import { EditorSidebar } from '@/feature/editor/block/editor-sidebar.tsx'
import { PropertyPanel } from '@/feature/editor/block/property-panel'
import { ResourcePanel } from '@/feature/editor/block/resource-panel'
import { Stage } from '@/feature/editor/block/stage'
import { Timeline } from '@/feature/editor/block/timeline/timeline.tsx'
import { DraftManagerProvider } from '@/feature/editor/context/draft-manager.tsx'
import { EditorManagerProvider } from '@/feature/editor/context/editor-manager.tsx'
import { PlayerManagerProvider } from '@/feature/editor/context/player-manager.tsx'
import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'
import { EditorManager } from '@/feature/editor/manager/editor-manager.ts'
import { PlayerManager } from '@/feature/editor/manager/player-manager.ts'

type EditorPageProps = {
  videoId?: string
}

function Editor() {
  return (
    <div className="size-full flex flex-row overflow-hidden">
      <EditorSidebar />
      <div className="h-full w-0 flex flex-col flex-1">
        <EditorHeader />
        <div className="w-full h-0 flex-1 flex flex-row">
          <ResourcePanel />
          <Stage className="w-0 flex-1 h-full" />
          <PropertyPanel />
        </div>
        <Timeline />
      </div>
    </div>
  )
}

export function EditorPage(props: EditorPageProps) {
  const { videoId } = props
  const [draftManager] = useState(() => new DraftManager())
  const [editorManager] = useState(() => new EditorManager())
  const [playerManager] = useState(() => new PlayerManager(draftManager))

  useEffect(() => {
    draftManager.bootstrap({ videoId: videoId || '' })
    return () => {
      draftManager.destroy()
    }
  }, [videoId])

  return (
    <DraftManagerProvider value={draftManager}>
      <PlayerManagerProvider value={playerManager}>
        <EditorManagerProvider value={editorManager}>
          <Editor />
        </EditorManagerProvider>
      </PlayerManagerProvider>
    </DraftManagerProvider>
  )
}
