import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
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

const PLACEHOLDER_SMTP_HOSTS = new Set(['smtp.example.com', 'example.com', 'localhost']);

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
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

    if (!this.isSmtpConfigured()) {
      this.logger.warn(
        'SMTP non configuré — la demande est enregistrée et visible dans l’admin.',
      );
      return {
        success: true,
        message: CONTACT_SUCCESS_MESSAGE,
      };
    }

    const smtp = this.config.get<{
      host: string;
      port: number;
      user: string;
      pass: string;
    }>('smtp')!;

    const contactEmail = this.config.get<string>('contactEmail')!;

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
    } catch (error) {
      this.logger.error(
        `Échec d'envoi email (demande enregistrée en admin) : ${String(error)}`,
      );
    }

    return {
      success: true,
      message: CONTACT_SUCCESS_MESSAGE,
    };
  }

  private isSmtpConfigured(): boolean {
    const smtp = this.config.get<{
      host?: string;
      port?: number;
      user?: string;
      pass?: string;
    }>('smtp');

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
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
