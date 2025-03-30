import { createFileRoute } from '@tanstack/react-router'

import { ProjectPage } from "@/feature/home/page/project-page.tsx";

export const Route = createFileRoute('/projects/')({ component: ProjectPage, })
