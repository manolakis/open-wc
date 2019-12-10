import { fromCache, toCache } from './cache.js';
import { isStaticTag } from './scoped-registry.js';

const transform = (strings, values) => {
  const tags = new Array(values.length);
  const newValues = [];
  const newStrings = [strings[0]];
  let containsTags = false;

  values.forEach((value, index) => {
    if (isStaticTag(value)) {
      containsTags = true;
      tags[index] = value.get();
      newStrings[newStrings.length - 1] += value.get() + strings[index + 1];
    } else {
      newValues.push(value);
      newStrings.push(strings[index + 1]);
    }
  });

  const storedStrings = containsTags ? newStrings : strings;

  toCache(strings, {
    tags,
    strings: storedStrings,
  });

  return [storedStrings, ...newValues];
};

export default (strings, values) => fromCache(strings, values) || transform(strings, values);
