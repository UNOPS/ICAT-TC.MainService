import { Injectable } from '@nestjs/common';
import { CreateMethodologyAssessmentDto } from './dto/create-methodology-assessment.dto';
import { UpdateMethodologyAssessmentDto } from './dto/update-methodology-assessment.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Results } from './entities/results.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { BarriersCharacteristics } from './entities/barriercharacteristics.entity';
import { getConnection } from 'typeorm';
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

   ) {
    super(repo)
  }
  
/*   create(MethData : any) {
   // console.log("result")
   // console.log(createMethodologyAssessmentDto)
   let methName = MethData.methodology;
   console.log("MethName : ", methName)

   for(let category of MethData.categoryData ){
    
    let categoryId = category.categoryId;
    let categoryName = category.category;
    let categoryScore = category.categoryScore;
 //   console.log("categoryName : ", categoryName)
    for(let characteristic of category.characteristics){
      //  console.log("chadata", characteristic)
      //  console.log("categryID : ", categoryId)
      ///  console.log(typeof categoryId)

        let data ={
          category_id : categoryId,
        //  methodology_id : methName,
          characteristics_id : 1,
          relevance: characteristic.relevance,
          characteristics_score : characteristic.score,
          category_score :categoryScore,
        }

        console.log("dataaa : ", data)

        this.repo.save(data);

    }
   // this.repo.save(MethData);
   }
    return MethData;
  } */


  async create(MethData: any) {

    console.log("aaaa", MethData)
    let methodology = new Methodology();
    let policy = new ClimateAction();
     methodology.id = MethData.methodology;
  //  console.log("MethName: ", methodology.id);
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
    assessement.assessment_approach = MethData.assessment_approach,
    assessement.assessment_method = MethData.assessment_method,
    assessement.from = MethData.date1,
    assessement.to  = MethData.date2

   let assessRes =  this.assessmentRepository.save(assessement);
   let assessementId = (await assessRes).id

   assessement.id = assessementId

    console.log("assessRes : ",(await assessRes).id)

   for(let y of MethData.selectedBarriers){
      let assessmentBarriers = new AssessmentBarriers()
      let barrier = new Barriers();
      barrier.id = y.id,
      barrier.barrier = y.barrier

      assessmentBarriers.barriers = barrier
      assessmentBarriers.assessment = assessement

      await this.assessRepository.save(assessmentBarriers);
    } 
  
    for (let categoryData of MethData.categoryData) {
      let category = new Category();
      category.id = categoryData.categoryId;
      category.name = categoryData.category;

      let savedAssessment = new Assessment();

      savedAssessment.id = assessementId

      let dataForCategory = new MethodologyAssessmentParameters();
      dataForCategory.score = categoryData.categoryScore
      dataForCategory.category = category
      dataForCategory.assessment = savedAssessment
      dataForCategory.methodology = methodology
      dataForCategory.isCategory = 1
      dataForCategory.institution = categoryData.categoryInstitution
      dataForCategory.comment = categoryData.categoryComment
      dataForCategory.fileName = categoryData.categoryFile
     
     // category.categoryScore = categoryData.categoryScore;
     // console.log("Category: ", category);
  
      for (let characteristic of categoryData.characteristics) {
        let characteristics = new Characteristics();
        characteristics.name = characteristic.name;
        characteristics.id = characteristic.id;
     //   console.log("Characteristics: ", characteristics);
  
  
       
        let data = new MethodologyAssessmentParameters();
        data.methodology = methodology;
        data.category = category;
      //  data.category_score = categoryData.categoryScore;
        data.characteristics = characteristics;
        data.score = characteristic.score;
        data.relevance = characteristic.relevance;
        data.assessment = savedAssessment
        data.fileName = characteristic.filename;
        data.comment = characteristic.comment;
        data.isCategory = 0;
        data.institution = characteristic.institution;
      //  console.log("Data: ", data);
  
       await this.repo.save(data);
      }
      if(categoryData.categoryScore || categoryData.categoryInstitution){
        await this.repo.save(dataForCategory);
      }
      

    }
    //assessementId
    console.log("iddd", assessementId)
    return assessementId;
  }

  async barrierCharacteristics(dataArr : any){
    let data = dataArr.alldata
    console.log("dattaaaa",data)
    let  date  = new Date()
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
    savedAssessment.year = y

    let assessRes =  this.assessmentRepository.save(savedAssessment);
    let assessementId = (await assessRes).id
 
    savedAssessment.id = assessementId
 
     console.log("assessRes : ",(await assessRes).id)
 
    for(let y of data.selectedBarriers){
       let assessmentBarriers = new AssessmentBarriers()
       let barrier = new Barriers();
       barrier.id = y.id,
       barrier.barrier = y.barrier
 
       assessmentBarriers.barriers = barrier
       assessmentBarriers.assessment = savedAssessment
 
       await this.assessRepository.save(assessmentBarriers);
     } 


     for(let barrierCharacteristic of dataArr.dataArray){
      let obj = new BarriersCharacteristics()
    //  let assessmentBarriers = new AssessmentBarriers()
      let barrierdata = new Barriers()
      barrierdata.id = barrierCharacteristic.barrier
      let assess = new Assessment();
      assess.id = assessementId
    
      obj.assessment = assess
      obj.barriers = barrierdata
      obj.characteristics = barrierCharacteristic.chaId
      obj.barrier_score = barrierCharacteristic.barrierScore
      obj.bscore_comment = barrierCharacteristic.barrierComment
      obj.barrier_weight = barrierCharacteristic.barrierWeight
      obj.bweight_comment = barrierCharacteristic.bWeightComment

      await this.barrierCharacterRepo.save(obj);
     }



    return assessementId
  } 


  async barrierCharSave(dataArr : any){

    console.log("barrierCharSave", dataArr)
    for(let barrierCharacteristic of dataArr.dataArray){
      let obj = new BarriersCharacteristics()
    //  let assessmentBarriers = new AssessmentBarriers()
      let barrierdata = new Barriers()
      barrierdata.id = barrierCharacteristic.barrier
      let savedAssessment = new Assessment();
      savedAssessment.id = dataArr.assessmentId
    
      obj.assessment = savedAssessment
      obj.barriers = barrierdata
      obj.characteristics = barrierCharacteristic.chaId
      obj.barrier_score = barrierCharacteristic.barrierScore
      obj.bscore_comment = barrierCharacteristic.barrierComment
      obj.barrier_weight = barrierCharacteristic.barrierWeight
      obj.bweight_comment = barrierCharacteristic.bWeightComment
      


      await this.barrierCharacterRepo.save(obj);
     }

    return dataArr
  }


  async createAssessCharacteristics(charAssessData :any){

    console.log("assessChaData:", charAssessData)
    let charAssessment = new Assessment();

    charAssessment.id = charAssessData.assessment

    for(let item of charAssessData.characteristics){
      let newdata = new AssessmentCharacteristics();
      let characteristic = new Characteristics();

      characteristic.id = item.id;
      characteristic.name = item.name;

      newdata.assessment = charAssessment
      newdata.characteristics = characteristic

      await this.assessmentCharcteristicsRepository.save(newdata);

    }

    return charAssessData
  }

  async createResults(result :any){
    let data = new Results ()
    data.assessment = result.assessment_id
    data.averageOutcome = result.averageOutcome
    data.averageProcess = result.averageProcess
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


/*   findAll(): Promise<Category[]> {
    return this.methodologyRepository.find();
  } */

  findAll(): Promise<Category[]> {
    return this.categotyRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.methodology', 'methodology')
      .where('category.methodology_id = methodology.id')
      .getMany();
  }

  findAllMethodologies(): Promise<Methodology[]> {
    return this.methodologyRepository.find();
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
   // return await this.assessRepository.find();

    return await this.assessRepository.find({
      relations: ['assessment', 'barriers'],
    });

  }
  async getparam(id:number):Promise<MethodologyAssessmentParameters[]>{
    // const ass =await  this.assessmentRepository.findOne({where:{id:id}})
    let result=await this.repo.createQueryBuilder('param')
    .leftJoinAndMapOne('param.assessment',Assessment,'ass',`param.assessment_id = ass.id`)
    .leftJoinAndMapOne('param.methodology',Methodology,'meth',`meth.id = param.methodology_id`)
    .leftJoinAndMapOne('param.category',Category,'cat',`cat.id = param.category_id`)
    .leftJoinAndMapOne('param.characteristics',Characteristics,'cha',`cha.id = param.characteristics_id`)
    .leftJoinAndMapOne('param.institution',Institution,'ins',`ins.id = param.institution_id`)
    .leftJoinAndMapOne('param.parameterRequest',ParameterRequest,'pr',`pr.ParameterId = param.id`)
    .where(`param.assessment_id = ` +id)
    .getMany();

    return result;
  }

  async results(): Promise<Results[]> {
    // return await this.assessRepository.find();
     return await this.resultRepository.find({
       relations: ['assessment'],
     });
   }

  async findByAllAssessmentData(): Promise<MethodologyAssessmentParameters[]> {
  //  return await this.repo.find();
    return this.repo.find({
      relations: ['assessment', 'methodology', 'category', 'characteristics', 'institution', 'status'],
    });
  }

  AssessmentDetails(): Promise<Assessment[]> {
    //  return await this.repo.find();
      return this.assessmentRepository.find({
        relations: [ 'methodology', 'climateAction'],
      });
    }


  async findAllPolicyBarriers(): Promise<any[]> {
    const policyBarriers = await this.policyBarrierRepository.find({
      relations: ['climateAction', 'barriers'],
      select: ['id'],
      join: {
        alias: 'policyBarriers',
        leftJoinAndSelect: {
          climateAction: 'policyBarriers.climateAction',
        },
      },
    });
  
    return policyBarriers.map((pb) => ({
      id: pb.id,
      policyName: pb.climateAction.policyName,
      barriers: pb.barriers,
      editedBy: pb.editedBy,
    }));
  }
  


/*   async dataCollectionInstitution(): Promise<Institution[]> {
    return await this.institutionRepository.find();

  } */

  async findAllIndicators(): Promise<Indicators[]> {
   // return this.indicatorRepository.find();

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
  
  findAllCategories(): Promise<Category[]> {
    return this.categotyRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.methodology', 'methodology')
      .where('category.methodology_id = methodology.id')
      .getMany();
  }

  findAllCharacteristics(): Promise<Characteristics[]> {
  //  return this.characteristicsRepository.find();
    return this.characteristicsRepository.createQueryBuilder('characteristics')
    .leftJoinAndSelect('characteristics.category', 'category')
    .where('characteristics.category_id = category.id')
    .getMany();
  }


  update(id: number, updateMethodologyAssessmentDto: UpdateMethodologyAssessmentDto) {
    return `This action updates a #${id} methodologyAssessment`;
  }

  remove(id: number) {
    return `This action removes a #${id} methodologyAssessment`;
  }


  async updateEnterDataValue(
    /// Unit Conversion Applied
    updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    let dataEnterItem = await this.repo.findOne({
      where: { id: updateValueDto.id },
    });
    console.log('dataEnterItem+++',dataEnterItem)
    if (dataEnterItem) {
      dataEnterItem.score = updateValueDto.value;
      if(updateValueDto.assumptionParameter != null)
      {
        dataEnterItem.enterDataAssumption = updateValueDto.assumptionParameter;
      }
      // dataEnterItem.uomDataEntry = updateValueDto.unitType;
      // if (dataEnterItem.uomDataEntry != dataEnterItem.uomDataRequest) {
      //   let ratioItem = await this.unitConversionRepository.findOne({
      //     where: {
      //       fromUnit: updateValueDto.unitType,
      //       toUnit: dataEnterItem.uomDataRequest,
      //     },
      //   });
      //   if (ratioItem) {
      //     dataEnterItem.conversionValue = (
      //       Number(updateValueDto.value) * ratioItem.conversionFactor
      //     ).toString();
      //   }
      // } else {
      //   dataEnterItem.conversionValue = updateValueDto.value;
      // }
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
    // dataEnterItem.value = updateValueDto.value;  // not comming value
    dataEnterItem.institution = institutionItem;
    console.log('updateValueDto', updateValueDto);
    console.log('institutionItem', institutionItem);
    this.repo.save(dataEnterItem);

    // let template = 'Dear ' +
    // institutionItem.name + ' '  +
    // '<br/>Data request with following information has shared with you.'+
    // ' <br/> We are assign  Data entry' ;

    // this.emaiService.sendMail(
    //   institutionItem.email,
    //   'Assign  Data Entry',
    //   '',
    //   template,
    // );
    return true;
  }

  async allParam(
    options: IPaginationOptions,
    filterText: string[]){
      let filter: string = '';
  }
}
