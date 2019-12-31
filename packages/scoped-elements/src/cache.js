import { templatesCache } from './context.js';

export const fromCache = strings => templatesCache.get(strings);
export const toCache = (key, value) => {
  templatesCache.set(key, value);

  return value;
};
