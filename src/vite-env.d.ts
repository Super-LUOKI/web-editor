/// <reference types="vite/client" />

import type * as React from 'react'
import '@total-typescript/ts-reset/filter-boolean'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconpark-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'icon-id'?: string
          name?: string
          width?: string | number
          height?: string | number
          rtl?: boolean
          spin?: boolean
          color?: string
          stroke?: string
          fill?: string
          class?: string
        },
        HTMLElement
      >
    }
  }
}
