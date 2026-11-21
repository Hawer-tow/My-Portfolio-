/** True when a config value has been filled in: not empty and not still a {{TOKEN}}. */
export function isFilled(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '' && !value.includes('{{');
}
