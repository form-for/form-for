import { stringHelpers } from "form-for-component-helpers";

type Hash = { [key: string]: string };

export default function humanizeOptions(options: string[] | Hash): Hash {
  if (!Array.isArray(options)) return options;

  const humanizedOptions = {};
  options.forEach(option => {
    humanizedOptions[option] = stringHelpers.humanize(option);
  });

  return humanizedOptions;
}
