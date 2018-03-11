// @flow

import { humanize } from './stringHelpers';

export default function humanized(Component: any): string {
  return humanize(Component.props.name);
}
