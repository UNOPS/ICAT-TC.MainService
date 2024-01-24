import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { TokenDetails } from 'src/utills/token_details';
import { VerificationDetail } from './entity/verification-detail.entity';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { Institution } from 'src/institution/entity/institution.entity';
import { User } from 'src/users/entity/user.entity';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { Assessment } from 'src/assessment/entities/assessment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParameterRequest,
      VerificationDetail,
      ParameterRequest,
      Institution,
      User,
      Assessment
    ]),
    ParameterHistoryModule,
    AssessmentModule,
  ],
  controllers: [VerificationController],
  providers: [
    VerificationService,
    VerificationDetail,
    ParameterRequest,
    TokenDetails,
    EmailNotificationService,
    Institution,
  ],
  exports: [VerificationService],
})
export class VerificationModule {}
