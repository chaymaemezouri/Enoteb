import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { escapeHtml } from '../../common/mail/mail.utils';
import { MailService } from '../../common/mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CONTACT_FAILURE_MESSAGE,
  CONTACT_SUCCESS_MESSAGE,
} from './constants';
import { ContactDto } from './dto/contact.dto';

export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendContactMessage(dto: ContactDto): Promise<ContactResponse> {
    if (dto.website?.trim()) {
      this.logger.warn('Honeypot déclenché sur le formulaire de contact');
      return {
        success: true,
        message: CONTACT_SUCCESS_MESSAGE,
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
    } catch (error) {
      this.logger.error(`Échec d'enregistrement de la demande de contact : ${String(error)}`);
      throw new InternalServerErrorException({
        success: false,
        message: CONTACT_FAILURE_MESSAGE,
      });
    }

    if (!this.mailService.isConfigured()) {
      this.logger.warn(
        'SMTP non configuré — la demande est enregistrée et visible dans l’admin.',
      );
      return {
        success: true,
        message: CONTACT_SUCCESS_MESSAGE,
      };
    }

    const contactEmail = this.config.get<string>('contactEmail')!;
    const clientEmail = dto.email.trim().toLowerCase();
    const adminSubject = `Nouvelle demande de contact - ${dto.name.trim()}`;
    const clientSubject = 'Nous avons bien reçu votre message - ENOTEB';

    const results = await Promise.allSettled([
      this.mailService.sendMail(
        contactEmail,
        adminSubject,
        this.buildAdminContactHtml(dto),
        { replyTo: clientEmail },
      ),
      this.mailService.sendMail(
        clientEmail,
        clientSubject,
        this.buildClientConfirmationHtml(dto.name.trim()),
      ),
    ]);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const target = index === 0 ? contactEmail : clientEmail;
        this.logger.error(
          `Échec inattendu lors de l'envoi email de contact → ${target} : ${String(result.reason)}`,
        );
      }
    });

    return {
      success: true,
      message: CONTACT_SUCCESS_MESSAGE,
    };
  }

  private buildAdminContactHtml(dto: ContactDto): string {
    const phone = dto.phone?.trim()
      ? escapeHtml(dto.phone.trim())
      : 'Non renseigné';
    const company = dto.company?.trim()
      ? escapeHtml(dto.company.trim())
      : 'Non renseignée';
    const message = escapeHtml(dto.message.trim()).replace(/\n/g, '<br />');

    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #18212b; line-height: 1.6; max-width: 640px;">
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #071018;">
          Nouvelle demande de contact
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #68717d; width: 120px;">Nom</td>
            <td style="padding: 8px 0;"><strong>${escapeHtml(dto.name.trim())}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #68717d;">Email</td>
            <td style="padding: 8px 0;">${escapeHtml(dto.email.trim())}</td>
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

  private buildClientConfirmationHtml(name: string): string {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #18212b; line-height: 1.7; max-width: 640px;">
        <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #071018;">
          Merci pour votre message
        </p>
        <p style="margin: 0 0 12px; font-size: 14px;">
          Bonjour ${escapeHtml(name)},
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
}
