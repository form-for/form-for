export function replaceSnakeUnderscore(str: string, glue: string = ' ') {
  return str.split(/[_|-]/).join(glue);
}

export function replaceCamels(str: string, glue: string = ' ') {
  return str.replace(/([A-Z])/g, (value) => glue + value.toLowerCase());
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function humanize(str: string) {
  return capitalize(
    replaceSnakeUnderscore(
      replaceCamels(str)
    )
  );
}
