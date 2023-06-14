import { UsersModule } from './../users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { Module } from '@nestjs/common';
import { ParameterRequestService } from './data-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterRequest } from './entity/data-request.entity';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { TokenDetails } from 'src/utills/token_details';
import { Institution } from 'src/institution/entity/institution.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { ParameterRequestController as DataRequestController } from './data-request.controller';
import { DefaultValueModule } from 'src/default-value/default-value.module';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParameterRequest,User,Audit,MethodologyAssessmentParameters,DefaultValue,ClimateAction,Institution,CMAssessmentAnswer]),
    UsersModule,
    ParameterHistoryModule,
    DefaultValueModule,
    
  ],
 providers: [ParameterRequestService,AuditService,EmailNotificationService,MethodologyAssessmentParameters,DefaultValue,ClimateAction,Institution,TokenDetails,DefaultValue,CMAssessmentAnswer],
  controllers: [DataRequestController],
  exports: [ParameterRequestService,AuditService,EmailNotificationService,MethodologyAssessmentParameters,DefaultValue,DefaultValue,ClimateAction,CMAssessmentAnswer],
})
export class ParameterRequestModule {}
