import { createContext, PropsWithChildren, RefObject, useContext } from "react";

export type RenderContextValue = {
    /** { [elementId]: {parent: ParentElementId, children: ChildElementId[], ref: ElementDomRef} } */
    box: Partial<Record<string, { parent?: string; children?: string[], ref?: RefObject<HTMLElement | undefined> }>>,
}

const RenderContext = createContext<RenderContextValue | null>(null)

export function getDefaultDraftRenderContextValue(): RenderContextValue {
  return { box:{} }
}

export function DraftRenderProvider(props: PropsWithChildren<{ value?: RenderContextValue }>) {
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