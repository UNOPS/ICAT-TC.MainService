import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
    IPaginationOptions,
    paginate,
    Pagination,
  } from 'nestjs-typeorm-paginate';
import { AssessmentService } from 'src/assessment/assessment.service';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { User } from 'src/users/entity/user.entity';
import { TokenDetails } from 'src/utills/token_details';
import { Repository } from 'typeorm';

@Injectable()
export class QualityCheckService extends TypeOrmCrudService<ParameterRequest>{

    constructor(
        @InjectRepository(ParameterRequest) repo,
        @InjectRepository(Assessment)
        private readonly assessmentRepo: Repository<Assessment>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        public parameterHistoryService: ParameterHistoryService,
        private readonly tokenDetails:TokenDetails,
        
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
          console.log("+++++++++++++" ,filter)
      }
        // if (NDCId != 0) {
        //   filter = `${filter}  and as.ndcId = :NDCId`;
        // }
        // if (SubNdcId != 0) {
        //   filter = `${filter}  and as.subNdcId = :SubNdcId`;
        // }
    console.log("+++++++++++++" ,ctAction)
        
    
        let data = this.assessmentRepo
          .createQueryBuilder('as')
        //   .innerJoinAndMapOne(
        //     'ae.assessment',
        //     Assessment,
        //     'as',
        //     'ae.assessmentId = as.id',  //`a.projectId = p.id and p.countryId = ${countryIdFromTocken}`
        //   )
          .innerJoinAndMapOne('as.climateAction', ClimateAction, 'p', `as.climateAction_id = p.id and p.countryId = ${countryIdFromTocken} ` )
    
          .where(filter, {
            filterText: `%${filterText}%`,
            QAstatusId,
            // NDCId,
            // SubNdcId,
          });
        //   .orderBy( 'DESC');
    
        let resualt = await paginate(data, options);
          console.log("PPP",resualt)
        if (resualt) {
          return resualt;
        }
      }
}
