const chrome = require("chrome-aws-lambda");

const isDev = process.env.NOW_REGION === "dev1";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions() {
  if (isDev) {
    return {
      args: ["--window-size=1920,1080"],
      defaultViewport: null,
      executablePath: exePath,
      headless: false
    };
  }

  return {
    args: ["--window-size=1920,1080"],
    defaultViewport: null,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  };
}

module.exports = { getOptions };
