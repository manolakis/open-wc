import { expect } from '@open-wc/testing';
import { fromCache, toCache } from '../src/cache.js';
import { staticTag } from '../src/scoped-registry.js';

describe('cache', () => {
  it("should return [strings] if 'values' are empty", () => {
    const strings = ['sample'];
    const values = [];

    const when = fromCache(strings, values);

    expect(when).to.be.an('array');
    expect(when[0]).to.be.equals(strings);
    expect(when.length).to.be.equals(1);
  });

  it("should return undefined if 'strings' is not registered", () => {
    const strings = ['sample'];
    const values = ['A'];

    const when = fromCache(strings, values);

    expect(when).to.be.undefined;
  });

  it("should return the same 'strings' and 'values' when cached strings are the same than provided strings", () => {
    const strings = ['sample'];
    const values = ['A'];
    toCache(strings, { strings });

    const [newStrings, ...newValues] = fromCache(strings, values);

    expect(newStrings).to.be.equal(strings);
    expect(newValues).to.be.deep.equal(values);
  });

  it('should return undefined if there is a cache failure', () => {
    const strings = ['<', '>', '</', '>'];
    const values = [staticTag('class-b'), 'text sample', staticTag('class-b')];
    toCache(strings, {
      tags: ['class-a', undefined, 'class-a'],
      strings: ['<x-a>', '</x-a>'],
    });

    const when = fromCache(strings, values);

    expect(when).to.be.undefined;
  });

  it("should return the cached 'string' with the transformed 'values' if cache matches", () => {
    const strings = ['<', '>', '</', '>'];
    const values = [staticTag('class-a'), 'text sample', staticTag('class-a')];
    const transformedStrings = ['<x-a>', '</x-a>'];
    toCache(strings, {
      tags: ['class-a', undefined, 'class-a'],
      strings: transformedStrings,
    });

    const [newStrings, ...newValues] = fromCache(strings, values);

    expect(newStrings).to.be.equal(transformedStrings);
    expect(newValues).to.be.deep.equal(['text sample']);
  });
});
