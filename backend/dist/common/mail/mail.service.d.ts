import { ConfigService } from '@nestjs/config';
export interface SendMailOptions {
    replyTo?: string;
}
export declare class MailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    sendMail(to: string, subject: string, html: string, options?: SendMailOptions): Promise<void>;
    private getTransporter;
}
