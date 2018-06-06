// @flow

import casex from 'casex';

export function simplifyIdName(str: string): string {
  return str.split('_id')[0];
}

export function simplifyNestedName(str: string): string {
  const lastIndexOfBracket = str.lastIndexOf('[');
  if (lastIndexOfBracket === -1) return str;

  return str.substring(lastIndexOfBracket + 1, str.length - 1);
}

export function humanize(str: string): string {
  return casex(simplifyIdName(simplifyNestedName(str)), 'Na me');
}
