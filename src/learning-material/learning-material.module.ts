import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
// import { LearningMaterialSectorController } from './learning-material-sector.controller';
import { LearningMaterialUsreTypeService } from './learning-material-usertype.service';
import { LearningMaterialController } from './learning-material.controller';
import { LearningMaterialService } from './learning-material.service';

@Module({
  imports: [TypeOrmModule.forFeature([LearningMaterial,LearningMaterialUserType])],
  controllers: [LearningMaterialController],
  providers: [LearningMaterialService,LearningMaterialUsreTypeService,LearningMaterialUserType],
  exports: [LearningMaterialService,LearningMaterialUsreTypeService],
})
export class LearningMaterialModule {}
