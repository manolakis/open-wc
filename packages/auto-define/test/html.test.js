import { expect } from '@open-wc/testing';
import { staticTag } from '../src/scoped-registry.js';
import { toCache } from '../src/cache.js';
import html from '../src/html.js';

describe('html', () => {
  it('should transform the html to include the static tags', () => {
    const strings = ['<', '>', '</', '>'];
    const values = [staticTag('component-a'), 'sample text', staticTag('component-a')];

    const [resultStrings, ...resultValues] = html(strings, values);

    expect(resultStrings).to.deep.equal(['<component-a>', '</component-a>']);
    expect(resultValues).to.deep.equal(['sample text']);
  });

  it('should return the same strings reference if no staticTags exists in values', () => {
    const strings = ['<component-a>', '</component-a>'];
    const values = ['sample text'];

    const [resultStrings, ...resultValues] = html(strings, values);

    expect(resultStrings).to.equal(strings);
    expect(resultValues).to.deep.equal(['sample text']);
  });

  it('should return the cached version if found', () => {
    const strings = ['<', '>', '</', '>'];
    const newStrings = ['<component-a>', '</component-a>'];
    const values = [staticTag('component-a'), 'sample text', staticTag('component-a')];
    toCache(strings, {
      tags: ['component-a', undefined, 'component-a'],
      strings: newStrings,
    });

    const [resultStrings, ...resultValues] = html(strings, values);

    expect(resultStrings).to.equal(newStrings);
    expect(resultValues).to.deep.equal(['sample text']);
  });
});
