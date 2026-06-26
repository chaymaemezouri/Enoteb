"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsImageUrlConstraint = void 0;
exports.IsImageUrl = IsImageUrl;
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
const REMOTE_URL_REGEX = /^https?:\/\/.+/i;
let IsImageUrlConstraint = class IsImageUrlConstraint {
    validate(value) {
        if (typeof value !== 'string' || value.length === 0) {
            return false;
        }
        if (value.startsWith(`${constants_1.UPLOAD_PUBLIC_PREFIX}/`)) {
            const filename = value.slice(`${constants_1.UPLOAD_PUBLIC_PREFIX}/`.length);
            return filename.length > 0 && !filename.includes('..') && !filename.includes('/');
        }
        return REMOTE_URL_REGEX.test(value);
    }
    defaultMessage() {
        return 'URL d’image invalide (chemin /uploads/ ou URL http(s))';
    }
};
exports.IsImageUrlConstraint = IsImageUrlConstraint;
exports.IsImageUrlConstraint = IsImageUrlConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isImageUrl', async: false })
], IsImageUrlConstraint);
function IsImageUrl(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsImageUrlConstraint,
        });
    };
}
//# sourceMappingURL=is-image-url.decorator.js.map