import { Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { UpdateMethodologyAssessmentDto } from './dto/update-methodology-assessment.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { MethodologyAssessmentParameters } from './entities/methodology-assessment-parameters.entity';
import { Methodology } from './entities/methodology.entity';
import { Category } from './entities/category.entity';
import { Characteristics } from './entities/characteristics.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Barriers } from './entities/barriers.entity';
import { AssessmentBarriers } from './entities/assessmentbarriers.entity';
import { BarriersCategory } from './entities/barrierscategory.entity';
import { Indicators } from './entities/indicators.entity';
import { AssessmentCharacteristics } from './entities/assessmentcharacteristics.entity';
import { MethodologyIndicators } from './entities/methodologyindicators.entity';
import { UpdateValueEnterData } from './dto/updateValueEnterData.dto';
import { Institution } from 'src/institution/entity/institution.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { IPaginationOptions, paginate,} from 'nestjs-typeorm-paginate';
import { Results } from './entities/results.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { BarriersCharacteristics } from './entities/barriercharacteristics.entity';
import { AssessmentCategory } from './entities/assessmentCategory.entity';
import { Objectives } from './entities/objectives.entity';
import { AssessmentObjectives } from './entities/assessmentobjectives.entity';
import { MethodologyParameters } from './entities/methodologyParameters.entity';
import { User } from 'src/users/entity/user.entity';
import { DataVerifierDto } from 'src/assessment/dto/dataVerifier.dto';
import { UsersService } from 'src/users/users.service';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { ParameterRequestDto } from './dto/parameter-request.dto';
import axios from 'axios';
import { CalculationResults } from './entities/calculationResults.entity';
import { OutcomeCategory } from './dto/outcome-category.dto';
import { CMResultDto } from 'src/carbon-market/dto/cm-result.dto';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
@Injectable()
export class MethodologyAssessmentService extends TypeOrmCrudService <MethodologyAssessmentParameters>{
 
  

   constructor(
    @InjectRepository(MethodologyAssessmentParameters) repo, 
    @InjectRepository(Category) private readonly categotyRepository: Repository<Category>,
   @InjectRepository(Methodology) private readonly methodologyRepository: Repository<Methodology>,
   @InjectRepository(Characteristics) private readonly characteristicsRepository: Repository<Characteristics>,
   @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
   @InjectRepository(Barriers) private readonly barriersRepository: Repository<Barriers>,
   @InjectRepository(AssessmentBarriers) private readonly assessRepository: Repository<AssessmentBarriers>,
   @InjectRepository(BarriersCategory) private readonly baricatRepository: Repository<BarriersCategory>,
   @InjectRepository(Indicators) private readonly indicatorRepository: Repository<Indicators>,
   @InjectRepository(AssessmentCharacteristics) private readonly assessmentCharcteristicsRepository: Repository<AssessmentCharacteristics>,
   @InjectRepository(MethodologyIndicators) private readonly methIndicatorRepository: Repository<MethodologyIndicators>,
   @InjectRepository(Institution) private readonly institutionRepository: Repository<Institution>, 
    @InjectRepository(PolicyBarriers) private readonly policyBarrierRepository: Repository<PolicyBarriers>,
    @InjectRepository(Results) private readonly resultRepository: Repository<Results>,
    @InjectRepository(ParameterRequest) private readonly parameterRequestRepository: Repository<ParameterRequest>,
    @InjectRepository(BarriersCharacteristics) private readonly barrierCharacterRepo: Repository<BarriersCharacteristics>,
    @InjectRepository(AssessmentCategory) private readonly assessCategoryRepo: Repository<AssessmentCategory>,
    @InjectRepository(Objectives) private readonly objectivesRepo: Repository<Objectives>,
    @InjectRepository(AssessmentObjectives) private readonly assessObjRepo: Repository<AssessmentObjectives>,    
    @InjectRepository(MethodologyParameters ) private readonly methParameterRepo: Repository<MethodologyParameters>,
    @InjectRepository(CalculationResults ) private readonly calculationResultsRepo: Repository<CalculationResults>,
    
    private userService: UsersService,
    private emaiService: EmailNotificationService

   ) {
    super(repo)
  }
  


  async create(MethData: any) {
    let methodology = new Methodology();
    let policy = new ClimateAction();
     methodology.id = MethData.methodology;
    policy.id = MethData.policyId;


    let  date  = new Date()
     const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    let y = `${year}-${month}-${day}`;

    let assessement = new Assessment();
    assessement.climateAction = policy
    assessement.methodology = methodology
    assessement.year = y
    assessement.tool = MethData.tool
    assessement.assessmentType = MethData.assessment_type
    assessement.assessment_approach = MethData.assessment_approach
    assessement.assessment_method = MethData.assessment_method
    assessement.from = MethData.date1
    assessement.to  = MethData.date2
    assessement.person = MethData.person
    assessement.opportunities = MethData.opportunities
    assessement.impactsCovered = MethData.impactsCovered
    assessement.assessBoundry = MethData.assessBoundry
    assessement.audience = MethData.audience

   let assessRes =  this.assessmentRepository.save(assessement);
   let assessementId = (await assessRes).id;
   assessement.id = assessementId;

   for(let y of MethData.selectedBarriers){
      let assessmentBarriers = new AssessmentBarriers();
      let barrier = new Barriers();
      barrier.id = y.id,
      barrier.barrier = y.barrier

      assessmentBarriers.barriers = barrier;
      assessmentBarriers.assessment = assessement;

      await this.assessRepository.save(assessmentBarriers);
    } 

    let createdAssessment = new Assessment();
    createdAssessment.id = assessementId;

    for(let objectives of MethData.selectedObjectives){
      let assessObj = new AssessmentObjectives();
      assessObj.assessment = createdAssessment;
      assessObj.objectives = objectives;
      await this.assessObjRepo.save(assessObj);
    }
  
    for (let categoryData of MethData.categoryData) {
      let category = new Category();
      category.id = categoryData.categoryId;
      category.name = categoryData.category;

      let savedAssessment = new Assessment();

      savedAssessment.id = assessementId;

      let dataForCategory = new MethodologyAssessmentParameters();
      dataForCategory.score = categoryData.categoryScore;
      dataForCategory.category = category;
      dataForCategory.assessment = savedAssessment;
      dataForCategory.methodology = methodology;
      dataForCategory.isCategory = 1;
      dataForCategory.institution = categoryData.categoryInstitution;
      dataForCategory.scoreOrInstitutionJusti = categoryData.categoryComment;
      dataForCategory.fileName = categoryData.categoryFile;
     
  
      for (let characteristic of categoryData.characteristics) {
        let characteristics = new Characteristics();
        characteristics.name = characteristic.name;
        characteristics.id = characteristic.id;
       
        let data = new MethodologyAssessmentParameters();
        data.methodology = methodology;
        data.category = category;
        data.characteristics = characteristics;
        data.score = characteristic.score;
        data.relevance = characteristic.relevance;
        data.assessment = savedAssessment
        data.fileName = characteristic.filename;
        data.scoreOrInstitutionJusti = characteristic.comment;
        data.isCategory = 0;
        data.institution = characteristic.institution;
        data.chaDescription = characteristic.chaDescription;
        data.chaRelJustification = characteristic.chaRelJustification;
  
       await this.repo.save(data);
      }
      if(categoryData.categoryScore || categoryData.categoryInstitution){
        await this.repo.save(dataForCategory);
      }
      

    }
    return assessementId;
  }

  async saveAssessment(assessment: Assessment){
    let user = this.userService.currentUser();

    let currentUser = new User();
    currentUser.id = (await user).id

    assessment.user = currentUser;
    return await this.assessmentRepository.save(assessment)
  }

  async barrierCharacteristics(dataArr : any){

    let methodology = new Methodology();
    let policy = new ClimateAction();
     methodology.id = dataArr.alldata.methodology;
    policy.id = dataArr.alldata.policyId;


    let data = dataArr.alldata;
    let  date  = new Date();
     const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    let y = `${year}-${month}-${day}`;

    let savedAssessment = new Assessment();
    savedAssessment.assessmentType = data.assessment_type;
    savedAssessment.assessment_approach = data.assessment_approach;
    savedAssessment.assessment_method = data.assessment_method;
    savedAssessment.climateAction = data.policyId;
    savedAssessment.methodology = data.methodology;
    savedAssessment.from = data.date1;
    savedAssessment.to = data.date2;
    savedAssessment.tool = data.tool;
    savedAssessment.year = y;
    savedAssessment.person = data.person;
    savedAssessment.opportunities = data.opportunities;
    savedAssessment.impactsCovered = data.impactsCovered;
    savedAssessment.assessBoundry = data.assessBoundry;
    savedAssessment.audience = data.audience;

    let assessRes =  this.assessmentRepository.save(savedAssessment);
    let assessementId = (await assessRes).id;
 
    savedAssessment.id = assessementId;
 
 
    for(let y of data.selectedBarriers){
       let assessmentBarriers = new AssessmentBarriers();
       let barrier = new Barriers();
       barrier.id = y.id,
       barrier.barrier = y.barrier
 
       assessmentBarriers.barriers = barrier;
       assessmentBarriers.assessment = savedAssessment;
 
       await this.assessRepository.save(assessmentBarriers);
     } 

     let createdAssessment = new Assessment();
    createdAssessment.id = assessementId;

    for(let objectives of data.selectedObjectives){
      let assessObj = new AssessmentObjectives();
      assessObj.assessment = createdAssessment;
      assessObj.objectives = objectives;
      await this.assessObjRepo.save(assessObj);
    }


     for(let barrierCharacteristic of dataArr.dataArray){
      let obj = new BarriersCharacteristics()
      let barrierdata = new Barriers()
      barrierdata.id = barrierCharacteristic.barrier
      let assess = new Assessment();
      assess.id = assessementId
    
      let cha = new Characteristics()
      cha.id = barrierCharacteristic.chaId
      obj.assessment = assess
      obj.barriers = barrierdata
      obj.characteristics = cha
      obj.barrier_score = Number(barrierCharacteristic.barrierScore)
      obj.barrier_target = barrierCharacteristic.barrierTarget
      obj.bscore_comment = barrierCharacteristic.barrierComment
      obj.barrier_weight = barrierCharacteristic.barrierWeight
      obj.bweight_comment = barrierCharacteristic.bWeightComment
      obj.institution = barrierCharacteristic.barrierScoreInstitution

     await this.barrierCharacterRepo.save(obj);
     }


     for (let categoryData of dataArr.categoryData) {
      let category = new Category();
      category.id = categoryData.categoryId;
      category.name = categoryData.category;

      let savedAssessmentnew = new Assessment();

      savedAssessmentnew.id = assessementId

      let dataForCategory = new MethodologyAssessmentParameters();
      dataForCategory.score = categoryData.categoryScore
      dataForCategory.category = category
      dataForCategory.assessment = savedAssessmentnew
      dataForCategory.methodology = methodology
      dataForCategory.isCategory = 1
      dataForCategory.institution = categoryData.categoryInstitution
      dataForCategory.scoreOrInstitutionJusti = categoryData.categoryComment
      dataForCategory.fileName = categoryData.categoryFile
      dataForCategory.weight = Number(categoryData.categoryWeight)
     
  
     if(categoryData.categoryScore || categoryData.categoryInstitution || categoryData.categoryWeight){
      await this.repo.save(dataForCategory);
    }
      for (let characteristic of categoryData.characteristics) {
        let characteristics = new Characteristics();
        characteristics.name = characteristic.name;
        characteristics.id = characteristic.id;
  
  
       
        let data = new MethodologyAssessmentParameters();
        data.methodology = methodology;
        data.category = category;
        data.characteristics = characteristics;
        data.score = characteristic.score;
        data.relevance = characteristic.relevance;
        data.assessment = savedAssessment
        data.fileName = characteristic.filename;
        data.scoreOrInstitutionJusti = characteristic.comment;
        data.isCategory = 0;
        data.institution = characteristic.institution;
        data.weight = Number(characteristic.weight),
        data.chaDescription = characteristic.chaDescription;
        data.chaRelJustification = characteristic.chaRelJustification;
        
       await this.repo.save(data);
      }
    
      

    }


    return assessementId
  } 


  async barrierCharSave(dataArr : any){

    for(let barrierCharacteristic of dataArr.dataArray){
      let obj = new BarriersCharacteristics();
      let barrierdata = new Barriers();
      barrierdata.id = barrierCharacteristic.barrier;
      let savedAssessment = new Assessment();
      savedAssessment.id = dataArr.assessmentId;
    
      obj.assessment = savedAssessment;
      obj.barriers = barrierdata;
      obj.characteristics = barrierCharacteristic.chaId;
      obj.barrier_score = barrierCharacteristic.barrierScore;
      obj.barrier_target = barrierCharacteristic.barrierTarget;
      obj.bscore_comment = barrierCharacteristic.barrierComment;
      obj.barrier_weight = barrierCharacteristic.barrierWeight;
      obj.bweight_comment = barrierCharacteristic.bWeightComment;
      


      await this.barrierCharacterRepo.save(obj);
     }

    return dataArr;
  }


  async createAssessCharacteristics(charAssessData :any){

    let charAssessment = new Assessment();

    charAssessment.id = charAssessData.assessment;

    for(let item of charAssessData.characteristics){
      let newdata = new AssessmentCharacteristics();
      let characteristic = new Characteristics();

      characteristic.id = item.id;
      characteristic.name = item.name;

      newdata.assessment = charAssessment;
      newdata.characteristics = characteristic;

      await this.assessmentCharcteristicsRepository.save(newdata);

    }

    return charAssessData;
  }


  async findAssessmentParameters(assessmentId: number): Promise<MethodologyAssessmentParameters[]>{
    let paras = await this.repo.find({
      where: {assessment: {id: assessmentId}},
      relations: ['assessment', 'methodology', 'category', 'characteristics', 'institution', 'status']
    })
    return paras
  }
  

  async assessmentParameters(assessmentId: number): Promise<MethodologyAssessmentParameters[]> {
    return this.repo.find({
      relations: ['characteristics','assessment','category'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async assessCategory(resData :any){
    for(let item of resData.result.categoryCalculatedProcess){
      let data = new AssessmentCategory ();
      data.assessment = resData.assesId;
      data.category = item.categoryId;
     data.categoryScore = item.score;
     data.categoryWeight = item.weight;
      await this.assessCategoryRepo.save(data);
    }

    for(let item of resData.result.categoryCalculatedoutcome){
      let data = new AssessmentCategory ();
      data.assessment = resData.assesId;
      data.category = item.categoryId;
     data.categoryScore = item.score;
     data.categoryWeight = item.weight;
      await this.assessCategoryRepo.save(data);
    }

  }


  async createResults(result :any){
    let data = new Results ();
    data.assessment = result.assessment_id;
    data.averageOutcome = result.averageOutcome;
    data.averageProcess = result.averageProcess;
    await this.resultRepository.save(data);

  }

  
  async findByAssessIdAndRelevanceNotRelevant(assessId: number): Promise<Characteristics[]> {
    const characteristicsIds = await this.repo
      .createQueryBuilder('map')
      .select('map.characteristics.id', 'id')
      .leftJoin('map.characteristics', 'characteristics')
      .where('map.assessment.id = :assessId', { assessId })
      .andWhere('map.relevance != :notRelevant', { notRelevant: 'not_relevant' })
      .getRawMany();

    const characteristics = await this.characteristicsRepository
      .createQueryBuilder('characteristics')
      .where('characteristics.id IN (:...ids)', { ids: characteristicsIds.map((c) => c.id) })
      .getMany();

    return characteristics;
  }

  async findByAssessIdBarrierData(assessId: number): Promise<BarriersCharacteristics[]> {
    const barriersIds = await this.repo
      .createQueryBuilder('map')
      .select('barriers_characteristics.id', 'id')
      .leftJoin('map.barriers', 'barriers')
      .leftJoin('barriers.barriersCharacteristics', 'barriers_characteristics')
      .leftJoin('barriers_characteristics.characteristics', 'characteristics')
      .where('map.assessment.id = :assessId', { assessId })
      .getRawMany();
  
    const barriersdata = await this.barrierCharacterRepo
      .createQueryBuilder('barriers_characteristics')
      .where('barriers_characteristics.id IN (:...ids)', { ids: barriersIds.map((c) => c.id) })
      .getMany();
  
    return barriersdata;
}


  findAll(): Promise<Category[]> {
    return this.categotyRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.methodology', 'methodology')
      .where('category.methodology_id = methodology.id')
      .getMany();
  }

  findAllMethodologies(): Promise<Methodology[]> {
    return this.methodologyRepository.find();
  }

  async findAllObjectives(): Promise<Objectives[]> {
    return await this.objectivesRepo.find();
  }

  async findAllBarriers(): Promise<Barriers[]> {
    return await this.barriersRepository.find();
  }

  async findAllBarriersCharacter(): Promise<BarriersCharacteristics[]> {
    return await this.barrierCharacterRepo.find({
      relations: ['assessment', 'barriers','characteristics'],
    });
  }

  async findByAllCategories(): Promise<BarriersCategory[]> {
    return await this.baricatRepository.find();

  }

  async findByAllAssessmentBarriers(): Promise<AssessmentBarriers[]> {
  
    return await this.assessRepository.find({
      relations: ['assessment', 'barriers'],
    });

  }





  async getparam(id:number):Promise<MethodologyAssessmentParameters[]>{
    let result=await this.repo.createQueryBuilder('param')
    .leftJoinAndMapOne('param.assessment',Assessment,'ass',`param.assessment_id = ass.id`)
    .leftJoinAndMapOne('ass.climateAction',ClimateAction,'cl',`ass.climateAction_id = cl.id`)
    .leftJoinAndMapOne('param.methodology',Methodology,'meth',`meth.id = param.methodology_id`)
    .leftJoinAndMapOne('param.category',Category,'cat',`cat.id = param.category_id`)
    .leftJoinAndMapOne('param.characteristics',Characteristics,'cha',`cha.id = param.characteristics_id`)
    .leftJoinAndMapOne('param.institution',Institution,'ins',`ins.id = param.institution_id`)
    .leftJoinAndMapOne('param.parameterRequest',ParameterRequest,'pr',`pr.ParameterId = param.id`)
    .where(`param.assessment_id = ` +id)
    .getMany();

    return result;
  }

  async getResultPageData(skip, pageSize, filterText, sectorList, assessmentType): Promise<any[]> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter = '(climateAction.policyName LIKE :filterText OR assessment.assessment_approach LIKE :filterText OR assessment.assessmentType LIKE :filterText OR assessment.tool LIKE :filterText OR climateAction.intervention_id LIKE :filterText)'
    }

    let user = await this.userService.currentUser();
    let data = this.resultRepository.createQueryBuilder('result')
      .leftJoinAndSelect(
        'result.assessment',
        'assessment',
        'assessment.id = result.assessment_id'
      )
      .leftJoinAndSelect(
        'assessment.climateAction',
        'climateAction',
        'climateAction.id = assessment.climateAction_id'
      )
      .leftJoinAndMapMany(
        'climateAction.policy_sector',
        PolicySector,
        'policy_sector',
        `policy_sector.intervention_id = climateAction.id`,
      )
      .leftJoinAndSelect(
        'policy_sector.sector',
        'sector',
        'sector.id = policy_sector.sector_id'
      )
      .leftJoinAndSelect(
        'assessment.user',
        'user',
        'user.id = assessment.user_id'
      )
      .leftJoinAndSelect(
        'user.country',
        'country',
        'country.id = user.countryId'
      )
      .leftJoinAndSelect(
        'user.userType',
        'userType',
        'userType.id = user.userTypeId'
      )
      if (user.userType?.name === 'External') {
        if (user?.id) data.where('user.id = :userId', {userId: user.id})
      } else {
        if (user?.country?.id) data.where('country.id = :countryId', {countryId: user.country.id})
      }
      data.orderBy('assessment.id', 'DESC')
      .skip(skip)
      .take(pageSize)

      if (filterText != null && filterText != undefined && filterText != '') {
        data.andWhere(filter, {filterText: `%${filterText}%`})
      }

      if (sectorList !== '') {
        let secIds = sectorList.split(',')
        data.andWhere('sector.id IN (:sectorList)', {sectorList: secIds})
      }

      if (assessmentType !== '') {
        data.andWhere('assessment.assessmentType = :type', {type: assessmentType})
      }

      try {
        let res=  await data.getManyAndCount()
        return res
      } catch (err) {
      }
  }

  async results(): Promise<Results[]> {
     return await this.resultRepository.find({
       relations: ['assessment'],
     });
    
   
  }

   async getResultByAssessment(assessmentId: number){
    return await this.resultRepository.findOne({
      where: {assessment: {id: assessmentId}},
      relations: ['assessment']
    })
   }

  async findByAllAssessmentData(): Promise<MethodologyAssessmentParameters[]> {
    return this.repo.find({
      relations: ['assessment', 'methodology', 'category', 'characteristics', 'institution', 'status'],
    });
  }

  async AssessmentDetails(): Promise<Assessment[]> {
    let user = this.userService.currentUser();
      let res = this.assessmentRepository.find({
        relations: [ 'methodology', 'climateAction','user'],
      });

      let assessList: Assessment[] = [];

    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';

    for (const x of await res) {
      const isSameUser = x.user?.id === currentUser?.id;
      const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.user?.userType?.name !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        assessList.push(x);
      }
    }

      return assessList
    }

   
    async AssessmentDetailsforTool(tools: string[]): Promise<any[]> {
      let user = this.userService.currentUser();
      let res = this.assessmentRepository.find({
        relations: ['methodology', 'climateAction', 'user'],
      });
  
      let assessList: Assessment[] = [];
  
      const currentUser = await user;
      const isUserExternal = currentUser?.userType?.name === 'External';
  
      for (const x of await res) {
        const isSameUser = x.user?.id === currentUser?.id;
        const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
        const isUserInternal = x.user?.userType?.name !== 'External';
  
        if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
          assessList.push(x);
        }
      }
  
      const filteredResults = assessList.filter(assessment =>  tools.includes(assessment?.tool));
  
      filteredResults.sort((a, b) => b.id - a.id);
      return filteredResults
      } 

  async findAllPolicyBarriers(): Promise<any[]> {
    return []
  }
  


  async findAllBarrierData(assessmentId: number): Promise<BarriersCharacteristics[]> {
    return this.barrierCharacterRepo.find({
      relations: ['barriers', 'characteristics', 'assessment'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async getAssessCategory(assessmentId: number): Promise<AssessmentCategory[]> {
    return this.assessCategoryRepo.find({
      relations: [ 'assessment','category'],
      where: { assessment: { id: assessmentId } },
    });
  }

  
  async findAllIndicators(): Promise<Indicators[]> {
    const indicators = await this.indicatorRepository.createQueryBuilder('indicators')
        .leftJoinAndSelect('indicators.characteristics', 'characteristics')
        .getMany();
    return indicators;
  }

  async findAllMethIndicators(): Promise<MethodologyIndicators[]> {
    const methodologyIndicators = await this.methIndicatorRepository.createQueryBuilder('methodology_indicators')
        .leftJoinAndSelect('methodology_indicators.indicator', 'indicator')
        .getMany();
    return methodologyIndicators;
  }

  async findAllMethParameters():Promise<MethodologyParameters[]> {
    const methodologyParamaeters = await this.methParameterRepo.createQueryBuilder('methodology_parameters')
        .leftJoinAndSelect('methodology_parameters.methodology', 'methodology')
        .getMany();
    return methodologyParamaeters;
  }
  
  findAllCategories(): Promise<Category[]> {
    return this.categotyRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.methodology', 'methodology')
      .where('category.methodology_id = methodology.id')
      .getMany();
  }

  async getAllOutcomeCharacteristics() {
    let data = this.characteristicsRepository.createQueryBuilder('characteristic')
      .leftJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      ).where('category.type = :type', { type: 'outcome' })

    let response: OutcomeCategory[] = []

    let result = await data.getMany()
    for await (let ch of result) {
      let isGHG: boolean = false;
      let isSDG: boolean = false;
      let res = this.mapCharacteristicNames(ch);
      ch.name = res.name;
      ch.code = res.code;
      let cat = response.find(o => o.code === ch.category.code);
      let cmRes = new CMResultDto();
      cmRes.characteristic = ch ;
      ch.category.code.indexOf('GHG') !== -1 ? isGHG = true : isSDG = true;
      cmRes.isGHG = isGHG;
      cmRes.isSDG = isSDG;
      if (cat) {
        cat.results.push(cmRes);
      } else {
        let obj = new OutcomeCategory();
        obj.name = this.mapCategoryNames(ch.category);
        obj.code = ch.category.code;
        obj.method = ch.category.code.indexOf('SCALE') !== -1 ? 'SCALE' : 'SUSTAINED';
        obj.type = ch.category.code.indexOf('GHG') !== -1 ? 'GHG' : (ch.category.code.indexOf('ADAPTATION') !== -1 ? 'ADAPTATION' : 'SD');
        obj.results = [cmRes];
        response.push(obj);
      }
    }

    response = response.map(res => {
      if (res.method === 'SCALE' && res.type === 'GHG') res.order = 1;
      else if (res.method === 'SUSTAINED' && res.type === 'GHG') res.order = 2;
      else if(res.method === 'SCALE' && res.type === 'SD') res.order = 3;
      else if (res.method === 'SUSTAINED' && res.type === 'SD') res.order = 4;
      else if (res.method === 'SCALE' && res.type === 'ADAPTATION') res.order = 5;
      else if (res.method === 'SUSTAINED' && res.type === 'ADAPTATION') res.order = 6;
      else res.order = 0;
      return res;
     })

     response.sort((a,b) => a.order - b.order);

    return response;
  }

  mapCategoryNames(category: Category){
    switch (category.code) {
      case 'SCALE_GHG':
        return 'GHGs <br> Scale of outcomes';
      case 'SCALE_SD':
        return 'SDGs <br> Scale of outcomes';
      case 'SUSTAINED_GHG':
        return 'Time frame <br> outcome is sustained';
      case 'SUSTAINED_SD':
        return 'Time frame <br> outcome is sustained';
      case 'SCALE_ADAPTATION':
        return 'Adaptation co-benifits <br> Scale of outcomes';
      case 'SUSTAINED_ADAPTATION':
        return 'Time frame <br> outcome is sustained';
    }
  }

  mapCharacteristicNames(characteristic: Characteristics){
    let res = {}
    switch (characteristic.category.code){
      case 'SCALE_GHG': 
        if (characteristic.code === 'MACRO_LEVEL') {
          return {
            name: 'What is the scale of the GHG outcome at international\/global level?',
            code: 'INTERNATIONAL'
          }
        } else if (characteristic.code === 'MEDIUM_LEVEL') {
          return {
            name: 'What is the scale of the GHG outcome at national or sectoral level?',
            code: 'NATIONAL'
          }
        } else if (characteristic.code === 'MICRO_LEVEL') {
          return {
            name: 'What is the scale of the GHG outcome on a subnational (i.e. municipal, provincial, city-level) or subsectoral level?',
            code: 'SUBNATIONAL'
          }
        }
        break;
      case 'SCALE_SD':
        if (characteristic.code === 'MACRO_LEVEL') {
          return {
            name: 'What is the scale of the contribution to this SDG at international\/global level?',
            code: 'INTERNATIONAL'
          }
        } else if (characteristic.code === 'MEDIUM_LEVEL') {
          return {
            name: 'What is the scale of the contribution to this SDG at national or sectoral level?',
            code: 'NATIONAL'
          }
        } else if (characteristic.code === 'MICRO_LEVEL') {
          return {
            name: 'What is the scale of the SDG outcome on a subnational (i.e. municipal, provincial, city-level) or subsectoral level?',
            code: 'SUBNATIONAL'
          }
        }
        break;
      case 'SUSTAINED_GHG':
        if (characteristic.code === 'LONG_TERM') {
          return {
            name: 'What is the time frame of the GHG outcome at international\/global level?',
            code: 'INTERNATIONAL'
          }
        } else if (characteristic.code === 'MEDIUM_TERM') {
          return {
            name: 'What is the time frame of the GHG outcome at national or sectoral level?',
            code: 'NATIONAL'
          }
        } else if (characteristic.code === 'SHORT_TERM') {
          return {
            name: 'What is the time frame of the GHG outcome  on a subnational (i.e. municipal, provincial, city-level) or subsectoral level?',
            code: 'SUBNATIONAL'
          }
        }
        break;
      case 'SUSTAINED_SD':
        if (characteristic.code === 'LONG_TERM') {
          return {
            name: 'What is the time frame of the contribution to this SDG at international\/global level?',
            code: 'INTERNATIONAL'
          }
        } else if (characteristic.code === 'MEDIUM_TERM') {
          return {
            name: 'What is the time frame of the contribution to this SDG at national or sectoral level?',
            code: 'NATIONAL'
          }
        } else if (characteristic.code === 'SHORT_TERM') {
          return {
            name: 'What is the time frame of the contribution to this SDG  on a subnational (i.e. municipal, provincial, city-level) or subsectoral level?',
            code: 'SUBNATIONAL'
          }
        }
        break;
      case 'SCALE_ADAPTATION':
        if (characteristic.code === 'INTERNATIONAL') {
          return {
            name: 'What is the scale of the adaptation co-benefits at international\/global level?',
            code: 'INTERNATIONAL'
          }
        } else if (characteristic.code === 'NATIONAL') {
          return {
            name: 'What is the scale of the adaptation co-benefits at national or sectoral level?',
            code: 'NATIONAL'
          }
        } else if (characteristic.code === 'SUBNATIONAL') {
          return {
            name: 'What is the scale of the adaptation co-benefits on a subnational (i.e. municipal, provincial, city-level) or subsectoral level?',
            code: 'SUBNATIONAL'
          }
        }
        break;
      case 'SUSTAINED_ADAPTATION':
        if (characteristic.code === 'INTERNATIONAL') {
          return {
            name: 'What is the time frame of the adaptation co-benefits at international\/global level?',
            code: 'INTERNATIONAL'
          }
        } else if (characteristic.code === 'NATIONAL') {
          return {
            name: 'What is the time frame of the adaptation co-benefits at national or sectoral level?',
            code: 'NATIONAL'
          }
        } else if (characteristic.code === 'SUBNATIONAL') {
          return {
            name: 'What is the time frame of the adaptation co-benefits  on a subnational (i.e. municipal, provincial, city-level) or subsectoral level?',
            code: 'SUBNATIONAL'
          }
        }
        break;
    }
  }

  async findAllCharacteristics(): Promise<Characteristics[]> {
    return this.characteristicsRepository.createQueryBuilder('characteristics')
    .leftJoinAndSelect('characteristics.category', 'category')
    .where('characteristics.category_id = category.id')
    .getMany();
  }

  async assessmentData(assessmentId: number): Promise<Assessment[]> {
    return this.assessmentRepository.find({
      relations: ['climateAction'],
      where: { id: assessmentId  },
    });
  }

  update(id: number, updateMethodologyAssessmentDto: UpdateMethodologyAssessmentDto) {
    return `This action updates a #${id} methodologyAssessment`;
  }

  remove(id: number) {
    return `This action removes a #${id} methodologyAssessment`;
  }



  async barriesByassessId(assessmentId: number): Promise<AssessmentBarriers[]> {
    return this.assessRepository.find({
      relations: ['assessment','barriers'],
      where: {  assessment: { id: assessmentId } },
    });
  }


  async updateEnterDataValue(
    updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    let dataEnterItem = await this.repo.findOne({
      where: { id: updateValueDto.id },
    });
    if (dataEnterItem) {
      dataEnterItem.score = updateValueDto.value;
      if(updateValueDto.assumptionParameter != null)
      {
        dataEnterItem.enterDataAssumption = updateValueDto.assumptionParameter;
      }
      this.repo.save(dataEnterItem);
      return true;
    }
    return false;
  }

  async updateInstitution(
    updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    let institutionItem = await this.institutionRepository.findOne({
      where: { id: updateValueDto.institutionId }
    });
   let data= this.parameterRequestRepository.findOne({
    where: { id: updateValueDto.id }
  });
    let dataEnterItem = await this.repo.findOne({
      where: { id: (await data).parameter.id }
    });
    dataEnterItem.institution = institutionItem;
    this.repo.save(dataEnterItem);

    return true;
  }

  async updateParameter(id: number, parameter: MethodologyAssessmentParameters){
    try {
      let update = await this.repo.update(id, parameter)
      if (update.affected === 1){
        return update
      } else {
        throw new InternalServerErrorException()
      }
    } catch(error){
      throw new InternalServerErrorException()
    }
  }

  async updateResult(id: number, result: Results){
    try{
      let update = await this.resultRepository.update(id, result)
      if (update.affected === 1){
        return update
      } else {
        throw new InternalServerErrorException()
      }
    } catch(error) {
      throw new InternalServerErrorException()
    }
  }

  async allParam(
    options: IPaginationOptions,
    filterText: string[]){
      let filter: string = '';
  }

  async getAssessmentForAssignVerifier(
    options: IPaginationOptions,
    filterText: string,
    QAstatusId: number,
    countryIdFromTocken:number
  ): Promise<any> {


    let data = this.assessmentRepository
      .createQueryBuilder('assessment')
      .innerJoinAndMapOne('assessment.project', ClimateAction, 'p', `assessment.climateAction_id = p.id and p.countryId = ${countryIdFromTocken}`)
      .leftJoinAndMapOne(
        'assessment.verificationUser',
        User,
        'u',
        'assessment.verificationUser = u.id',
      )
      .where(
        (
          (QAstatusId != 0
            ? `assessment.verificationStatus=${QAstatusId} AND `
            : `assessment.verificationStatus in (2,3,4,5,6,7) AND `) +
          `assessment.qaStatus in (4) AND ` +
          (filterText != ''
            ? `(p.policyName LIKE '%${filterText}%' OR assessment.assessmentType LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )
      .orderBy('assessment.verificationDeadline', 'DESC')
      .groupBy('assessment.id');


    let result = await paginate(data, options);
    return result;
  }

  async acceptDataVerifiersForIds(
    updateDataRequestDto: DataVerifierDto,
  ): Promise<boolean> {

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.assessmentRepository.findOne({ where: { id: id } });
      let originalStatus = dataRequestItem.verificationStatus;
      dataRequestItem.verificationDeadline = updateDataRequestDto.deadline;
      dataRequestItem.verificationUser = updateDataRequestDto.userId;

      let user=await this.userService.findOne({where:{id:updateDataRequestDto.userId}});
      var template: any;
        template =
          'Dear ' +
          user.firstName + ' ' + user.lastName+
          ' <br/> Data request with following information has shared with you.' 
      
          this.emaiService.sendMail(
            user.email,
            'Assign verifier',
            '',
            template,
          );
      this.assessmentRepository.save(dataRequestItem).then((res) => {
      });
    }

    return true;
  }

  async getAssessmentsByClimateAction(climateActionId: number) {
    return await this.assessmentRepository.createQueryBuilder('assessment')
    .innerJoinAndSelect(
      'assessment.climateAction',
      'climateAction',
      'climateAction.id = assessment.climateAction_id'
    ).where("climateAction.id = :id and assessment.tool in('PORTFOLIO','INVESTOR') ", {id: climateActionId})
    .getMany()
  }


  async findMethbyName(methName:string){
    let meth = this.methIndicatorRepository.findOneBy({name:methName})
    return meth;

  }

  async updateIndicatorValue(req: UpdateIndicatorDto) {
    let data =req.data
    for (let x of data) {
      
      if(x.indicatorValue && !x.parameter){
        await this.repo
        .createQueryBuilder()
        .update(MethodologyAssessmentParameters)
        .set({ indicatorValue: x.indicatorValue,indicator:x.indicator})
        .where("assessment_id = :id", { id: req.assessmentId })
        .andWhere(new Brackets(qb => {
          qb.where("characteristics_id = :char_id", { char_id: x.id })
        }))
        .execute()
      }
      if(x.indicator && !x.indicatorValue && x.parameters.length!==0){
        let assessID = req.assessmentId
        let a= await this.assessmentRepository.findOneBy({id:assessID});
        let meth = x.selectedMethodology
        let request = new ParameterRequestDto()
        request.equation =meth.meth_code;
        request.data = x.parameters;
        let response = await axios.post('/calculate', request);
        let indicatorValue:number = response.data.result;
        for (let paramData of x.parameters) {
          let  paramResult = new CalculationResults ();
          
          paramResult.assessment=a;
          paramResult.characteristics =x.id;
          paramResult.parameter = paramData.id;
          paramResult.result= indicatorValue;
          paramResult.value =paramData.value;
          paramResult.methodology =x.selectedMethodology;
          this.calculationResultsRepo.save(paramResult)
          
        }

        await this.repo
        .createQueryBuilder()
        .update(MethodologyAssessmentParameters)
        .set({ indicatorValue: indicatorValue,indicator:x.indicator})
        .where("assessment_id = :id", { id: req.assessmentId })
        .andWhere(new Brackets(qb => {
          qb.where("characteristics_id = :char_id", { char_id: x.id })
        }))
        .execute()
      }
     
      
    }
    return 0;
    
  }

  async getResultForTool(tool: string): Promise<any[]> {
    const results = await this.resultRepository.find({
      relations: ['assessment'],
    });
  
    const filteredResults = results.filter(result => result.assessment?.tool === tool && result.averageProcess !== null && result.averageOutcome !== null);
  
    const formattedResults = filteredResults.map(result => {
      return {
        data: result.assessment.climateAction.policyName,
        y: result.averageProcess,
        x: result.averageOutcome
      };
    });
  
    return formattedResults;
  }

  async getCountByTool(): Promise<any[]> {
    const filteredResults = await this.resultRepository.find({
      relations: ['assessment'],
    });
  
    const formattedResults = filteredResults.map(result => {
      return {
        data: result.assessment.climateAction.policyName,
        y: result.averageProcess,
        x: result.averageOutcome
      };
    });
  
    return formattedResults;
  }



  async getTCForTool(tool: string): Promise<any[]> {
    let user = this.userService.currentUser();
    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';
    const results = await this.assessmentRepository.find({
      relations: ['climateAction','user']
    });
  
     let filteredResults = results.filter(result => result.tool === tool );
     if(isUserExternal){
      filteredResults= filteredResults.filter(result => 
        
        { 
          if (result?.user?.id===currentUser?.id){
         
          return result
        }})
        
     }
     else {
      filteredResults= filteredResults.filter(result => {
        
        if(result?.climateAction?.country?.id===currentUser?.country?.id){
          return result;
        }})
     }
  
    const formattedResults = filteredResults.map(result => {
      return {
        id : result.id,
        data: result.climateAction.policyName,
        y: result.tc_value,
        x: result.climateAction.intervention_id,
        intervention: result.climateAction.id
      };
    }); 
  
    return formattedResults;
  }

  async findCharacteristicByCode(cat_code: string, ch_code: string) {
    try {
      return await this.characteristicsRepository.createQueryBuilder('ch')
      .innerJoin(
        'ch.category',
        'category',
        'category.id = ch.category_id'
      )
      .where('ch.code = :ch_code', {ch_code: ch_code})
      .andWhere('category.code = :cat_code', {cat_code: cat_code})
      .getOne() 
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
  
  
}
