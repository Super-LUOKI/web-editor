import { createFileRoute } from '@tanstack/react-router'

import { EditorPage } from '@/feature/editor/page'

export const Route = createFileRoute('/editor/')({ component: EditorPage })
