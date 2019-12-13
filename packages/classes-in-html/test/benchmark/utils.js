export const defineCE = (name, klass) => {
  if (!customElements.get(name)) {
    customElements.define(name, klass);
  }
};
