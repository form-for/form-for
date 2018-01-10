// @flow

import { humanize as humanizeString } from "./stringHelpers";

export default function humanized(Component: any): string {
  const props: any = Component.props || {};
  return humanizeString(props.name);
}
