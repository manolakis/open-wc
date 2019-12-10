import { isStaticTag } from './scoped-registry.js';

const stringsCache = new WeakMap();

export const fromCache = (strings, values) => {
  if (values.length === 0) {
    return [strings];
  }

  const cached = stringsCache.get(strings);
  if (!cached) {
    return undefined; // cache failure
  }

  if (strings === cached.strings) {
    return [strings, ...values];
  }

  const newValues = [];
  for (let index = 0; index < cached.tags.length; index += 1) {
    const tag = cached.tags[index];

    if (tag === undefined) {
      newValues.push(values[index]);
    } else if (!isStaticTag(values[index]) || tag !== values[index].get()) {
      return undefined; // cache failure
    }
  }

  return [cached.strings, ...newValues];
};

export const toCache = (key, { tags = [], strings }) => {
  stringsCache.set(key, { tags, strings });
};
