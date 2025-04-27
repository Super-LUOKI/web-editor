import { createContext, useContext } from "react";

import { EditorManager } from "@/feature/editor/manager/editor-manager.ts";


const EditorManagerContext = createContext<EditorManager | null>(null)

export function EditorManagerProvider({ children, value }: {children: React.ReactNode, value: EditorManager}) {
  return (
    <EditorManagerContext.Provider value={value}>
      {children}
    </EditorManagerContext.Provider>
  )
}

export function useEditorManager(){
  const value = useContext(EditorManagerContext)
  if (!value) {
    throw new Error("useEditorManager must be used within a EditorManagerProvider")
  }
  return value
}