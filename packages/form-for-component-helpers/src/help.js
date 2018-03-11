// @flow

import uniqueId from './uniqueId';

type HelpResults = {
  id?: string,
  text?: string
};

export default function help(Component: any, text?: string): HelpResults {
  if (typeof text === 'undefined' && Component.props) {
    text = Component.props.help;
  }

  if (!text) return {};

  const id = uniqueId(Component) + '-help';
  return { id, text };
}
