import { expect, fixture } from '@open-wc/testing';
import { html as litHtml } from 'lit-element';
import { html } from '../index.js';
import { createSuite } from './benchmark.js';
import { defineCE } from './benchmark/utils.js';

const getRate = (statsA, statsB) => Math.trunc(((statsB.ops - statsA.ops) * 100) / statsA.ops);

describe('classes in HTML', () => {
  describe('simple components', () => {
    it('performance penalty should be below 15%', async () => {
      const { ComponentA, ComponentB } = await import('./benchmark/simple-components.js');

      defineCE('component-a', ComponentA);
      defineCE('component-b', ComponentB);

      const [statsA, statsB, statsC] = await createSuite()
        .add(async () => fixture(litHtml`<component-a></component-a>`))
        .add(async () => fixture(litHtml`<component-b></component-b>`))
        .add(async () => fixture(html`<${ComponentB}></${ComponentB}>`))
        .run();

      const penaltyB = getRate(statsA, statsB);
      const penaltyC = getRate(statsA, statsC);
      console.info(`Performance penalties are ${penaltyB}% and ${penaltyC}%`);

      expect(penaltyB).to.be.below(15);
      expect(penaltyC).to.be.below(15);
    });
  });

  describe('composed components', () => {
    it('performance penalty should be below 15%', async () => {
      const { ComponentC, ComponentD } = await import('./benchmark/composed-components.js');

      defineCE('component-c', ComponentC);
      defineCE('component-d', ComponentD);

      const [statsA, statsB, statsC] = await createSuite()
        .add(async () => fixture(litHtml`<component-c></component-c>`))
        .add(async () => fixture(litHtml`<component-d></component-d>`))
        .add(async () => fixture(html`<${ComponentD}></${ComponentD}>`))
        .run();

      const penaltyB = getRate(statsA, statsB);
      const penaltyC = getRate(statsA, statsC);
      console.info(`Performance penalties are ${penaltyB}% and ${penaltyC}%`);

      expect(penaltyB).to.be.below(15);
      expect(penaltyC).to.be.below(15);
    });
  });

  describe('complex components', () => {
    it('performance penalty should be below 15%', async function() {
      this.timeout(50000);

      const { ComponentE, ComponentF } = await import('./benchmark/complex-components.js');

      defineCE('component-e', ComponentE);
      defineCE('component-f', ComponentF);

      const [statsA, statsB, statsC] = await createSuite()
        .add(async () => fixture(litHtml`<component-e></component-e>`))
        .add(async () => fixture(litHtml`<component-f></component-f>`))
        .add(async () => fixture(html`<${ComponentF}></${ComponentF}>`))
        .run();

      const penaltyB = getRate(statsA, statsB);
      const penaltyC = getRate(statsA, statsC);
      console.info(`Performance penalties are ${penaltyB}% and ${penaltyC}%`);

      expect(penaltyB).to.be.below(15);
      expect(penaltyC).to.be.below(15);
    });
  });
});
