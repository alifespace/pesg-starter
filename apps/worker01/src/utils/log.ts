// utils/log.ts

const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

// 检测是否在 Cloudflare Workers 环境
function isCloudflareWorker(): boolean {
  return typeof WebSocketPair !== "undefined";
}

// 如果是线上 Workers 环境，就去掉颜色
function colorize(color: string, text: string) {
  if (isCloudflareWorker()) {
    return text;
  }
  return `${color}${text}${COLORS.reset}`;
}

function timestamp() {
  return new Date().toISOString();
}

export function logJson(label: string, data: unknown) {
  //   console.log(
  //     `${colorize(COLORS.blue, "[JSON]")} ${colorize(
  //       COLORS.gray,
  //       timestamp()
  //     )} ${label}`
  //   );
  //   console.log(`${colorize(COLORS.blue, "[JSON]")} ${label}`);
  console.log(`${label}\n`, JSON.stringify(data, null, 2), "\n");
}
