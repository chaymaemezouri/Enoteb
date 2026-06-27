import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { isSmtpConfigured } from './mail.utils';

export interface SendMailOptions {
  replyTo?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return isSmtpConfigured(this.config.get('smtp'));
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    options?: SendMailOptions,
  ): Promise<void> {
    if (!this.isConfigured()) {
      this.logger.warn(`SMTP non configuré — email non envoyé : "${subject}" → ${to}`);
      return;
    }

    const smtp = this.config.get<{
      host: string;
      port: number;
      user: string;
      pass: string;
    }>('smtp')!;

    try {
      await this.getTransporter().sendMail({
        from: `"ENOTEB" <${smtp.user}>`,
        to,
        subject,
        html,
        ...(options?.replyTo ? { replyTo: options.replyTo } : {}),
      });

      this.logger.log(`Email envoyé avec succès : "${subject}" → ${to}`);
    } catch (error) {
      this.logger.error(
        `Échec d'envoi email "${subject}" → ${to} : ${String(error)}`,
      );
    }
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      const smtp = this.config.get<{
        host: string;
        port: number;
        user: string;
        pass: string;
      }>('smtp')!;

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
}
