import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ConfigService } from '@nestjs/config';
import { TokenDetails } from 'src/utills/token_details';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { find } from 'rxjs';

@Controller('notification')
export class NotificationController implements CrudController<Notification> {
    constructor(
        public service: NotificationService,
        public mailService: EmailNotificationService,
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        public configService: ConfigService,
        private readonly tokenDetails: TokenDetails,
      ) {}

    @Post("saveNotification")
    async savenew(@Body() req:Notification[]){
      this.service.saveNotification(req);
    }

    @Post("updateNoti")
    async updateNoti(@Body() req:Notification){
      
      this.notificationRepository.save(req);
    }

    @Get("findById/:id")
    async findByUserId(@Param('id') id: number){
        return await this.service.findById(id);
    }

}
