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

@Injectable()
export class MethodologyAssessmentService extends TypeOrmCrudService <MethodologyAssessmentParameters>{

   constructor(@InjectRepository(MethodologyAssessmentParameters) repo, @InjectRepository(Category) private readonly categotyRepository: Repository<Category>,
   @InjectRepository(Methodology) private readonly methodologyRepository: Repository<Methodology>,
   @InjectRepository(Characteristics) private readonly characteristicsRepository: Repository<Characteristics>,
   @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
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

   let assessRes =  this.assessmentRepository.save(assessement);
   let assessementId = (await assessRes).id

    console.log("assessRes : ",(await assessRes).id)
  
    for (let categoryData of MethData.categoryData) {
      let category = new Category();
      category.id = categoryData.categoryId;
      category.name = categoryData.category;
     // category.categoryScore = categoryData.categoryScore;
     // console.log("Category: ", category);
  
      for (let characteristic of categoryData.characteristics) {
        let characteristics = new Characteristics();
        characteristics.name = characteristic.name;
        characteristics.id = characteristic.id;
     //   console.log("Characteristics: ", characteristics);
  
  
        let savedAssessment = new Assessment();

        savedAssessment.id = assessementId
        let data = new MethodologyAssessmentParameters();
        data.methodology = methodology;
        data.category = category;
        data.category_score = categoryData.categoryScore;
        data.characteristics = characteristics;
        data.characteristics_score = characteristic.score;
        data.relevance = characteristic.relevance;
        data.assessment = savedAssessment
      //  console.log("Data: ", data);
  
       await this.repo.save(data);
      }
    }
  
    return MethData;
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
}
