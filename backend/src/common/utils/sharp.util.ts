/** Compatibilité CJS / ESM — évite `sharp.default is not a function`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadSharp(): any {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('sharp');

  if (typeof mod === 'function') {
    return mod;
  }

  if (typeof mod.default === 'function') {
    return mod.default;
  }

  if (typeof mod.sharp === 'function') {
    return mod.sharp;
  }

  throw new Error('Le module sharp n’a pas pu être chargé.');
}
