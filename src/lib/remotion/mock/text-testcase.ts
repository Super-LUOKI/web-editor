import { RenderDraftData } from '../editor-render/schema/schema'

export const TextTestcaseDraft: RenderDraftData = {
  timeline: {
    assets: {},
    elements: {
      luo_1: {
        id: 'luo_1',
        type: 'text',
        x: 100,
        y: 100,
        text: '黄初三年，余朝京师，还济洛川。',
        start: 0,
        length: 30,
        style: {
          fontSize: 60,
          color: '#FFD700',
          textAlign: 'left',
          fontFamily: '宋体',
          fontWeight: 'bold',
          textShadow: '2px 2px 6px #000000',
        },
      },
      luo_2: {
        id: 'luo_2',
        type: 'text',
        x: 1200,
        y: 150,
        text: '古人有言，斯水之神，名曰宓妃。',
        start: 2,
        length: 28,
        style: {
          fontSize: 50,
          color: '#87CEFA',
          textAlign: 'right',
          fontFamily: '楷体',
          fontWeight: 'normal',
          textShadow: '1px 1px 3px #000000',
          transform: 'rotate(-10deg)',
        },
      },
      luo_3: {
        id: 'luo_3',
        type: 'text',
        x: 400,
        y: 300,
        text: '翩若惊鸿',
        start: 4,
        length: 26,
        style: {
          fontSize: 100,
          color: '#FF69B4',
          textAlign: 'center',
          fontFamily: '隶书',
          fontWeight: 'bold',
          textShadow: '2px 2px 8px #222',
          transform: 'rotate(8deg)',
        },
      },
      luo_4: {
        id: 'luo_4',
        type: 'text',
        x: 1000,
        y: 500,
        text: '婉若游龙',
        start: 6,
        length: 24,
        style: {
          fontSize: 80,
          color: '#00FA9A',
          textAlign: 'left',
          fontFamily: '楷体',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px #333',
          transform: 'rotate(-5deg)',
        },
      },
      luo_5: {
        id: 'luo_5',
        type: 'text',
        x: 1600,
        y: 300,
        text: '荣曜秋菊',
        start: 8,
        length: 22,
        style: {
          fontSize: 60,
          color: '#FFFFFF',
          textAlign: 'right',
          fontFamily: '宋体',
          fontWeight: 'normal',
          textShadow: '0 0 10px #888',
          opacity: 0.8,
        },
      },
      luo_6: {
        id: 'luo_6',
        type: 'text',
        x: 100,
        y: 600,
        text: '华茂春松',
        start: 10,
        length: 20,
        style: {
          fontSize: 60,
          color: '#00CED1',
          textAlign: 'left',
          fontFamily: '仿宋',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px #000',
          transform: 'rotate(90deg)',
        },
      },
      luo_7: {
        id: 'luo_7',
        type: 'text',
        x: 800,
        y: 700,
        text: '髣髴兮若轻云之蔽月，飘飖兮若流风之回雪。',
        start: 12,
        length: 18,
        style: {
          fontSize: 40,
          color: '#aaa',
          textAlign: 'center',
          fontFamily: '楷体',
          fontWeight: 'lighter',
          textShadow: '1px 1px 2px #111',
          opacity: 0.6,
        },
      },
    },
    tracks: [
      {
        id: 'luo_track',
        type: 'text',
        clips: [
          { elementId: 'luo_1' },
          { elementId: 'luo_2' },
          { elementId: 'luo_3' },
          { elementId: 'luo_4' },
          { elementId: 'luo_5' },
          { elementId: 'luo_6' },
          { elementId: 'luo_7' },
        ],
      },
    ],
  },
  meta: {
    width: 1920,
    height: 1080,
    fps: 30,
  },
}
