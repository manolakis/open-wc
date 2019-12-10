import { expect } from '@open-wc/testing';
import { staticTag } from '../src/scoped-registry.js';
import { htmlWrapper } from '../src/html-wrapper.js';

describe('wrap', () => {
  it('passes strings and values as tagged templates expect', () => {
    let calledCount = 0;
    let calledArgs;
    const html = htmlWrapper((...args) => {
      calledCount += 1;
      calledArgs = args;
    });
    const myLily = staticTag('my-lily');

    html`<${myLily} id="${'my-id'}">${'my text'}</${myLily}>`;
    expect(calledCount).to.equal(1);
    expect(calledArgs).to.deep.equal([['<my-lily id="', '">', '</my-lily>'], 'my-id', 'my text']);
  });
});
