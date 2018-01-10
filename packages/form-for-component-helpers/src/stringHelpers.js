export function replaceSnakeUnderscore(str: string, glue: string = " "): string {
  return str.split(/[_|-]/).join(glue);
}

export function replaceCamels(str: string, glue: string = " "): string {
  return str.replace(/([A-Z])/g, value => glue + value.toLowerCase());
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function simplifyFieldName(str: string): string {
  const lastIndexOfBracket = str.lastIndexOf("[");
  if (lastIndexOfBracket === -1) return str;

  return str.substring(lastIndexOfBracket + 1, str.length - 1);
}

export function humanize(str: string): string {
  return capitalize(replaceSnakeUnderscore(replaceCamels(simplifyFieldName(str))));
}
