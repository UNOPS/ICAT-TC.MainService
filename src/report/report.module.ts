import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ProjectService } from 'src/climate-action/climate-action.service';
import { Report } from './entity/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report,  ClimateAction,PolicyBarriers])],
    controllers: [ReportController],
    providers: [ReportService,  ProjectService,PolicyBarriers],
    exports: [ReportService,  ProjectService],
})
export class ReportModule {}
