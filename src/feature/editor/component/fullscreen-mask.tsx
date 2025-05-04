export function FullscreenMask(props: { show: boolean }) {
  const { show } = props

  if (!show) return null
  return <div className="w-screen h-screen fixed left-0 top-0 z-[9999] cursor-ew-resize"></div>
}
