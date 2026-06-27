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
const mail_utils_1 = require("../../common/mail/mail.utils");
const mail_service_1 = require("../../common/mail/mail.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("./constants");
let ContactService = ContactService_1 = class ContactService {
    constructor(config, prisma, mailService) {
        this.config = config;
        this.prisma = prisma;
        this.mailService = mailService;
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
        if (!this.mailService.isConfigured()) {
            this.logger.warn('SMTP non configuré — la demande est enregistrée et visible dans l’admin.');
            return {
                success: true,
                message: constants_1.CONTACT_SUCCESS_MESSAGE,
            };
        }
        const contactEmail = this.config.get('contactEmail');
        const clientEmail = dto.email.trim().toLowerCase();
        const adminSubject = `Nouvelle demande de contact - ${dto.name.trim()}`;
        const clientSubject = 'Nous avons bien reçu votre message - ENOTEB';
        const results = await Promise.allSettled([
            this.mailService.sendMail(contactEmail, adminSubject, this.buildAdminContactHtml(dto), { replyTo: clientEmail }),
            this.mailService.sendMail(clientEmail, clientSubject, this.buildClientConfirmationHtml(dto.name.trim())),
        ]);
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const target = index === 0 ? contactEmail : clientEmail;
                this.logger.error(`Échec inattendu lors de l'envoi email de contact → ${target} : ${String(result.reason)}`);
            }
        });
        return {
            success: true,
            message: constants_1.CONTACT_SUCCESS_MESSAGE,
        };
    }
    buildAdminContactHtml(dto) {
        const phone = dto.phone?.trim()
            ? (0, mail_utils_1.escapeHtml)(dto.phone.trim())
            : 'Non renseigné';
        const company = dto.company?.trim()
            ? (0, mail_utils_1.escapeHtml)(dto.company.trim())
            : 'Non renseignée';
        const message = (0, mail_utils_1.escapeHtml)(dto.message.trim()).replace(/\n/g, '<br />');
        return `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #18212b; line-height: 1.6; max-width: 640px;">
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #071018;">
          Nouvelle demande de contact
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #68717d; width: 120px;">Nom</td>
            <td style="padding: 8px 0;"><strong>${(0, mail_utils_1.escapeHtml)(dto.name.trim())}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #68717d;">Email</td>
            <td style="padding: 8px 0;">${(0, mail_utils_1.escapeHtml)(dto.email.trim())}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #68717d;">Téléphone</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #68717d;">Entreprise</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e1d8; margin: 20px 0;" />
        <p style="margin: 0 0 8px; font-size: 14px; color: #68717d;">Message</p>
        <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${message}</p>
      </div>
    `;
    }
    buildClientConfirmationHtml(name) {
        return `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #18212b; line-height: 1.7; max-width: 640px;">
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #071018;">
          Merci pour votre message
        </p>
        <p style="margin: 0 0 12px; font-size: 14px;">
          Bonjour ${(0, mail_utils_1.escapeHtml)(name)},
        </p>
        <p style="margin: 0 0 12px; font-size: 14px;">
          Nous avons bien reçu votre demande de contact. Notre équipe l'examinera dans les meilleurs délais
          et vous répondra rapidement.
        </p>
        <p style="margin: 0 0 12px; font-size: 14px;">
          Si votre demande est urgente, vous pouvez également nous joindre par téléphone.
        </p>
        <p style="margin: 24px 0 0; font-size: 14px; color: #68717d;">
          Cordialement,<br />
          <strong style="color: #18212b;">L'équipe ENOTEB</strong>
        </p>
      </div>
    `;
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map