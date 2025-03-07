export function formatTitle(title) {
  const firstPart = title.split('.')[0]
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1)
}
