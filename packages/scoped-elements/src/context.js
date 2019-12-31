// @ts-nocheck
if (!window.ScopedElements) {
  window.ScopedElements = {
    templatesCache: new WeakMap(),
    tagsCache: new Map(),
  };
}

export const { templatesCache, tagsCache } = window.ScopedElements;
