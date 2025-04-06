import { Header } from "@/feature/editor/page/header.tsx";
import { Stage } from "@/feature/editor/page/stage.tsx";
import { Timeline } from "@/feature/editor/page/timeline.tsx";

type EditorPageProps = {
    videoId?: string
}

export function EditorPage(props: EditorPageProps) {
  const { videoId } = props
  console.log('videoId', videoId)
  return (
    <div className='size-full flex-col'>
      <Header/>
      <div className='w-full h-0 flex-1'>
        <div>resource panel</div>
        <Stage/>
        <div>property panel</div>
      </div>
      <Timeline/>
    </div>
  )
}