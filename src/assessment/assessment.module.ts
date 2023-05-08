import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TokenDetails } from 'src/utills/token_details';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from './entities/assessment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Institution } from 'src/institution/entity/institution.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { AssessmentObjectives } from 'src/methodology-assessment/entities/assessmentobjectives.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment,User,Institution,UserType,Country,AssessmentObjectives]),UsersModule],
  controllers: [AssessmentController],
  providers: [AssessmentService,TokenDetails,UsersService,EmailNotificationService]
})
export class AssessmentModule {}
