export function isMobileBrowser(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ["mobile", "android", "iphone", "ipad", "windows phone"];
  for (let i = 0; i < mobileKeywords.length; i++) {
    if (userAgent.includes(mobileKeywords[i])) {
      return true;
    }
  }
  return false;
}