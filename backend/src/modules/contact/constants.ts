export const CONTACT_THROTTLE = {
  name: 'contact',
  ttl: 60 * 60 * 1000,
  limit: 3,
} as const;

export const CONTACT_SUCCESS_MESSAGE =
  'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.';

export const CONTACT_FAILURE_MESSAGE =
  "L'envoi du message a échoué. Veuillez réessayer plus tard.";
