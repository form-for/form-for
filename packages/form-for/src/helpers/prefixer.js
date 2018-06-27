export default function prefixer(...prefixes: (?string)[]) {
  return prefixes
    .filter(prefix => prefix || prefix === 0)
    .map((prefix: string, index: number) => (index === 0 ? prefix : `[${prefix}]`))
    .join('');
}
