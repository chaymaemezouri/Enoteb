import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
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

  constructor(private readonly config: ConfigService) {}

  async sendContactMessage(dto: ContactDto): Promise<ContactResponse> {
    if (dto.website?.trim()) {
      this.logger.warn('Honeypot déclenché sur le formulaire de contact');
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

    const text = [
      `Nom : ${dto.name}`,
      `Email : ${dto.email}`,
      phoneLine,
      '',
      'Message :',
      dto.message,
    ].join('\n');

    const html = `
      <p><strong>Nom :</strong> ${escapeHtml(dto.name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(dto.email)}</p>
      <p><strong>Téléphone :</strong> ${dto.phone ? escapeHtml(dto.phone) : 'non renseigné'}</p>
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

      return {
        success: true,
        message: CONTACT_SUCCESS_MESSAGE,
      };
    } catch (error) {
      this.logger.error(
        `Échec d'envoi du message de contact : ${String(error)}`,
      );
      throw new InternalServerErrorException({
        success: false,
        message: CONTACT_FAILURE_MESSAGE,
      });
    }
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
