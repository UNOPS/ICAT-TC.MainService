import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
    IPaginationOptions,
    paginate,
    Pagination,
  } from 'nestjs-typeorm-paginate';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { Repository } from 'typeorm';

@Injectable()
export class QualityCheckService extends TypeOrmCrudService<ParameterRequest>{

    constructor(
        @InjectRepository(ParameterRequest) repo,
        @InjectRepository(Assessment)
        private readonly assessmentRepo: Repository<Assessment>,
        public parameterHistoryService: ParameterHistoryService,
        
      ) {
        super(repo);
      }

      async GetQCParameters(
        options: IPaginationOptions,
        filterText: string,
        QAstatusId: number,
        countryIdFromTocken:number,
        ctAction: string,
      ): Promise<Pagination<Assessment>> {
        let filter: string = `as.qaStatus is not null`;
    
        if (filterText != null && filterText != undefined && filterText != '') {
          filter =
            '(p.policyName LIKE :filterText  OR as.assessmentType LIKE :filterText)';
        }
    
        if (QAstatusId != 0) {
          filter = `${filter}  and as.qaStatus = :QAstatusId`;
        }
        if (ctAction != null && ctAction != undefined && ctAction != '') {
          filter = `${filter}  and p.policyName = '${ctAction}'`;
      }
        
    
        let data = this.assessmentRepo
          .createQueryBuilder('as')
          .innerJoinAndMapOne('as.climateAction', ClimateAction, 'p', `as.climateAction_id = p.id and p.countryId = ${countryIdFromTocken} ` )
    
          .where(filter, {
            filterText: `%${filterText}%`,
            QAstatusId,
          });
    
        let result = await paginate(data, options);
        if (result) {
          return result;
        }
      }
}
