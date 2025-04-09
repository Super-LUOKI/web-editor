import { EditorDraftData } from "./schema/schema.ts";

type RenderProps = {
  draft: EditorDraftData,
}
export function Render(props: RenderProps) {
  const { draft } = props;
  return <div>{JSON.stringify(draft)}</div>
}