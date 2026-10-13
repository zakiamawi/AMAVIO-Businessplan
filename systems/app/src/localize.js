export function localize(value, language) {
  if (typeof value === 'string') return value
  return value?.[language] || value?.de || ''
}
