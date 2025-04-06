import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from "@/feature/home/page/home-page.tsx";

export const Route = createFileRoute('/_main/home')({ component: HomePage, })

