"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTACT_FAILURE_MESSAGE = exports.CONTACT_SUCCESS_MESSAGE = exports.CONTACT_THROTTLE = void 0;
exports.CONTACT_THROTTLE = {
    name: 'contact',
    ttl: 60 * 60 * 1000,
    limit: 3,
};
exports.CONTACT_SUCCESS_MESSAGE = 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.';
exports.CONTACT_FAILURE_MESSAGE = "L'envoi du message a échoué. Veuillez réessayer plus tard.";
//# sourceMappingURL=constants.js.map