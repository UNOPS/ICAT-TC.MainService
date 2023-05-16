import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { ConfigService } from '@nestjs/config';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { TokenDetails } from 'src/utills/token_details';


@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService,EmailNotificationService,ConfigService,TokenDetails]
})
export class NotificationModule {}
