import { createContext, PropsWithChildren, RefObject, useContext, useLayoutEffect } from "react";

export type BoxRegisterParams = { parent?: string; children?: string[], ref?: RefObject<HTMLElement | null> }

export type RenderContextValue = {
    /** { [elementId]: {parent: ParentElementId, children: ChildElementId[], ref: ElementDomRef} } */
    box: Partial<Record<string, BoxRegisterParams>>,
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

export function useRegisterBox(params: BoxRegisterParams & {id: string}){
  const { id, ref, parent, children } = params;
  const context = useDraftRenderContext();
    
  useLayoutEffect(()=>{
    if (!context) return;

    if (context.box[id]) {
      console.warn(`box already registered: ${id}`)
    }
    
    context.box[id] = {
      ref,
      parent,
      children,
    }
    return () => {
      delete context.box[id]
    }
  }, [])
}