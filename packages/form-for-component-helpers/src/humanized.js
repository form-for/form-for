// @flow

import { humanize } from './stringHelpers';

export default function humanized(Component: any): string {
  const props: any = Component.props || {};
  return humanize(props.name);
}
