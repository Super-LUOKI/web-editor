import { createContext, PropsWithChildren, useContext } from "react";

export type RenderContextValue = {
    test: string
}

const RenderContext = createContext<RenderContextValue | null>(null)

export function getDefaultDraftRenderContextValue(): RenderContextValue {
  return { test: 'luoking' }
}

export function DraftRenderProvider(props: PropsWithChildren<{value?: RenderContextValue}>) {
  const { value, children } = props
  return (
    <RenderContext.Provider value={value ?? getDefaultDraftRenderContextValue()}>{children}</RenderContext.Provider>
  )
}

export const useDraftRenderContext = () => {
  const context = useContext(RenderContext)
  if (!context) {
    throw new Error("useDraftRenderContext must be used within a DraftRenderProvider")
  }
  return context
}