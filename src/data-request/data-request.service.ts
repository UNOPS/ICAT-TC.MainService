import { User } from 'src/users/entity/user.entity';
import { DataRequestStatus } from './entity/data-request-status.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ParameterRequest } from './entity/data-request.entity';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { UpdateDeadlineDto } from './dto/dataRequest.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { ClimateAction, ClimateAction as Project } from 'src/climate-action/entity/climate-action.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ParameterHistoryAction } from 'src/parameter-history/entity/parameter-history-action-history.entity';
import { MethodologyAssessmentParameters as Parameter} from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { Tool } from './enum/tool.enum';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';
import { InvestorQuestions } from 'src/investor-tool/entities/investor-questions.entity';
import { CMAssessmentQuestion } from 'src/carbon-market/entity/cm-assessment-question.entity';
import { CMQuestion } from 'src/carbon-market/entity/cm-question.entity';

@Injectable()
export class ParameterRequestService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    private readonly userService: UsersService,
    private readonly parameterHistoryService: ParameterHistoryService,
    private readonly emaiService: EmailNotificationService,
    @InjectRepository(MethodologyAssessmentParameters)
    public paramterRepo: Repository<MethodologyAssessmentParameters>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(DefaultValue)
    public defaultValRepo: Repository<DefaultValue>,
    @InjectRepository(Project)
    public ProjectRepo: Repository<Project>,
    @InjectRepository(InvestorAssessment)
    public investmentRepo: Repository<InvestorAssessment>,
    @InjectRepository(CMAssessmentAnswer)
    public cmAssessmentAnswerRepo: Repository<CMAssessmentAnswer>,
  ) {
    super(repo);
  }

  async getDateRequestToManageDataStatus(
    assessmentId: number,
    assessmentYear: number,
    tool: Tool
  ): Promise<any> {
    let data = this.repo
      .createQueryBuilder('dr')

      if (tool === Tool.CM_tool){
        data.leftJoinAndMapMany(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'para',
          'para.id = dr.cmAssessmentAnswerId',
        ) .leftJoinAndMapOne(
          'para.assessment_question',
           CMAssessmentQuestion,
          'assessment_question',
          'assessment_question.id = para.assessmentQuestionId',
        ).leftJoinAndMapMany(
          'assessment_question.assessment',
          Assessment,
          'assessment',
          'assessment.id = assessment_question.assessmentId',
        ).where(
          `assessment.id = ${assessmentId}`,
        )
      } else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool){
        data.leftJoinAndMapMany(
          'dr.investmentParameter',
          InvestorAssessment,
          'para',
          'para.id = dr.investmentParameterId',
        ).where(
          `para.assessment_id = ${assessmentId}`,
        )
      } else [
        data.leftJoinAndMapMany(
          'dr.parameter',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        ).where(
          `para.assessment_id = ${assessmentId}`,
        )
      ]

    return await data.execute();
  }
  

  async getNewDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    dataProvider: number,
    countryIdFromTocken: number,
    tool:string,
  ): Promise<Pagination<any>> {
    let data = this.repo
      .createQueryBuilder('dr')
      .where('dr.tool = :value AND (dr.dataRequestStatus !=:status OR dr.dataRequestStatus IS NULL )', { value: tool,status:2})
            
      if(tool ===Tool.Investor_tool|| tool ===Tool.Portfolio_tool ){
        data.leftJoinAndMapOne(
          'dr.investmentParameter',
          InvestorAssessment,
          'investmentAssessment',
          'investmentAssessment.id = dr.investmentParameterId',
        )
        .leftJoinAndMapOne(
          'investmentAssessment.assessment',
          Assessment,
          'assessment',
          'assessment.id = investmentAssessment.assessment_id',
        )
        
        .leftJoinAndMapOne(
          'investmentAssessment.category',
          Category,
          'cat',
          'cat.id = investmentAssessment.category_id',
        )
        .leftJoinAndMapOne(
          'investmentAssessment.characteristics',
          Characteristics,
          'chara',
          'chara.id = investmentAssessment.characteristic_id',
        )
        .leftJoinAndMapOne(
          'investmentAssessment.institution',
          Institution,
          'ins',
          'ins.id = investmentAssessment.institution_id',
        )
       
        .leftJoinAndMapOne(
          'investmentAssessment.question',
          InvestorQuestions,
          'question',
          'question.id = investmentAssessment.institutionDescription',
        )
        .leftJoinAndMapOne('assessment.climateAction', ClimateAction, 'intervention', 'intervention.id = assessment.climateAction_id and not intervention.status =-20')
        .andWhere(
          (
            (dataProvider != 0 ? `ins.id=${dataProvider} AND ` : '') +
            (climateActionId != 0 ? `intervention.id=${climateActionId} AND ` : '') +
            (year != '' ? `assessment.assessmentType='${year}' AND ` : '') +
            `(dr.id IS NOT NULL) AND ` +
            (filterText != ''
              ? `(intervention.policyName LIKE '%${filterText}%' OR cat.name LIKE '%${filterText}%' OR chara.name LIKE '%${filterText}%' 
              OR ins.name LIKE '%${filterText}%'  OR question.name LIKE '%${filterText}%'  OR investmentAssessment.type LIKE '%${filterText}%' 
             )`
              : '')
          ).replace(/AND $/, ''),
        )
        
      }
    
      
       if(tool ===Tool.CM_tool ){
        data.leftJoinAndMapOne(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'cmAssessmentAnswer',
          'cmAssessmentAnswer.id = dr.cmAssessmentAnswerID',
        )
        
        .leftJoinAndMapOne(
          'cmAssessmentAnswer.institution',
          Institution,
          'ins',
          'ins.id = cmAssessmentAnswer.institutionId',
        )
        .leftJoinAndMapOne(
          'cmAssessmentAnswer.assessment_question',
           CMAssessmentQuestion,
          'assessment_question',
          'assessment_question.id = cmAssessmentAnswer.assessmentQuestionId',
        )
        .leftJoinAndMapOne(
          'assessment_question.characteristic',
           Characteristics,
          'characteristic',
          'characteristic.id = assessment_question.characteristicId',
        )
        .leftJoinAndMapOne(
          'characteristic.category',
           Category,
          'category',
          'category.id = characteristic.category_id',
        )
        .leftJoinAndMapOne(
          'assessment_question.question',
           CMQuestion,
          'cmQuestion',
          'cmQuestion.id = assessment_question.questionId',
        )
       
        .leftJoinAndMapOne(
          'assessment_question.assessment',
           Assessment,
          'assessment',
          'assessment.id = assessment_question.assessmentId',
        )
       
       
        
        .leftJoinAndMapOne(
          'assessment.climateAction',
           ClimateAction, 
          'intervention', 
          'intervention.id = assessment.climateAction_id and not intervention.status =-20'
         )
         .andWhere(
          (
            (dataProvider != 0 ? `ins.id=${dataProvider} AND ` : '') +
            (climateActionId != 0 ? `intervention.id=${climateActionId} AND ` : '') +
            (year != '' ? `assessment.assessmentType='${year}' AND ` : '') +
            `(dr.id IS NOT NULL) AND ` +
            (filterText != ''
              ? `(intervention.policyName LIKE '%${filterText}%'  OR ins.name LIKE '%${filterText}%' OR cmQuestion.label LIKE '%${filterText}%'
             
             )`
              : '')
          ).replace(/AND $/, ''),
        )
        
      }
      data
      
      .orderBy('dr.id', 'DESC')
      .groupBy('dr.id')
     
    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async getNewDataRequestForClimateList(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    dataProvider: number,
    countryIdFromTocken: number,
  ): Promise<Pagination<any>> {
    let whereCond = (
      (climateActionId != 0
        ? `p.id=${climateActionId} AND  p.countryId = ${countryIdFromTocken} AND `
        : '') +
      (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
      (dataProvider != 0 ? `para.institution_id=${dataProvider} AND ` : '') +
      `dr.dataRequestStatus in (-1,1,30,-6) AND ` +
      (filterText != ''
        ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR i.name LIKE '%${filterText}%'
           )`
        : '')
    ).replace(/AND $/, '');

    let data = this.repo
      .createQueryBuilder('dr')
      .select(['dr.id', 'para.id ', 'a.id as aid', 'p.id as pid'])
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .innerJoinAndMapOne(
        'p.Country',
        Country,
        'cou',
        `p.countryId = cou.id and p.countryId = ${countryIdFromTocken}`,
      )
      .leftJoinAndMapOne(
        'para.institution',
        Institution,
        'i',
        'i.id = para.institution_id',
      )
      .where(whereCond)
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');
    let result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getDateRequest(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<any>> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapMany(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapMany('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .select([
        'p.climateActionName as climateAction',
        'para.AssessmentYear as year',
        'a.assessmentType as assessmentType',
        'dr.dataRequestStatus as dataRequestStatus',
        'dr.id as id',
      ])
      .where(filter, {
        filterText: `%${filterText}%`,
      })
      .orderBy('dr.createdOn', 'DESC');
    let result = await data.execute();
    if (result) {
      return result;
    }
  }

  async getAssignDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    userName: string,
    tool:string
  ): Promise<Pagination<any>> {
   
    let userItem = await this.userService.findByUserName(userName);
    let institutionId = userItem.institution ? userItem.institution.id : 0;
    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.UserDataEntry',
         User, 
        'user', 
        'user.id = dr.UserDataEntry'
       )
     
      .where('dr.tool = :value', { value: tool})
      if(tool ===Tool.Investor_tool|| tool ===Tool.Portfolio_tool ){
        data.leftJoinAndMapOne(
          'dr.investmentParameter',
          InvestorAssessment,
          'investmentAssessment',
          'investmentAssessment.id = dr.investmentParameterId',
        )
        .leftJoinAndMapOne(
          'investmentAssessment.assessment',
          Assessment,
          'assessment',
          'assessment.id = investmentAssessment.assessment_id',
        )
        
        .leftJoinAndMapOne(
          'investmentAssessment.category',
          Category,
          'cat',
          'cat.id = investmentAssessment.category_id',
        )
        .leftJoinAndMapOne(
          'investmentAssessment.characteristics',
          Characteristics,
          'chara',
          'chara.id = investmentAssessment.characteristic_id',
        )
        .leftJoinAndMapOne(
          'investmentAssessment.institution',
          Institution,
          'ins',
          'ins.id = investmentAssessment.institution_id',
        )
       
        .leftJoinAndMapOne(
          'investmentAssessment.question',
          InvestorQuestions,
          'question',
          'question.id = investmentAssessment.institutionDescription',
        )
        .leftJoinAndMapOne('assessment.climateAction', ClimateAction, 'intervention', 'intervention.id = assessment.climateAction_id and not intervention.status =-20')
        .andWhere(
          (
            (institutionId != 0 ? `ins.id=${institutionId} AND ` : '') +
            (climateActionId != 0 ? `intervention.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (2,3,-9,-10) AND ` +
            (filterText != ''
                ? `(intervention.policyName LIKE '%${filterText}%' OR cat.name LIKE '%${filterText}%' OR chara.name LIKE '%${filterText}%' 
                OR user.firstName LIKE '%${filterText}%'  OR question.name LIKE '%${filterText}%'  OR investmentAssessment.type LIKE '%${filterText}%' 
               )`
                : '')
          ).replace(/AND $/, ''),
        )
        
        
      }
    
      
       else if(tool ===Tool.CM_tool ){
        data.leftJoinAndMapOne(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'cmAssessmentAnswer',
          'cmAssessmentAnswer.id = dr.cmAssessmentAnswerID',
        )
        
        .leftJoinAndMapOne(
          'cmAssessmentAnswer.institution',
          Institution,
          'ins',
          'ins.id = cmAssessmentAnswer.institutionId',
        )
        .leftJoinAndMapOne(
          'cmAssessmentAnswer.assessment_question',
           CMAssessmentQuestion,
          'assessment_question',
          'assessment_question.id = cmAssessmentAnswer.assessmentQuestionId',
        )
        .leftJoinAndMapOne(
          'assessment_question.characteristic',
           Characteristics,
          'characteristic',
          'characteristic.id = assessment_question.characteristicId',
        )
        .leftJoinAndMapOne(
          'characteristic.category',
           Category,
          'category',
          'category.id = characteristic.category_id',
        )
        .leftJoinAndMapOne(
          'assessment_question.question',
           CMQuestion,
          'cmQuestion',
          'cmQuestion.id = assessment_question.questionId',
        )
       
        .leftJoinAndMapOne(
          'assessment_question.assessment',
           Assessment,
          'assessment',
          'assessment.id = assessment_question.assessmentId',
        )
       
       
        
        .leftJoinAndMapOne(
          'assessment.climateAction',
           ClimateAction, 
          'intervention', 
          'intervention.id = assessment.climateAction_id and not intervention.status =-20'
         )
         .andWhere(
          (
            (institutionId != 0 ? `ins.id=${institutionId} AND ` : '') +
            (climateActionId != 0 ? `intervention.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (2,3,-9,-10) AND ` +
            (filterText != ''
            ? `(intervention.policyName LIKE '%${filterText}%' OR user.firstName LIKE '%${filterText}%' OR ins.name LIKE '%${filterText}%' OR cmQuestion.label LIKE '%${filterText}%'
           
           )`
            : '')
          ).replace(/AND $/, ''),
        )
         
       
        
      }
      data
      .orderBy('dr.id', 'DESC')
      .groupBy('dr.id')
     
     

    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async getEnterDataParameter(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    userName: string,
  ): Promise<Pagination<any>> {
    let userItem = await this.userService.findByUserName(userName);
    let userId = userItem ? userItem.id : 0;
    let insId = userItem ? userItem.institution.id : 0;
    if (userItem.userType.name != 'Institution Admin') {
      let data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameterId',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        )
        .leftJoinAndMapOne(
          'para.Assessment',
          Assessment,
          'a',
          'a.id = para.assessment_id',
        )
        .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
        .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
        .where(
          (
            (userId != 0 ? `u.id=${userId} AND ` : '') +
            (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (4,5,-8) AND ` +
            (year != '' ? `ay.AssessmentYear ='${year}' AND ` : '') +
            (filterText != ''
              ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%')`
              : '')
          ).replace(/AND $/, ''),
        )
        .groupBy('dr.id')
        .orderBy('dr.deadline', 'DESC');

      let result = await paginate(data, options);

      if (result) {
        return result;
      }
    } else {
      let data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameterId',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        )
        .leftJoinAndMapOne(
          'para.Assessment',
          Assessment,
          'a',
          'a.id = para.assessment_id',
        )
        .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
        .leftJoinAndMapOne('para.category',Category,'cat','cat.id = para.category_id',)
        .leftJoinAndMapOne('para.characteristics',Characteristics,'chara','chara.id = para.characteristics_id',)
        .leftJoinAndMapOne(
          'para.Institution',
          Institution,
          'ins',
          'para.institution_id = ins.id',
        )
        .where(
          (
            (insId != 0 ? `para.institution_id=${insId} AND ` : '') +
            (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (4,5,-8) AND ` +
            (year != '' ? `ay.AssessmentYear ='${year}' AND ` : '') +
            (filterText != ''
              ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%')`
              : '')
          ).replace(/AND $/, ''),
        )
        .orderBy('dr.deadline', 'DESC');

      let result = await paginate(data, options);
      if (result) {
        return result;
      }
    }
  } 

  async getEnterDataParameters(options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    userName: string,
    tool: Tool
  ): Promise<Pagination<any>>{
    let data
    let userItem = await this.userService.findByUserName(userName);
    let userId = userItem ? userItem.id : 0;
    let insId = userItem ? userItem.institution.id : 0;
    climateActionId = Number(climateActionId)

    let filter = 'request.dataRequestStatus in (4,5,-8) AND  request.tool = :tool '

    if (filterText){
      filter = filter + 'AND climateAction.policyName LIKE :filterText '
    }

    if (climateActionId !== 0) {
      filter = filter + 'AND climateAction.id = :climateActionId ';
    }
    if (insId) {
      filter = filter + 'AND institution.id = :insId '
    } 

    data = this.repo.createQueryBuilder('request')
    if (tool === Tool.CM_tool) {
      data.leftJoinAndSelect(
        'request.cmAssessmentAnswer',
        'assessmentAnswer',
        'request.cmAssessmentAnswerId = assessmentAnswer.id'
      ).leftJoinAndSelect(
        'assessmentAnswer.institution',
        'institution',
        'assessmentAnswer.institutionId = institution.id'
      ).leftJoinAndSelect(
        'assessmentAnswer.assessment_question',
        'assessmentQuestion',
        'assessmentAnswer.assessmentQuestionId = assessmentQuestion.id'
      ).leftJoinAndSelect(
        'assessmentQuestion.characteristic',
        'characteristic',
        'characteristic.id = assessmentQuestion.characteristicId',
      )
      .leftJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id',
      ).leftJoinAndSelect(
        'assessmentAnswer.answer',
        'answer',
        'assessmentAnswer.answerId = answer.id'
      ).leftJoinAndSelect(
        'assessmentQuestion.question',
        'question',
        'question.id = assessmentQuestion.questionId'
      ).leftJoinAndSelect(
        'assessmentQuestion.assessment',
        'assessment',
        'assessment.id = assessmentQuestion.assessmentId'
      )
    } else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool) {
      data.leftJoinAndSelect(
        'request.investmentParameter',
        'investmentParameter',
        'request.investmentParameterId = investmentParameter.id'
      ).leftJoinAndSelect(
        'investmentParameter.institution',
        'institution',
        'investmentParameter.institution_id = institution.id'
      ).leftJoinAndSelect(
        'investmentParameter.assessment',
        'assessment',
        'assessment.id = investmentParameter.assessment_id'
      ).leftJoinAndSelect(
        'investmentParameter.category',
        'category',
        'category.id = investmentParameter.category_id'
      ).leftJoinAndSelect(
        'investmentParameter.characteristics',
        'characteristics',
        'characteristics.id = investmentParameter.characteristic_id'
      )
    } 

    data.leftJoinAndSelect(
      'assessment.climateAction',
      'climateAction',
      'climateAction.id = assessment.climateAction_id'
    ).where(
      filter, {climateActionId: climateActionId, insId: insId, filterText: `%${filterText}%`, tool: tool}
    )

    return await paginate(data, options)
  }

  async getReviewDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    type: string,
    userName: string,
  ): Promise<Pagination<any>> {
    let userItem = await this.userService.findByUserName(userName);
    let institutionId = userItem.institution ? userItem.institution.id : 0;

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne('para.category',Category,'cat','cat.id = para.category_id',)
        .leftJoinAndMapOne('para.characteristics',Characteristics,'chara','chara.id = para.characteristics_id',)
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapOne(
        'para.Institution',
        Institution,
        'i',
        'i.id = para.institution_id',
      )
      .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .where(
        (
          (institutionId != 0 ? `i.id=${institutionId} AND ` : '') +
          (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
          `dr.dataRequestStatus in (6,7,-6) AND ` +
          (type != '' ? `a.assessmentType='${type}' AND ` : '') +
          (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
          (filterText != ''
            ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%' OR a.assessmentType  LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )
      .groupBy('dr.id');

    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async getReviewDataRequests(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    type: string,
    userName: string,
    tool: Tool
  ): Promise<Pagination<any>> {
    let userItem = await this.userService.findByUserName(userName);
    climateActionId = Number(climateActionId);
    let institutionId = userItem.institution ? userItem.institution.id : 0;

    let data = this.repo.createQueryBuilder('dr')

    if (tool === Tool.CM_tool) {
      data.leftJoinAndSelect('dr.cmAssessmentAnswer', 'para', 'para.id = dr.cmAssessmentAnswerId')
        .leftJoinAndSelect('para.assessment_question', 'assessmentQuestion', 'para.assessmentQuestionId = assessmentQuestion.id')
        .leftJoinAndSelect('para.answer', 'answer', 'para.answerId = answer.id')
        .leftJoinAndSelect('assessmentQuestion.question', 'question', 'question.id = assessmentQuestion.questionId')
        .leftJoinAndSelect('assessmentQuestion.assessment', 'assessment', 'assessment.id = assessmentQuestion.assessmentId')
        .leftJoinAndSelect('assessmentQuestion.characteristic', 'characteristic', 'characteristic.id = assessmentQuestion.characteristicId')
        .leftJoinAndSelect('characteristic.category', 'category', 'category.id = characteristic.category_id')
        .leftJoinAndSelect('para.institution', 'institution', 'institution.id = para.institutionId')
    } else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool) {
      data.leftJoinAndSelect('dr.investmentParameter', 'para', 'para.id = dr.investmentParameterId')
        .leftJoinAndSelect('para.assessment', 'assessment', 'assessment.id = para.assessment_id')
        .leftJoinAndSelect('para.category', 'cat', 'cat.id = para.category_id',)
        .leftJoinAndSelect('para.characteristics', 'chara', 'chara.id = para.characteristic_id',)
        .leftJoinAndSelect('para.institution', 'institution', 'institution.id = para.institution_id')
    }

    data
      .leftJoinAndSelect('assessment.climateAction', 'climateAction', 'climateAction.id = assessment.climateAction_id')
      .where('dr.dataRequestStatus in (6,7,-6)  AND  dr.tool = :tool', {tool: tool})

    if (institutionId !== 0){
      data.andWhere('institution.id = :instId', {instId: institutionId})
    }
    if (climateActionId !== 0){
      data.andWhere('climateAction.id = :id', {id: climateActionId})
    }
    if (type && type !== ''){
      data.andWhere('assessment.assessmentType = :type', {type: type})
    }
    if (filterText && filterText !== ''){
      data.andWhere('climateAction.policyName LIKE :filterText OR assessment.assessmentType  LIKE :filterText', {filterText: `%${filterText}%`})
    }
    data.groupBy('dr.id')
    
    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async updateDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem=await this.repo
      .createQueryBuilder("dataRequestItem")
      .where("dataRequestItem.id = :id", { id:id })
      .getOne()

      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadline = updateDataRequestDto.deadline;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.DataRequest,
          'DataRequest',
          '',
          res.dataRequestStatus.toString(),
          originalStatus?.toString(),
        );
      });
    }

    return true;
  }

  async updateDataEntryDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      let user = await this.userRepo.findByIds([updateDataRequestDto.userId]);

      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadlineDataEntry = updateDataRequestDto.deadline;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;

      var template =
        'Dear ' +
        user[0].fullName +
        ' ' +
        user[0].lastName +
        ' <br/> Data request with following information has shared with you.' +
        '<br/> deadline ' +
        updateDataRequestDto.deadline +
        '<br> comment' +
        updateDataRequestDto.comment;

      this.emaiService.sendMail(
        user[0].email,
        'Assign New Data Entry',
        '',
        template,
      );
      this.repo.save(dataRequestItem).then((res) => {
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.AssignDataRequest,
          'AssignDataRequest',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }


    return true;
  }

  async acceptReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    let tool = updateDataRequestDto.tool

    let insSec: any;
    let inscon: any;

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];

      let para = this.repo.createQueryBuilder('dr')

      if (tool === Tool.CM_tool){
        para.leftJoinAndMapOne(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'para',
          'dr.cmAssessmentAnswerId = para.id'
        )
      } else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool){
        para.leftJoinAndMapOne(
          'dr.investmentParameter',
          InvestorAssessment,
          'para',
          'dr.investmentParameterId = para.id'
        )
      } else {
        para.leftJoinAndMapOne(
          'dr.parameter',
          Parameter,
          'para',
          'dr.ParameterId = para.id',
        )
      }
      
      para.leftJoinAndMapOne(
        'para.institution',
        Institution,
        'ins'
      )
      .leftJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        'cou.id = ins.countryId',
      ).where('dr.id = ' +id);

      let pararesult = await para.getMany();
    
      let originalStatus = pararesult
        ? pararesult[0].dataRequestStatus
        : 0;
        pararesult[0].dataRequestStatus = updateDataRequestDto.status;
      if (
        pararesult[0].dataRequestStatus &&
        pararesult[0].dataRequestStatus == DataRequestStatus.Data_Approved
      ) {
        pararesult[0].qaStatus = null;
      }

      if (tool === Tool.CM_tool) inscon = pararesult[0].cmAssessmentAnswer.institution.country;
      else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool) inscon = pararesult[0].investmentParameter.institution.country;
      else inscon = pararesult[0].parameter.institution.country

      if (tool === Tool.CM_tool) insSec = pararesult[0].cmAssessmentAnswer.institution.sector;
      else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool) inscon = pararesult[0].investmentParameter.institution.sector;
      else inscon = pararesult[0].parameter.institution.sector

      this.repo.save(pararesult[0]).then((res) => {
      });

      let filter: string = '';
      filter = `dr.id = :id`;
      let data = this.repo
        .createQueryBuilder('dr')

      if (tool === Tool.CM_tool){
        data.leftJoinAndMapOne(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'pm',
          'dr.cmAssessmentAnswerId = pm.id'
        )
      } else if (tool === Tool.Investor_tool || tool === Tool.Portfolio_tool){
        data.leftJoinAndMapOne(
          'dr.investmentParameter',
          InvestorAssessment,
          'pm',
          'dr.investmentParameterId = pm.id'
        )
      } else {
        data.leftJoinAndMapOne(
          'dr.parameter',
          Parameter,
          'pm',
          'dr.ParameterId= pm.id',
        )

      }
        data.where(filter, { id });
      let result = await data.getOne();

      const paraId = tool === Tool.CM_tool ? result.cmAssessmentAnswer.id:
      ((tool === Tool.Investor_tool || tool === Tool.Portfolio_tool) ? result.investmentParameter.id : result.parameter.id) ;
         
    }
    let user:User[];
    let ins = await this.institutionRepo.findOne({
        where: { country: inscon, sector: insSec },
    });
    user= await this.userRepo.find({where:{country:inscon}})
    user.forEach((ab)=>{
      var template: any;
      if (updateDataRequestDto.comment != undefined) { 
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value' +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value ';
      }
  
      this.emaiService.sendMail(ab.email, 'Accepted parameter', '', template);
    })
    

    return true;
  }

  async rejectEnterDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id }, relations: ['cmAssessmentAnswer', 'investmentParameter'] });
      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;


      let email
      let institutionName 
      if (updateDataRequestDto.tool === Tool.CM_tool){
        email = dataRequestItem.cmAssessmentAnswer.institution.email;
        institutionName = dataRequestItem.cmAssessmentAnswer.institution.name;
      } else if (updateDataRequestDto.tool === Tool.Investor_tool || updateDataRequestDto.tool === Tool.Portfolio_tool){
        email = dataRequestItem.investmentParameter.institution.email;
        institutionName = dataRequestItem.investmentParameter.institution.name;
      } else {
        email = dataRequestItem.parameter.institution.email;
        institutionName = dataRequestItem.parameter.institution.name
      }

      var template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          institutionName +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Reject enterd value' +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          institutionName +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Reject enterd value'
      }

      this.emaiService.sendMail(email, 'Reject enterd value', '', template);

      this.repo.save(dataRequestItem).then((res) => {
      });
    }
    return true;
  }

  async rejectReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
      for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
        const id = updateDataRequestDto.ids[index];
        let dataRequestItem = await this.repo.findOne({ where: { id: id }, relations: ['cmAssessmentAnswer', 'investmentParameter'] });
      
  
        let user = await this.userRepo.findByIds([updateDataRequestDto.userId]);
        let template: any;
  
        if (updateDataRequestDto.status === -9) {
          let ins = dataRequestItem.parameter;
          template =
            'Dear ' +
            ins.institution.name +
            ' ' +
            '<br/>Data request with following information has shared with you.' +
            ' <br/> We are assign  Data entry' +
            '<br/> deadline ' +
            updateDataRequestDto.deadline +
            '<br> comment' +
            updateDataRequestDto.comment;
          this.emaiService.sendMail(
            ins.institution.email,
            'Assign  Data Entry',
            '',
            template,
          );
        } else {
          if (updateDataRequestDto.comment != undefined) {
            template =
              'Dear ' +
              user[0].fullName +
              ' ' +
              user[0].lastName +
              '<br/>Data request with following information has shared with you.' +
              ' <br/> We are assign  Data entry' +
              '<br/> deadline ' +
              updateDataRequestDto.deadline +
              '<br> comment' +
              updateDataRequestDto.comment;
            this.emaiService.sendMail(
              user[0].email,
              'Assign  Data Entry',
              '',
              template,
            );
          } else {
            template =
              'Dear ' +
              user[0].fullName +
              ' ' +
              user[0].lastName +
              '<br/>Data request with following information has shared with you.' +
              ' <br/> We are assign new Data entry' +
              '<br/> deadline ' +
              updateDataRequestDto.deadline;
  
            this.emaiService.sendMail(
              user[0].email,
              'Assign  Data Entry',
              '',
              template,
            );
          }
        }
  
        dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
        dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
        dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
        dataRequestItem.cmAssessmentAnswer = undefined;
        dataRequestItem.investmentParameter = undefined;
        this.repo.save(dataRequestItem).then((res) => {
        });
      }
   

    return true;
  }

  async getClimateActionByDataRequestStatus(): Promise<any> {
    let data = this.ProjectRepo.createQueryBuilder('pr')
      .leftJoinAndMapMany(
        'pr.Assessment',
        Assessment,
        'ass',
        'pr.id = ass.climateAction_id',
      )
      .leftJoinAndMapMany(
        'ass.Parameter',
        Parameter,
        'para',
        'ass.id = para.assessment_id',
      )
      .leftJoinAndMapOne(
        'para.DataRequest',
        ParameterRequest,
        'paraReq',
        'para.id = paraReq.ParameterId', 
      )
      .where('paraReq.dataRequestStatus = ' + 2);

    let result = await data.getMany();
    return result;
  }

  async getClimateActionByDataRequestStatusSix(): Promise<any> {
    let data = this.ProjectRepo.createQueryBuilder('pr')
      .leftJoinAndMapMany(
        'pr.Assessment',
        Assessment,
        'ass',
        'pr.id = ass.climateAction_id',
      )
      .leftJoinAndMapMany(
        'ass.Parameter',
        Parameter,
        'para',
        'ass.id = para.assessment_id',
      )
      .leftJoinAndMapOne(
        'para.DataRequest',
        ParameterRequest,
        'paraReq',
        'para.id = paraReq.ParameterId', 
      )
      .where('paraReq.dataRequestStatus = ' + 6);

    let result = await data.getMany();

    return result;
  }

  async updateInstitution(
    updateValueDto: ParameterRequest,
    id:number
  ): Promise<any> {
    if(updateValueDto.tool==Tool.CM_tool){
      let update = await this.cmAssessmentAnswerRepo.createQueryBuilder()
      .update(CMAssessmentAnswer)
      .set({institution:updateValueDto?.cmAssessmentAnswer?.institution})
      .where("id = :id", { id: updateValueDto?.cmAssessmentAnswer?.id })
      .execute()
      return update;
    }
   else if(updateValueDto.tool==Tool.Investor_tool||Tool.Portfolio_tool){
      let update = await this.investmentRepo.createQueryBuilder()
      .update(InvestorAssessment)
      .set({institution:updateValueDto?.investmentParameter?.institution})
      .where("id = :id", { id: updateValueDto?.investmentParameter?.id })
      .execute()
      return update;
    }
    

  }
}
