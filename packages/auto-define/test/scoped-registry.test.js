import { expect } from '@open-wc/testing';
import { autoDefine } from '../src/scoped-registry.js';

describe('scoped-registry', () => {
  it('should auto define one element', () => {
    class MyViolet extends HTMLElement {}

    const [myViolet] = autoDefine(MyViolet);

    expect(myViolet.get()).to.be.equal('my-violet');
  });

  it('should auto define multiple elements', () => {
    class MyRose extends HTMLElement {}
    class MyTulip extends HTMLElement {}
    class MyLily extends HTMLElement {}

    const [myRose, myTulip, myLily] = autoDefine(MyRose, MyTulip, MyLily);

    expect(myRose.get()).to.be.equal('my-rose');
    expect(myTulip.get()).to.be.equal('my-tulip');
    expect(myLily.get()).to.be.equal('my-lily');
  });

  it('should not auto define an element previously defined', () => {
    class MyOrchid extends HTMLElement {}
    class MyCarnation extends HTMLElement {}

    const [myOrchid1] = autoDefine(MyOrchid);
    const [myOrchid2] = autoDefine(MyOrchid);
    const [myCarnation1, myCarnation2] = autoDefine(MyCarnation, MyCarnation);

    expect(myOrchid1.get()).to.be.equal('my-orchid');
    expect(myOrchid2.get()).to.be.equal('my-orchid');
    expect(myCarnation1.get()).to.be.equal('my-carnation');
    expect(myCarnation2.get()).to.be.equal('my-carnation');
  });

  it('should auto scope an element if name was previously defined', () => {
    class MyFreesia extends HTMLElement {}
    customElements.define('my-freesia', class extends HTMLElement {});
    customElements.define('my-freesia-1', class extends HTMLElement {});

    const [myFreesia] = autoDefine(MyFreesia);

    expect(myFreesia.get()).to.match(/my-freesia-\d+/);
  });

  it('should auto define anonymous elements', () => {
    const [myClass] = autoDefine(class extends HTMLElement {});

    expect(myClass.get())
      .to.be.a('string')
      .and.to.include('-');
  });

  it('should add a prefix to single name elements', () => {
    const [sample] = autoDefine(class Sample extends HTMLElement {});

    expect(sample.get())
      .to.be.a('string')
      .and.equals('c-sample');
  });
});
