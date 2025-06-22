import { ImageElement } from '@/lib/remotion/editor-render/schema/element'

/**
 * 在画布上绘制视频的时间轴缩略图
 *
 * 该函数会从视频中提取多个时间点的帧，并将它们水平排列绘制到画布上，
 * 形成一个视频时间轴的缩略图预览效果。
 *
 * @param videoUrl - 视频文件的URL地址
 * @param canvas - 用于绘制缩略图的HTML画布元素
 * @param options - 可选的配置参数
 * @param options.samplingRate - 采样率，控制提取帧的密度。范围0-1，1表示最高密度，0.1表示10%的帧会被提取
 * @param options.from - 开始时间（秒），从视频的哪个时间点开始提取帧
 * @param options.to - 结束时间（秒），到视频的哪个时间点停止提取帧
 * @param options.fps - 帧率，用于计算时间间隔。默认为1fps，即每秒提取1帧
 * @returns Promise<void> - 绘制完成后的Promise
 *
 * @example
 * ```typescript
 * // 基本用法：提取整个视频的缩略图
 * await drawVideoTimeFrame('video.mp4', canvas);
 *
 * // 高级用法：提取视频前30秒的缩略图，采样率50%
 * await drawVideoTimeFrame('video.mp4', canvas, {
 *   from: 0,
 *   to: 30,
 *   samplingRate: 0.5,
 *   fps: 2
 * });
 * ```
 */
export async function drawVideoTimeFrame(
  videoUrl: string,
  canvas: HTMLCanvasElement,
  options?: {
    samplingRate?: number
    from?: number
    to?: number
    fps?: number
  }
): Promise<void> {
  const { samplingRate = 1, from = 0, to = 1e9, fps = 1 } = options || {}
  const timeFrom = Math.max(0, from)

  if (samplingRate < 0 || samplingRate > 1) {
    throw new Error('samplingRate must between 0 and 1')
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('failed to obtain canvas')
  }

  const video = document.createElement('video')
  video.src = videoUrl
  video.crossOrigin = 'anonymous'

  await new Promise((resolve, reject) => {
    video.addEventListener('loadedmetadata', resolve)
    video.addEventListener('error', reject)
  })

  const timeTo = Math.min(video.duration, to)
  const videoDuration = timeTo - timeFrom
  const videoWidth = video.videoWidth
  const videoHeight = video.videoHeight

  canvas.height = parseInt(window.getComputedStyle(canvas).height) || canvas.height
  canvas.width = parseInt(window.getComputedStyle(canvas).width) || canvas.width

  const frameHeight = canvas.height
  const aspectRatio = videoWidth / videoHeight
  const frameWidth = frameHeight * aspectRatio

  const totalFrames = Math.ceil(videoDuration * fps * (samplingRate || 0.01))
  const timeInterval = videoDuration / totalFrames

  const framesNeeded = Math.ceil(canvas.width / frameWidth)

  const frameIndices = Array.from({ length: framesNeeded }, (_, i) =>
    Math.floor((i * totalFrames) / framesNeeded)
  )

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < framesNeeded; i++) {
    const captureTime = timeFrom + frameIndices[i] * timeInterval
    video.currentTime = captureTime

    await new Promise(resolve => {
      video.addEventListener('seeked', resolve, { once: true })
    })

    const x = i * frameWidth

    if (x > canvas.width) break
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, x, 0, frameWidth, frameHeight)
  }
}

export async function drawAudioWaveform(
  audioUrl: string,
  canvas: HTMLCanvasElement,
  options?: {
    samplingRate?: number // 0 ~ 1，决定采样精度
    channelIndex?: number // 默认取第0声道
    color?: string // 波形颜色
  }
): Promise<void> {
  const { samplingRate = 1, channelIndex = 0, color = '#4fc3f7' } = options || {}

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context')

  // 创建 AudioContext 并加载音频数据
  const audioCtx = new AudioContext()
  const response = await fetch(audioUrl)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

  const channelData = audioBuffer.getChannelData(channelIndex)
  const totalSamples = channelData.length

  canvas.height = parseInt(window.getComputedStyle(canvas).height) || canvas.height
  canvas.width = parseInt(window.getComputedStyle(canvas).width) || canvas.width

  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)

  const samples = Math.floor(width * (samplingRate || 1))
  const blockSize = Math.floor(totalSamples / samples)

  ctx.fillStyle = color

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize
    let max = 0

    for (let j = 0; j < blockSize; j++) {
      const v = Math.abs(channelData[start + j])
      if (v > max) max = v
    }

    const barHeight = max * height
    const x = i
    const y = (height - barHeight) / 2

    ctx.fillRect(x, y, 1, barHeight)
  }

  audioCtx.close()
}

export async function drawImageTimeFrame(
  url: string,
  canvas: HTMLCanvasElement,
  imgEl?: HTMLImageElement | null
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('failed to obtain canvas context')
  }

  let img = imgEl
  if (!img) {
    img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
  }

  //   wait for image loaded
  if (!(img.complete && img.naturalWidth > 0)) {
    await new Promise((resolve, reject) => {
      img.addEventListener('load', resolve)
      img.addEventListener('error', reject)
    })
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  canvas.height = parseInt(window.getComputedStyle(canvas).height) || canvas.height
  canvas.width = parseInt(window.getComputedStyle(canvas).width) || canvas.width

  const imageAspectRatio = img.width / img.height
  const imageThumbnailWidth = canvas.height * imageAspectRatio

  let walkedWidth = 0
  while (walkedWidth < canvas.width) {
    ctx.drawImage(img, walkedWidth, 0, imageThumbnailWidth, canvas.height)
    // debugger
    walkedWidth += imageThumbnailWidth
  }
}
