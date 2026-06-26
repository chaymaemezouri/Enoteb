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
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("./constants");
const PLACEHOLDER_SMTP_HOSTS = new Set(['smtp.example.com', 'example.com', 'localhost']);
let ContactService = ContactService_1 = class ContactService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ContactService_1.name);
    }
    async sendContactMessage(dto) {
        if (dto.website?.trim()) {
            this.logger.warn('Honeypot déclenché sur le formulaire de contact');
            return {
                success: true,
                message: constants_1.CONTACT_SUCCESS_MESSAGE,
            };
        }
        try {
            await this.prisma.contactRequest.create({
                data: {
                    name: dto.name.trim(),
                    email: dto.email.trim().toLowerCase(),
                    phone: dto.phone?.trim() || null,
                    company: dto.company?.trim() || null,
                    message: dto.message.trim(),
                },
            });
        }
        catch (error) {
            this.logger.error(`Échec d'enregistrement de la demande de contact : ${String(error)}`);
            throw new common_1.InternalServerErrorException({
                success: false,
                message: constants_1.CONTACT_FAILURE_MESSAGE,
            });
        }
        if (!this.isSmtpConfigured()) {
            this.logger.warn('SMTP non configuré — la demande est enregistrée et visible dans l’admin.');
            return {
                success: true,
                message: constants_1.CONTACT_SUCCESS_MESSAGE,
            };
        }
        const smtp = this.config.get('smtp');
        const contactEmail = this.config.get('contactEmail');
        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.port === 465,
            auth: {
                user: smtp.user,
                pass: smtp.pass,
            },
        });
        const phoneLine = dto.phone
            ? `Téléphone : ${dto.phone}`
            : 'Téléphone : non renseigné';
        const companyLine = dto.company?.trim()
            ? `Entreprise : ${dto.company.trim()}`
            : 'Entreprise : non renseignée';
        const text = [
            `Nom : ${dto.name}`,
            `Email : ${dto.email}`,
            phoneLine,
            companyLine,
            '',
            'Message :',
            dto.message,
        ].join('\n');
        const html = `
      <p><strong>Nom :</strong> ${escapeHtml(dto.name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(dto.email)}</p>
      <p><strong>Téléphone :</strong> ${dto.phone ? escapeHtml(dto.phone) : 'non renseigné'}</p>
      <p><strong>Entreprise :</strong> ${dto.company?.trim() ? escapeHtml(dto.company.trim()) : 'non renseignée'}</p>
      <hr />
      <p><strong>Message :</strong></p>
      <p>${escapeHtml(dto.message).replace(/\n/g, '<br />')}</p>
    `;
        try {
            await transporter.sendMail({
                from: `"Formulaire eNoteb" <${smtp.user}>`,
                to: contactEmail,
                replyTo: dto.email,
                subject: `[Contact eNoteb] Message de ${dto.name}`,
                text,
                html,
            });
        }
        catch (error) {
            this.logger.error(`Échec d'envoi email (demande enregistrée en admin) : ${String(error)}`);
        }
        return {
            success: true,
            message: constants_1.CONTACT_SUCCESS_MESSAGE,
        };
    }
    isSmtpConfigured() {
        const smtp = this.config.get('smtp');
        const host = smtp?.host?.trim().toLowerCase() ?? '';
        const user = smtp?.user?.trim() ?? '';
        const pass = smtp?.pass?.trim() ?? '';
        const port = smtp?.port;
        if (!host || !user || !pass || !port || Number.isNaN(port)) {
            return false;
        }
        if (PLACEHOLDER_SMTP_HOSTS.has(host)) {
            return false;
        }
        if (pass === 'change-me' || user.includes('example.com')) {
            return false;
        }
        return true;
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], ContactService);
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
//# sourceMappingURL=contact.service.js.map