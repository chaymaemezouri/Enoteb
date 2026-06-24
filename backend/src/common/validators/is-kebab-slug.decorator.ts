import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { KEBAB_SLUG_MESSAGE, KEBAB_SLUG_REGEX } from '../constants';

@ValidatorConstraint({ name: 'isKebabSlug', async: false })
export class IsKebabSlugConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && KEBAB_SLUG_REGEX.test(value);
  }

  defaultMessage(): string {
    return KEBAB_SLUG_MESSAGE;
  }
}

export function IsKebabSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsKebabSlugConstraint,
    });
  };
}
