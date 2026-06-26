"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = void 0;
const Joi = require("joi");
exports.envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
    PORT: Joi.number().port().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().port().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    CONTACT_EMAIL: Joi.string().email().required(),
    CORS_ORIGIN: Joi.string().required(),
    UPLOAD_DIR: Joi.string().required(),
    MAX_FILE_SIZE: Joi.number().positive().required(),
}).unknown(true);
//# sourceMappingURL=env.validation.js.map