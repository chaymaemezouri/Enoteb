import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UPLOAD_PUBLIC_PREFIX } from '../constants';

const REMOTE_URL_REGEX = /^https?:\/\/.+/i;

@ValidatorConstraint({ name: 'isImageUrl', async: false })
export class IsImageUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string' || value.length === 0) {
      return false;
    }

    if (value.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) {
      const filename = value.slice(`${UPLOAD_PUBLIC_PREFIX}/`.length);
      return filename.length > 0 && !filename.includes('..') && !filename.includes('/');
    }

    return REMOTE_URL_REGEX.test(value);
  }

  defaultMessage(): string {
    return 'URL d’image invalide (chemin /uploads/ ou URL http(s))';
  }
}

export function IsImageUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsImageUrlConstraint,
    });
  };
}
