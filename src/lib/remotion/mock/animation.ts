import { RenderDraftData } from "../editor-render/schema/schema";

export const AnimationDraft: RenderDraftData = {
  timeline: {
    assets: {
      test_image_1: {
        id: 'test_image_1',
        type: 'image',
        src: 'https://haowallpaper.com/link/common/file/previewFileImg/16449373166816640',
        width: 1100,
        height: 826
      },
    },
    elements: {
      test_image_1: {
        type: 'image',
        id: 'test_image_1',
        assetId: 'test_image_1',
        start: 0,
        length: 10,
        width: 600,
        height: 400,
        x: -100,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
        animation:{
          type:'keyframe',
          keyframes:[
            {
              start: 1,
              transform:{
                attributes:{
                  x: -300,
                  y: 0,
                  // rotate: 0,
                  // scaleX: 0.5,
                  // scaleY: 0.2,
                  // opacity: 1
                },
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
                attributes:{
                  x: 300,
                  y: -200,
                  // rotate: 180,
                  // scaleX: 1.5,
                  // scaleY: 1.5,
                  // opacity: 0
                },
                timing: { type: 'linear' }
              }
            },
            {
              start: 6,
              transform:{
                attributes:{
                  x: 300,
                  y: 200,
                  // rotate: 180,
                  // scaleX: 1.5,
                  // scaleY: 1.5,
                  // opacity: 0
                },
                timing: { type: 'linear' }
              }
            }
          ]
        }
      }
    },
    tracks: [
      {
        id: 'test_track_1',
        type: 'image-video',
        clips: [
          { elementId: 'test_image_1' },
        ],
      },
    ]
  },
  background: 'black',
  meta: {
    width: 1920,
    height: 1080,
    fps: 30,
  }
}