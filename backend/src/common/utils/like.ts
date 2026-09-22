/** Escapes LIKE wildcards so user input matches literally. */
export function containsPattern(value: string): string {
  return `%${value.replace(/[\\%_]/g, char => `\\${char}`)}%`;
}
