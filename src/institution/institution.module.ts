import { User } from '../users/entity/user.entity';
import { Module, Param } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { TokenDetails } from 'src/utills/token_details';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from './entity/institution.entity';
import { InstitutionType } from './entity/institution.type.entity';
import { InstitutionCategory } from './entity/institution.category.entity';
import { InstitutionCategoryService } from './service/institution-category.service';
import { InstitutionTypeService } from './service/institution-type.service';
import { InstitutionTypeController } from './controller/institution-type.controller';
import { InstitutionController } from './controller/institution.controller';
import { InstitutionCategoryController } from './controller/institution-category.controller';
import { InstitutionService } from './service/institution.service';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, User,InstitutionType, InstitutionCategory,Audit,Country])],
  providers: [InstitutionService, InstitutionTypeService, InstitutionCategoryService,AuditService,TokenDetails],
  controllers: [InstitutionController, InstitutionTypeController, InstitutionCategoryController],
  exports: [InstitutionService, InstitutionTypeService, InstitutionCategoryService,AuditService],
})
export class InstitutionModule {}
