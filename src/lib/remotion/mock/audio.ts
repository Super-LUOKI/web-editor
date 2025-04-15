import { RenderDraftData } from "../editor-render/schema/schema";

export const AudioDraft: RenderDraftData = {
  timeline: {
    assets: {
      test_audio_1: {
        id: 'test_audio_1',
        type: 'audio',
        src: 'http://ws.stream.qqmusic.qq.com/C40000248kKr0q0SEk.m4a?guid=913451008&vkey=3977A42F0431B2D6D992C2C5E7BAFC324238924DD62794ABA37BDEA88B13D9896D48B5558078C2CDDFBB3ACF07CF17B67628379A40D0661C__v2b9ab33c&uin=&fromtag=120032',
        duration: 191
      },
    },
    elements: {
      test_audio_1: {
        type: 'audio',
        id: 'test_audio_1',
        assetId: 'test_audio_1',
        start: 4,
        length: 10,
        startFrom:20,
        endAt: 30,
        animation:{
          type:'keyframe',
          keyframes:[
            {
              start: 1,
              transform:{
                attributes:{ volume:1, },
                timing: {
                  type: 'cubic-bezier',
                  params:{
                    x1: 0.5,
                    y1: 0,
                    x2: 0.5,
                    y2: 1
                  }
                }
              }
            },
            {
              start: 3,
              transform:{
                attributes:{ volume: 0, },
                timing: { type: 'linear' }
              }
            },
            {
              start: 5,
              transform:{
                attributes:{ volume: 0, },
                timing: { type: 'linear' }
              }
            },
            {
              start: 6,
              transform:{
                attributes:{ volume: 1 },
                timing: { type: 'linear' }
              }
            }
          ]
        }
      },
      test_audio_2: {
        type: 'audio',
        id: 'test_audio_2',
        assetId: 'test_audio_1',
        start: 1,
        length: 10,
      },
      
    },
    tracks: [
      {
        id: 'test_track_1',
        type: 'image-video',
        clips: [
          { elementId: 'test_audio_1' },
          { elementId: 'test_audio_2' }
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