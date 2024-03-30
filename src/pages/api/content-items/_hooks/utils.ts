export const prepareText = (text: string | string[]): string => {
  return Array.isArray(text) ? text.join(" ") : text
}
