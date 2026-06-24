import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CONTACT_THROTTLE } from './constants';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({
    contact: { limit: CONTACT_THROTTLE.limit, ttl: CONTACT_THROTTLE.ttl },
  })
  send(@Body() dto: ContactDto) {
    return this.contactService.sendContactMessage(dto);
  }
}
