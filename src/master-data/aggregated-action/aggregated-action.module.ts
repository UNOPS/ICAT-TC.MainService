import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NdcSetController } from './ndc-set.controller';
import { NdcSet } from './ndc-set.entity';
import { NdcSetService } from './ndc-set.service';
import { NdcController } from './aggregated-action.controller';
import { NdcService } from './aggregated-action.service';
import { ActionArea } from '../action-area/entity/action-area.entity';
import { AggregatedAction } from './entity/aggregated-action.entity';
import { ActionAreaController } from '../action-area/action-area.controller';
import { ActionAreaService } from '../action-area/action-area.service';


@Module({
  imports: [TypeOrmModule.forFeature([AggregatedAction, ActionArea, NdcSet])],
  controllers: [NdcController, NdcSetController, ActionAreaController],
  providers: [NdcService, NdcSetService, ActionAreaService],
  exports: [NdcService],
})
export class NdcModule {}
