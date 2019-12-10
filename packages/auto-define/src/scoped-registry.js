function* counterFunc() {
  let counter = 0;

  while (true) {
    counter += 1;
    yield counter;
  }
}

const counter = counterFunc();

const STATIC_TAG_PROPERTY = '$tag$';
export const isStaticTag = tag => tag.type && tag.type === STATIC_TAG_PROPERTY;
export const staticTag = name => ({ type: STATIC_TAG_PROPERTY, get: () => name });

const toDashCase = name => {
  const dashCaseLetters = [];

  for (let i = 0; i < name.length; i += 1) {
    const letter = name[i];
    const letterLowerCase = letter.toLowerCase();

    if (letter !== letterLowerCase && i !== 0) {
      dashCaseLetters.push('-');
    }

    dashCaseLetters.push(letterLowerCase);
  }

  return dashCaseLetters.join('');
};

const isElementRegistered = (registry, name) => !!registry.get(name);

const incrementTagName = (registry, tag) => {
  const newName = `${tag}-${counter.next().value}`;

  if (isElementRegistered(registry, newName)) {
    return incrementTagName(registry, tag);
  }

  return newName;
};

const getTagName = (registeredElements, registry, klass) => {
  const name = klass.name && klass.name.replace(/[^a-zA-Z0-9]/g, '');
  if (name) {
    let tag = toDashCase(name);

    if (tag.indexOf('-') === -1) {
      tag = `c-${tag}`;
    }

    if (isElementRegistered(registry, tag)) {
      return incrementTagName(registry, tag);
    }

    return tag;
  }

  return incrementTagName(registry, 'c');
};

const registerElement = (registeredElements, registry, klass) => {
  const tag = getTagName(registeredElements, registry, klass);

  registry.define(tag, class extends klass {});
  registeredElements.set(klass, tag);

  return tag;
};

class ScopedCustomElementRegistry {
  constructor(registry) {
    this.registeredElements = new Map();
    this._registry = registry;

    this.autoDefine = this.autoDefine.bind(this);
  }

  get registry() {
    return this._registry;
  }

  autoDefine(...elements) {
    return elements
      .map(
        klass =>
          this.registeredElements.get(klass) ||
          registerElement(this.registeredElements, this._registry, klass),
      )
      .map(tag => staticTag(tag));
  }
}

export const { autoDefine } = new ScopedCustomElementRegistry(customElements);
