export function formatSeconds(
  seconds: number,
  format: "hh:mm:ss" | "mm:ss" | "mm:ss:x" = "mm:ss:x"
): string {
  seconds = Math.max(0, seconds);

  const totalMilliseconds = Math.floor(seconds * 1000);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const hundredMsDigit = Math.floor((totalMilliseconds % 1000) / 100); // 百毫位数

  const pad = (n: number) => n.toString().padStart(2, '0');

  switch (format) {
    case "hh:mm:ss":
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    case "mm:ss":
      return `${pad(hrs * 60 + mins)}:${pad(secs)}`;
    case "mm:ss:x":
      return `${pad(hrs * 60 + mins)}:${pad(secs)}:${hundredMsDigit}`;
  }
}
