import { html as litHtml, LitElement } from 'lit-element';
import { html } from '../../index.js';
import { ComponentA, ComponentB } from './simple-components.js';
import { defineCE } from './utils.js';

defineCE('component-a', ComponentA);

export class ComponentC extends LitElement {
  static get properties() {
    return {
      text: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.text = 'Click me!';
  }

  render() {
    return litHtml`
      <component-a>${this.text}</component-a>
    `;
  }
}

export class ComponentD extends LitElement {
  static get properties() {
    return {
      text: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.text = 'Click me!';
  }

  render() {
    return html`
      <${ComponentB}>${this.text}</${ComponentB}>
    `;
  }
}
