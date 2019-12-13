import { html as litHtml, LitElement } from 'lit-element';
import { html } from '../../index.js';

export class ComponentA extends LitElement {
  render() {
    return litHtml`
      <button>
        <slot></slot>
      </button>
    `;
  }
}

export class ComponentB extends LitElement {
  render() {
    return html`
      <button>
        <slot></slot>
      </button>
    `;
  }
}
