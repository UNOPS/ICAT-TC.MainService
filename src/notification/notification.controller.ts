import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Controller('notification')
export class NotificationController implements CrudController<Notification> {
    constructor(
        public service: NotificationService,
        public mailService: EmailNotificationService,
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
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
