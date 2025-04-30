import { useEffect } from 'react'

export function Script(
  props: React.ComponentProps<'script'> & {
    src?: string
    dangerouslySetInnerHTML?: { __html?: string }
    async?: boolean
    defer?: boolean
    onLoad?: () => void
  }
) {
  useEffect(() => {
    const script = document.createElement('script')
    if (props.src) {
      script.src = props.src
    } else if (props.dangerouslySetInnerHTML?.__html) {
      script.innerHTML = props.dangerouslySetInnerHTML.__html
    }
    script.async = props.async ?? true
    if (props.defer) {
      script.defer = true
    }
    if (props.onLoad) {
      script.onload = props.onLoad
    }
    for (const key in props) {
      if (key.startsWith('data-')) {
        script.setAttribute(key, `${(props as Record<string, unknown>)[key]}`)
      }
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  return null
}
