import { html as litHtml, LitElement } from 'lit-element';
import { html } from '../../index.js';
import { ComponentC, ComponentD } from './composed-components.js';
import { defineCE } from './utils.js';

defineCE('component-c', ComponentC);

const ITERATIONS = 20;

function* getText() {
  let counter = 0;

  while (true) {
    counter += 1;
    yield `That's awesome - ${counter}`;
  }
}

const textGenerator = getText();

export class ComponentE extends LitElement {
  renderItem() {
    return [...Array(ITERATIONS).keys()].map(
      key => litHtml`
            <div>
                <p>${textGenerator.next().value}</p>
                <component-c text="Click me ${key}!"></component-c>
            </div>
        `,
    );
  }

  render() {
    return litHtml`${this.renderItem()}`;
  }
}

export class ComponentF extends LitElement {
  renderItem() {
    return [...Array(ITERATIONS).keys()].map(
      key => html`
            <div>
                <p>${textGenerator.next().value}</p>
                <${ComponentD} text="Click me ${key}!"></${ComponentD}>
            </div>
        `,
    );
  }

  render() {
    return html`
      ${this.renderItem()}
    `;
  }
}
