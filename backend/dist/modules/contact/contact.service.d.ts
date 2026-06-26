import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactDto } from './dto/contact.dto';
export interface ContactResponse {
    success: boolean;
    message: string;
}
export declare class ContactService {
    private readonly config;
    private readonly prisma;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService);
    sendContactMessage(dto: ContactDto): Promise<ContactResponse>;
    private isSmtpConfigured;
}
