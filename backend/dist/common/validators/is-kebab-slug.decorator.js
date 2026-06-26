"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsKebabSlugConstraint = void 0;
exports.IsKebabSlug = IsKebabSlug;
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
let IsKebabSlugConstraint = class IsKebabSlugConstraint {
    validate(value) {
        return typeof value === 'string' && constants_1.KEBAB_SLUG_REGEX.test(value);
    }
    defaultMessage() {
        return constants_1.KEBAB_SLUG_MESSAGE;
    }
};
exports.IsKebabSlugConstraint = IsKebabSlugConstraint;
exports.IsKebabSlugConstraint = IsKebabSlugConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isKebabSlug', async: false })
], IsKebabSlugConstraint);
function IsKebabSlug(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsKebabSlugConstraint,
        });
    };
}
//# sourceMappingURL=is-kebab-slug.decorator.js.map