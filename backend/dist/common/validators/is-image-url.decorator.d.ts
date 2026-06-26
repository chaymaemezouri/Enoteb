import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsImageUrlConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean;
    defaultMessage(): string;
}
export declare function IsImageUrl(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
