import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MethodologyAssessmentParameters as Parameter} from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { ParameterHistory } from './entity/parameter-history.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ParameterHistoryAction } from './entity/parameter-history-action-history.entity';
import { Tool } from 'src/data-request/enum/tool.enum';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';

@Injectable()
export class ParameterHistoryService extends TypeOrmCrudService<ParameterHistory>  {
    constructor(
        @InjectRepository(ParameterHistory) repo,
        @InjectRepository(Parameter)
        private readonly parameterRepo: Repository<Parameter>,
        @InjectRepository(ParameterRequest)
        private readonly parameterRequestRepo: Repository<ParameterRequest>,
      ) {
        super(repo);
      }

    public async SaveParameterHistory(
        dataReqestId: number, // daat requst ID
        action: ParameterHistoryAction,
        description: string,
        comment: string,
        status: string,
        statusPrevious: string | null,
      ) {
        let datareqest = await this.parameterRequestRepo.findOne({where:{id:dataReqestId}}); // let parametr
       // console.log("my datarequest id ..",datareqest.id)
    
        let data = this.parameterRequestRepo
        .createQueryBuilder('paraReq')
        if(datareqest.tool==Tool.CM_tool){
          data.innerJoinAndMapOne(
            'paraReq.cmAssessmentAnswer',
             CMAssessmentAnswer,
            'para',
            `paraReq.cmAssessmentAnswerID = para.id and paraReq.id = ${dataReqestId}`,
          )
         
        }
        else if(datareqest.tool==Tool.Investor_tool||Tool.Portfolio_tool){
          data.innerJoinAndMapOne(
            'paraReq.investmentParameter',
             InvestorAssessment,
            'para',
            `paraReq.investmentParameterId = para.id and paraReq.id = ${dataReqestId}`,
          )
        }
        
        //.where('paraHis.id = dataReqestId')
    
        let result1 = await data.getOne();
        // console.log("my parameter111..",result1)

    
    
       // let parameter = await this.parameterRepo.findOne(datareqest.parameter.id);
       
       // console.log("my parameter..",parameter.name)
    
        let parameterHistory = new ParameterHistory();
        parameterHistory.description = description;
        parameterHistory.comment = comment;
        if(datareqest.tool==Tool.CM_tool){
          parameterHistory.parameterId = result1.cmAssessmentAnswer.id;
         
        }
        else if(datareqest.tool==Tool.Investor_tool||Tool.Portfolio_tool){
          parameterHistory.parameterId = result1.investmentParameter.id;
         
        }
        
        // parameterHistory.parameterName = result1.parameter?.name;
        parameterHistory.parameterCreatedDate = datareqest.createdOn;
        parameterHistory.parameterAllocatedDate = datareqest.deadline;
        parameterHistory.parameterAssignDateByIA = datareqest.deadlineDataEntry;
        parameterHistory.parameterStatus = status!;
        parameterHistory.parameterStatusPrevious = statusPrevious!;
        // parameterHistory.deoAssumption = result1.parameter?.enterDataAssumption;
        parameterHistory.qcAssumption = datareqest?.qaComment;
        
    
        parameterHistory.Action = action;
    
        let param = await this.repo.insert(parameterHistory);
      }

      async getHistory(id: number): Promise<any> 
      {
        let filter: string = 'as.parameterId = :id';
        var data = this.repo
          .createQueryBuilder('as')
          .where(filter, {
            id,
            
          })
          .orderBy('as.createdOn', 'DESC');;
    
    
        // console.log('data.....',data)
        //console.log('query...', data.getQueryAndParameters());
        return await data.getMany();
      }
}
