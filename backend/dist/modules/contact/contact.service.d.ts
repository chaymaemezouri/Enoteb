import { ConfigService } from '@nestjs/config';
import { MailService } from '../../common/mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactDto } from './dto/contact.dto';
export interface ContactResponse {
    success: boolean;
    message: string;
}
export declare class ContactService {
    private readonly config;
    private readonly prisma;
    private readonly mailService;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService, mailService: MailService);
    sendContactMessage(dto: ContactDto): Promise<ContactResponse>;
    private buildAdminContactHtml;
    private buildClientConfirmationHtml;
}
