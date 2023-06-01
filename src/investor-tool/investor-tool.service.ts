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
import { InvestorQuestions } from './entities/investor-questions.entity';
import { IndicatorDetails } from './entities/indicator-details.entity';

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
    @InjectRepository(InvestorQuestions) private readonly investorQuestionRepo: Repository<InvestorQuestions>,
    @InjectRepository(IndicatorDetails) private readonly indicatorDetailsRepo: Repository<IndicatorDetails>,


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
          // assess.indicator_details=[]
          let a = await this.investorAssessmentRepo.save(assess)
          console.log("saved")
  
        }
  
      }
      let data = new Results ()
      data.assessment = request[0].data[0].assessment;
      await this.resultRepository.save(data);
      return 0
  
    }

    async findAllIndicatorquestions(): Promise<InvestorQuestions[]> {
      return this.investorQuestionRepo.find()
    }

}
