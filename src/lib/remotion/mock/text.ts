import { RenderDraftData } from "../editor-render/schema/schema";

export const TextDraft: RenderDraftData = {
  timeline: {
    assets: {},
    elements: {
      test_text_1: {
        id: 'test_text_1',
        type: 'text',
        x:100,
        y:100,
        text:'Hello World',
        start: 1,
        length: 3,
        style:{
          fontSize: 100,
          color: '#000',
          textAlign: 'center',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px #000000',
        }
      },
      test_text_2: {
        type: 'text',
        id: 'test_text_2',
        x:200,
        y:50,
        text:'LuoKing',
        start: 2,
        length: 4,
        style:{
          fontSize: 50,
          color: '#f00',
          textAlign: 'left',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textShadow: '1px 1px 2px #000000',
        }
      },

    },
    tracks: [
      {
        id: 'test_track_1',
        type: 'text',
        clips: [
          { elementId: 'test_text_1' },
          { elementId: 'test_text_2' }
        ],
      },
    ]
  },
  meta: {
    width: 1920,
    height: 1080,
    fps: 30,
  }
}