"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const mail_utils_1 = require("./mail.utils");
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = null;
    }
    isConfigured() {
        return (0, mail_utils_1.isSmtpConfigured)(this.config.get('smtp'));
    }
    async sendMail(to, subject, html, options) {
        if (!this.isConfigured()) {
            this.logger.warn(`SMTP non configuré — email non envoyé : "${subject}" → ${to}`);
            return;
        }
        const smtp = this.config.get('smtp');
        try {
            await this.getTransporter().sendMail({
                from: `"ENOTEB" <${smtp.user}>`,
                to,
                subject,
                html,
                ...(options?.replyTo ? { replyTo: options.replyTo } : {}),
            });
            this.logger.log(`Email envoyé avec succès : "${subject}" → ${to}`);
        }
        catch (error) {
            this.logger.error(`Échec d'envoi email "${subject}" → ${to} : ${String(error)}`);
        }
    }
    getTransporter() {
        if (!this.transporter) {
            const smtp = this.config.get('smtp');
            this.transporter = nodemailer.createTransport({
                host: smtp.host,
                port: smtp.port,
                secure: smtp.port === 465,
                auth: {
                    user: smtp.user,
                    pass: smtp.pass,
                },
            });
        }
        return this.transporter;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map