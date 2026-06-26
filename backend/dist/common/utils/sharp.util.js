"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSharp = loadSharp;
function loadSharp() {
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
//# sourceMappingURL=sharp.util.js.map