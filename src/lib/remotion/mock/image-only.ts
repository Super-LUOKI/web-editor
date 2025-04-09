import { EditorDraftData } from "../editor-render/schema/schema";

export const ImageOnlyDraft: EditorDraftData = {
  timeline: {
    assets: {
      test_image_1: {
        id: 'test_image_1',
        type: 'image',
        src: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tp88.net%2Farticle%2F126344-67-0.html&psig=AOvVaw3pwqzEKDSzanK2itddC0ZB&ust=1744300399668000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjFhMiny4wDFQAAAAAdAAAAABAE',
        width: 1242,
        height: 1242
      },
    },
    elements: {
      test_image_1: {
        type: 'image',
        id: 'test_image_1',
        assetId: 'test_image_1',
        start: 0,
        length: 2,
        width: 1242,
        height: 1242,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
      },
      test_image_2: {
        type: 'image',
        id: 'test_image_1',
        assetId: 'test_image_1',
        start: 3,
        length: 5,
        width: 1242,
        height: 1242,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
      },
      test_image_3: {
        type: 'image',
        id: 'test_image_1',
        assetId: 'test_image_1',
        start: 7,
        length: 9,
        width: 1242,
        height: 1242,
        x: 0,
        y: 0,
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
}