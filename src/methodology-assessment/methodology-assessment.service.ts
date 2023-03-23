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

@Injectable()
export class MethodologyAssessmentService extends TypeOrmCrudService <MethodologyAssessmentParameters>{

   constructor(@InjectRepository(MethodologyAssessmentParameters) repo, @InjectRepository(Category) private readonly categotyRepository: Repository<Category>,
   @InjectRepository(Methodology) private readonly methodologyRepository: Repository<Methodology>,
   @InjectRepository(Characteristics) private readonly characteristicsRepository: Repository<Characteristics>,
   @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
   @InjectRepository(Barriers) private readonly barriersRepository: Repository<Barriers>,
   @InjectRepository(AssessmentBarriers) private readonly assessRepository: Repository<AssessmentBarriers>,
   @InjectRepository(BarriersCategory) private readonly baricatRepository: Repository<BarriersCategory>,
   @InjectRepository(Indicators) private readonly indicatorRepository: Repository<Indicators>,
   @InjectRepository(AssessmentCharacteristics) private readonly assessmentCharcteristicsRepository: Repository<AssessmentCharacteristics>,
   @InjectRepository(MethodologyIndicators) private readonly methIndicatorRepository: Repository<MethodologyIndicators>,
/*    @InjectRepository(Institution) private readonly institutionRepository: Repository<Institution>, */
    @InjectRepository(PolicyBarriers) private readonly policyBarrierRepository: Repository<PolicyBarriers>,
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

  /*   for(let y of MethData.barriers){
      let assessmentBarriers = new AssessmentBarriers()
      let barrier = new Barriers();
      barrier.id = y.id,
      barrier.barrier = y.barrier

      assessmentBarriers.barriers = barrier
      assessmentBarriers.assessment = assessement

      await this.assessRepository.save(assessmentBarriers);
    } */
  
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
        data.isCategory = 0
      //  console.log("Data: ", data);
  
       await this.repo.save(data);
      }
      await this.repo.save(dataForCategory);

    }
    //assessementId
    console.log("iddd", assessementId)
    return assessementId;
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

  async findByAllCategories(): Promise<BarriersCategory[]> {
    return await this.baricatRepository.find();

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
    // console.log('dataEnterItem+++',dataEnterItem)
    if (dataEnterItem) {
      dataEnterItem.score = updateValueDto.value;
      if(updateValueDto.assumptionParameter != null)
      {
        dataEnterItem.enterDataAssumption = updateValueDto.assumptionParameter;

      }
      dataEnterItem.uomDataEntry = updateValueDto.unitType;
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
}
