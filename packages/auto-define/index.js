import { html as litHtml } from 'lit-element';
import { htmlWrapper } from './src/html-wrapper.js';

export { autoDefine, isStaticTag, staticTag } from './src/scoped-registry.js';

export const html = htmlWrapper(litHtml);
