import { Injectable } from '@nestjs/common';
import { CreateInvestorToolDto } from './dto/create-investor-tool.dto';
import { UpdateInvestorToolDto } from './dto/update-investor-tool.dto';
import { ImpactCovered } from './entities/impact-covered.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestorTool } from './entities/investor-tool.entity';
import { Repository } from 'typeorm';
import { InvestorSector } from './entities/investor-sector.entity';
import { InvestorImpacts } from './entities/investor-impact.entity';
import { error } from 'console';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InvestorAssessment } from './entities/investor-assessment.entity';
import { FinalInvestorAssessmentDto } from './dto/final-investor-assessment.dto';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';

@Injectable()
export class InvestorToolService extends TypeOrmCrudService<InvestorTool>{


  constructor(
    @InjectRepository(InvestorTool) repo,
    @InjectRepository(ImpactCovered) private readonly impactCoveredRepo: Repository<ImpactCovered>,
    @InjectRepository(InvestorSector) private readonly investorSectorRepo: Repository<InvestorSector>,
    @InjectRepository(InvestorImpacts) private readonly investorImpactRepo: Repository<InvestorImpacts>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessmentRepo: Repository<InvestorAssessment>,
    @InjectRepository(Results) private readonly resultRepository: Repository<Results>,


  ) {
    super(repo)
  }


  async createinvestorToolAssessment(createInvestorToolDto: CreateInvestorToolDto): Promise<any> {

    if (createInvestorToolDto.investortool) {
      let assessment = createInvestorToolDto.investortool.assessment;
      console.log("investor......", createInvestorToolDto.investortool.level_of_implemetation)
      let investor = new InvestorTool();
      investor.assessment = assessment;
      investor.geographical_areas_covered = createInvestorToolDto.investortool.geographical_areas_covered;
      investor.level_of_implemetation = createInvestorToolDto.investortool.level_of_implemetation;
      investor.national_country = createInvestorToolDto.investortool?.national_country;
      investor.subnational_region = createInvestorToolDto.investortool?.subnational_region;
      let result = await this.repo.save(investor)
      console.log("result", result)
      if (createInvestorToolDto)
        for await (let sector of createInvestorToolDto.sectors) {
          let investorSector = new InvestorSector();
          investorSector.investorTool = result;
          investorSector.assessment = assessment;
          investorSector.sector = sector
          let a = await this.investorSectorRepo.save(investorSector)
        }
      for await (let impacts of createInvestorToolDto.impacts) {
        let investorImpacts = new InvestorImpacts();
        investorImpacts.investorTool = result;
        investorImpacts.assessment = assessment;
        investorImpacts.name=impacts.name;
        let a = await this.investorImpactRepo.save(investorImpacts)
      }
      console.log("created investor tool,", createInvestorToolDto)
      return result;
    }
    else {
      throw new error('No data')
    }

  }
  async findAllImpactCovered(): Promise<ImpactCovered[]> {
    return this.impactCoveredRepo.find()
  }

  async getResultByAssessment(assessmentId: number){
    return await this.repo.findOne({
      where: {assessment: {id: assessmentId}},
      relations: ['assessment']
    })
   }

