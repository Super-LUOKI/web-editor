import { Player as RemotionPlayer, type PlayerRef as RemotionPlayerRef } from '@remotion/player'
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import { Renderer, RenderPropsSchema } from './index.tsx'
import {
  DraftRenderProvider,
  getDefaultDraftRenderContextValue,
  RenderContextValue,
} from './render-context.tsx'
import { RenderDraftData } from './schema/schema.ts'
import { calculateDraftDuration } from './utils/draft.ts'

type PlayerProps = Omit<
  ComponentPropsWithoutRef<typeof RemotionPlayer>,
  | 'component'
  | 'schema'
  | 'inputProps'
  | 'durationInFrames'
  | 'fps'
  | 'compositionWidth'
  | 'compositionHeight'
  | 'numberOfSharedAudioTags'
  | 'lazyComponent'
  | 'acknowledgeRemotionLicense'
> & {
  draft: RenderDraftData
  onPlayStateChange?: (isPlaying: boolean) => void
  onTimeUpdate?: (currentTime: number) => void
  onEnd?: () => void
}

export type DraftPlayerRef = {
  player: RemotionPlayerRef | null
  context: RenderContextValue
}
export const DraftPlayer = forwardRef<DraftPlayerRef, PlayerProps>((props, ref) => {
  const { draft, style, onPlayStateChange, onTimeUpdate, onEnd, ...rest } = props

  const [context] = useState(() => getDefaultDraftRenderContextValue())
  const [player, setPlayer] = useState<RemotionPlayerRef | null>(null)

  const { width, height, fps } = draft.meta

  const durationInFrames = calculateDraftDuration(draft) * fps

  useImperativeHandle(
    ref,
    () => ({
      player,
      context,
    }),
    [context, player]
  )

  useEffect(() => {
    if (!player) return
    const handlePlay = () => onPlayStateChange?.(true)
    const handlePause = () => onPlayStateChange?.(false)
    const handleTimeUpdate = () => onTimeUpdate?.(player.getCurrentFrame() / fps)
    const handleEnd = () => onEnd?.()
    player.addEventListener('play', handlePlay)
    player.addEventListener('pause', handlePause)
    player.addEventListener('timeupdate', handleTimeUpdate)
    player.addEventListener('ended', handleEnd)

    return () => {
      player.removeEventListener('play', handlePlay)
      player.removeEventListener('pause', handlePause)
      player.removeEventListener('timeupdate', handleTimeUpdate)
      player.removeEventListener('ended', handleEnd)
    }
  }, [onPlayStateChange, onTimeUpdate, onEnd])

  if (durationInFrames < 1) return null

  return (
    <DraftRenderProvider value={context}>
      <RemotionPlayer
        ref={setPlayer}
        component={Renderer}
        schema={RenderPropsSchema}
        inputProps={{ draft }}
        durationInFrames={durationInFrames}
        compositionWidth={width}
        compositionHeight={height}
        fps={fps}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          ...style,
        }}
        acknowledgeRemotionLicense
        {...rest}
      />
    </DraftRenderProvider>
  )
})
