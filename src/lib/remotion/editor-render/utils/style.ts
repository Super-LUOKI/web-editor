import { CSSProperties } from "react";

import { SizeAsset } from "../schema/asset.ts";
import { DisplayElement } from "../schema/element.ts";

/**
 * 计算媒体元素的剪裁（crop）样式
 *
 * 该函数用于生成一个样式对象（CSSProperties），用于在显示媒体元素（如图片、视频）时，
 * 实现精确的“裁剪效果” —— 即仅显示原始素材中的某个矩形区域（crop 区域）。
 *
 * @param element - 包含 crop 信息的显示元素，crop 表示裁剪区域（相对于原始素材）
 * @param asset - 原始媒体资源的宽高信息
 * @returns 返回一组样式，用于控制媒体元素的展示，使其只显示 crop 区域内容
 *
 * 💡 剪裁原理说明：
 * --------------------------------------
 * 1. 整个裁剪是通过 CSS transform 实现的：
 *    - 使用 scale 对元素非等比例放大，使得裁剪区域的尺寸与容器匹配
 *    - 使用 translate 对元素平移，使裁剪区域的左上角对齐到容器左上角
 *
 * 2. 为什么使用 objectFit = 'fill'？
 *    - 对于 <img> / <video> 等可替换元素，默认的 objectFit 是 'cover' 或 'contain'，
 *      会根据内容原始宽高比进行缩放，导致 transform 结果显示异常。
 *    - 设置为 'fill' 可以强制内容完全拉伸填满元素尺寸，确保 transform 的位置和比例精确生效。
 *
 * 3. 视觉上表现为：
 *    - 原始素材仍保持完整，只是通过缩放和平移，选择性地将 crop 区域“映射”到容器中显示。
 *    - 实现裁剪效果，不依赖 canvas 或实际裁剪文件。
 *
 * 4. 注意事项：
 *    - element的宽高应设置为 crop 的宽高，配合此样式展示才会正常
 */
export function calcCropStyle(
  element: Pick<DisplayElement, 'crop'>,
  asset: Pick<SizeAsset, 'width' | 'height'>
): CSSProperties {
  const style: CSSProperties = {
    width: '100%',
    height: '100%',
    transformOrigin: '0 0',
    objectFit: 'cover',
  };
  const { crop } = element;


  if (crop) {
    style.objectFit = 'fill';

    const scaleX = asset.width && crop.width ? (100 * asset.width) / crop.width : 100;
    const scaleY = asset.height && crop.height ? (100 * asset.height) / crop.height : 100;

    const x = asset.width ? (-100 * crop.x) / asset.width : 0;
    const y = asset.height ? (-100 * crop.y) / asset.height : 0;

    style.transform = `scale(${scaleX}%,${scaleY}%) translate(${x}%,${y}%)`;
  }
  return style;
}