   async findAllSectorData(assessmentId: number){
    return this.investorSectorRepo.find({
      relations: ['assessment','sector'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async findAllImpactCoverData(assessmentId: number){
    return this.investorImpactRepo.find({
      relations: ['assessment'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async findAllAssessData(assessmentId: number){
    return this.investorAssessRepo.find({
      relations: ['assessment','characteristics','category'],
      where: { assessment: { id: assessmentId } },
    });
  }
   
   
    async createFinalAssessment(request: FinalInvestorAssessmentDto[]):Promise<any> {
      console.log("request",request)
    
      for (let req of request) {
        for (let assess of req.data) {
  
          assess.category.id = req.categoryID;
          assess.type = req.type;
          let a = await this.investorAssessmentRepo.save(assess)
          console.log("saved")
  
        }
  
      }
      let data = new Results ()
      data.assessment = request[0].data[0].assessment;
      await this.resultRepository.save(data);
      return 0
  
    }

    async createFinalAssessmentIndirect(request: any):Promise<any> {
      console.log("request",request)
    
      for (let req of request) {
        for (let assess of req.data) {
  
          let category = new Category()
          category.id = req.categoryID
          if(req.type === 'process'){

          //  assess.category.id = req.categoryID;
          //  assess.type = req.type;
  
            if(assess.indicatorExpectedVal){
              let obj1 = new InvestorAssessment()
              obj1.category= category
              obj1.type = req.type
              obj1.characteristics = assess.characteristics
              obj1.relevance_weight = assess.relevance_weight
              obj1.description = assess.description
              obj1.starting_situation = assess.starting_situation
              obj1.likelihood_weight = assess.likelihood_weight
              obj1.institution = assess.indicatorExpectedVal
              obj1.institutionDescription = 'indicatorExpectedVal'
              obj1.likelihood_justification = assess.likelihood_justification
              obj1.justification = assess.justification
              obj1.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj1)
              console.log("saved1")
            }
            if(assess.indicatorStartingVal){
              let obj2 = new InvestorAssessment()
              obj2.category = category
              obj2.type = req.type
              obj2.characteristics = assess.characteristics
              obj2.relevance_weight = assess.relevance_weight
              obj2.description = assess.description
              obj2.starting_situation = assess.starting_situation
              obj2.likelihood_weight = assess.likelihood_weight
              obj2.institution = assess.indicatorStartingVal
              obj2.institutionDescription = 'indicatorStartingVal'
              obj2.likelihood_justification = assess.likelihood_justification
              obj2.justification = assess.justification
              obj2.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj2)
              console.log("saved2")
            }
            if(assess.likelihood){
              let obj3 = new InvestorAssessment()
              obj3.category = category
              obj3.type = req.type
              obj3.characteristics = assess.characteristics
              obj3.relevance_weight = assess.relevance_weight
              obj3.description = assess.description
              obj3.starting_situation = assess.starting_situation
              obj3.likelihood_weight = assess.likelihood_weight
              obj3.institution = assess.likelihood
              obj3.institutionDescription = 'likelihood'
              obj3.likelihood_justification = assess.likelihood_justification
              obj3.justification = assess.justification
              obj3.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj3)
              console.log("saved3")
            }
            if(assess.relavance){
              let obj4 = new InvestorAssessment()
              obj4.category = category
              obj4.type = req.type
              obj4.characteristics = assess.characteristics
              obj4.relevance_weight = assess.relevance_weight
              obj4.description = assess.description
              obj4.starting_situation = assess.starting_situation
              obj4.likelihood_weight = assess.likelihood_weight
              obj4.institution = assess.relavance
              obj4.institutionDescription = 'relavance'
              obj4.likelihood_justification = assess.likelihood_justification
              obj4.justification = assess.justification
              obj4.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj4)
              console.log("saved4")
            }
          }
          else if(req.type === 'outcome'){
          
            if(assess.indicatorExpectedVal){
              let obj1 = new InvestorAssessment()
              obj1.category = category
              obj1.type = req.type
              obj1.characteristics = assess.characteristics
              obj1.institution = assess.indicatorExpectedVal
              obj1.institutionDescription = 'indicatorExpectedVal'
              obj1.justification = assess.justification
              obj1.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj1)
              console.log("saved5")
            }
            if(assess.indicatorStartingVal){
              let obj2 = new InvestorAssessment()
              obj2.category = category
              obj2.type = req.type
              obj2.characteristics = assess.characteristics
              obj2.institution = assess.indicatorStartingVal
              obj2.institutionDescription = 'indicatorStartingVal'
              obj2.justification = assess.justification
              obj2.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj2)
              console.log("saved6")
            }

            if(assess.score){
              let obj3 = new InvestorAssessment()
              obj3.category = category
              obj3.type = req.type
              obj3.characteristics = assess.characteristics
              obj3.institution = assess.score
              obj3.institutionDescription = 'score'
              obj3.justification = assess.justification
              obj3.indicator = assess.indicator
              let a = await this.investorAssessmentRepo.save(obj3)
              console.log("saved7")
            }
          }
         
  
        }
  
      }
      let data = new Results ()
      data.assessment = request[0].data[0].assessment;
      await this.resultRepository.save(data);
      return 0
  
    }

}
