import { RenderDraftData } from "../editor-render/schema/schema";

export const ImageOnlyDraft1: RenderDraftData = {
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
        length: 2,
        width: 600,
        height: 200,
        crop: {
          x: 400,
          y: 400,
          width: 600,
          height: 200,
        },
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
      },
      test_image_2: {
        type: 'image',
        id: 'test_image_2',
        assetId: 'test_image_1',
        start: 2,
        length: 2,
        width: 1100,
        height: 826,
        x: 50,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
      },
      test_image_3: {
        type: 'image',
        id: 'test_image_3',
        assetId: 'test_image_1',
        start: 4,
        length: 2,
        width: 1100,
        height: 826,
        x: 600,
        y: 600,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
      },
    },
    tracks: [
      {
        id: 'test_track_1',
        type: 'image-video',
        clips: [
          { elementId: 'test_image_1' },
          { elementId: 'test_image_2' },
          { elementId: 'test_image_3' },
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