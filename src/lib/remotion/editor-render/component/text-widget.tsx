import { useVideoConfig } from 'remotion'

import { RenderSequence } from './render-sequence.tsx'
import { VisualContainer } from './visual-container.tsx'
import { TextElement } from '../schema/element.ts'

export function TextWidget(props: { element: TextElement }) {
  const { element } = props
  const { fps } = useVideoConfig()
  return (
    <RenderSequence element={element} premountFor={1 * fps}>
      <VisualContainer element={element}>
        <div style={element.style}>{element.text}</div>
      </VisualContainer>
    </RenderSequence>
  )
}
