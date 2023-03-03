import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ProjectService } from 'src/climate-action/climate-action.service';
import { Report } from './entity/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Report,  ClimateAction])],
    controllers: [ReportController],
    providers: [ReportService,  ProjectService],
    exports: [ReportService,  ProjectService],
})
export class ReportModule {}
