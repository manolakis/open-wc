# Auto define (custom elements)

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Complex Web Component applications often are developed by several teams across organizations. In
that scenario is common that shared component libraries are used by teams to create an homogeneous
look and feel or just to avoid creating the same components several times, but as those libraries
evolve name collision problems between different versions of the same library appear because teams
are not able to evolve their code at the same velocity. That causes bottlenecks in software delivery
that should be managed by the teams and complex build systems trying to alleviate the problem.

[Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal
that tries to fix that problem, but until is ready and we could use a polyfill in those browsers
that do not implement it, auto scoping the custom elements is a workaround.

This package allows you to forget about how the custom elements are defined inside the registry.
It's going to register them for you, scoping the name if necessary avoiding the class name
collision, and allowing you to use different versions of the same component in your code.

## Installation

```bash
npm i --save @open-wc/auto-define
```

## How it works

In order to use this feature just import the `autoDefine` and `html` functions from
`@open-wc/auto-define` and use them in the following way.

```js
import { css, LitElement } from 'lit-element';
import { autoDefine, html } from '@open-wc/auto-define'; // <-- import the autoDefine and html functions
import MyButton from './MyButton.js'; // <-- import your dependency class
import MyPanel from './MyPanel.js'; // <-- import your dependency class

const [myButton, myPanel] = autoDefine(MyButton, MyPanel); // <-- auto define the components that you are going to use

export default class MyElement extends LitElement {
  static get styles() {
    return css`
      .my-panel {
        padding: 10px;
        background-color: grey;
      }
    `;
  }

  static get properties() {
    return {
      text: String,
    };
  }

  render() {
    return html`<${myPanel} class="my-panel"><${myButton}>${this.text}</${myButton}></${myPanel}>`; // <-- use them just like other parameters
  }
}
```

`autoDefine` is going to define the custom element classes and creates a unique scoped tag (if
necessary) for each of them. In case those classes were previously defined then it's going to return
the previous unique tag.

Then, the `html` function provided by `@open-wc/auto-define` are going to detect those tags and they
are going to transform the template literal into another one with those tags resolved and prepared
to be processed by `lit-html`.

`<${myButton}>${this.text}</${myButton}>` --> `<my-button-3>${this.text}</my-button-3>`

## When to use

If you are creating a custom element that depends on other custom elements then you should use
`@open-wc/auto-define` to forget about how those custom elements on which yours depends are defined
in the registry.

```js
// MyElement.js
import { LitElement } from 'lit-element';
import { autoDefine, html } from '@open-wc/auto-define'; // <-- import the autoDefine and html functions
import MyButton from './MyButton.js'; // your custom element depends on it

const [myButton] = autoDefine(MyButton);

export default class MyElement extends LitElement {
  render() {
    return html`
      <${myButton}>Click me!</${myButton}>
    `;
  }
}
```

## When not to use it

In the case you are developing a custom element that doesn't depends on other custom elements then
you shouldn't use it. The reason of that is because there is a little performance penalty on using
it, and it's better to avoid it if we can.

```js
// MyButton.js
import { html, LitElement } from 'lit-element';

export default class MyButton extends LitElement {
  render() {
    return html`
      <button><slot></slot></button>
    `;
  }
}
```

Performance can vary on each machine, but percentages seems to be stable. [Tachometer](https://github.com/Polymer/tachometer)
has been used to measure the performance.

Those are some examples obtained.

```bash
Running benchmarks

[==========================================================] done

⠋ Auto-sample 40 (timeout in 9m47s)

┌─────────────┬──────────────┐
│     Version │ <none>       │
├─────────────┼──────────────┤
│     Browser │ chrome       │
│             │ 79.0.3945.88 │
├─────────────┼──────────────┤
│ Sample size │ 90           │
└─────────────┴──────────────┘

┌─────────────┬────────────┬───────────────────┬─────────────────┬─────────────────┐
│ Benchmark   │ Bytes      │          Avg time │  vs lit-element │  vs auto-define │
├─────────────┼────────────┼───────────────────┼─────────────────┼─────────────────┤
│ lit-element │ 185.99 KiB │ 39.17ms - 40.71ms │                 │          faster │
│             │            │                   │        -        │         1% - 6% │
│             │            │                   │                 │ 0.24ms - 2.46ms │
├─────────────┼────────────┼───────────────────┼─────────────────┼─────────────────┤
│ auto-define │ 190.46 KiB │ 40.49ms - 42.09ms │          slower │                 │
│             │            │                   │         1% - 6% │        -        │
│             │            │                   │ 0.24ms - 2.46ms │                 │
└─────────────┴────────────┴───────────────────┴─────────────────┴─────────────────┘
```

```bash
Running benchmarks

[==========================================================] done



┌─────────────┬─────────┐
│     Version │ <none>  │
├─────────────┼─────────┤
│     Browser │ firefox │
│             │ 71.0    │
├─────────────┼─────────┤
│ Sample size │ 50      │
└─────────────┴─────────┘

┌─────────────┬────────────┬───────────────────┬─────────────────┬─────────────────┐
│ Benchmark   │ Bytes      │          Avg time │  vs lit-element │  vs auto-define │
├─────────────┼────────────┼───────────────────┼─────────────────┼─────────────────┤
│ lit-element │ 185.99 KiB │ 26.58ms - 27.46ms │                 │          faster │
│             │            │                   │        -        │         3% - 9% │
│             │            │                   │                 │ 0.74ms - 2.78ms │
├─────────────┼────────────┼───────────────────┼─────────────────┼─────────────────┤
│ auto-define │ 190.46 KiB │ 27.86ms - 29.70ms │          slower │                 │
│             │            │                   │        3% - 10% │        -        │
│             │            │                   │ 0.74ms - 2.78ms │                 │
└─────────────┴────────────┴───────────────────┴─────────────────┴─────────────────┘
```

In order to run the benchmarks from your machine you must execute `npx tachometer --config packages/auto-define/shack.json`
from the `open-wc` folder.

Editing `packages/auto-define/shack.json` you can configure in which browser you want to run the benchmarks.

## Special thanks

This package was inspired by [carehtml](https://github.com/bashmish/carehtml) and I would like to
thank [@bashmish](https://github.com/bashmish) for his work on it.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/classes-in-html/README.md';
      }
    }
  }
</script>
