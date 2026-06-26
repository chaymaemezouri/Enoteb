import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsKebabSlugConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean;
    defaultMessage(): string;
}
export declare function IsKebabSlug(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
