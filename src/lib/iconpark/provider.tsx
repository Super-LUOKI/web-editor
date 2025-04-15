import { Script } from "@/component/script.tsx";

/**
 * inject iconpark script
 */
export function IconParkProvider({ jsUrl }: { jsUrl: string }) {
  return <Script src={jsUrl}/>
}
