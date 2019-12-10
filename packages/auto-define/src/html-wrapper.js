import html from './html.js';

export const htmlWrapper = f => (strings, ...values) => f(...html(strings, values));
