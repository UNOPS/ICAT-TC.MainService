import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PortfolioAssessment } from './entities/portfolioAssessment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';

@Injectable()
export class PortfolioService extends TypeOrmCrudService<Portfolio> {

  constructor(
    @InjectRepository(Portfolio) repo,
    @InjectRepository(PortfolioAssessment) private readonly portfolioAssessRepo: Repository<PortfolioAssessment>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,

  ) {
    super(repo)
  }

  async create(createPortfolioDto: any) {
    let res = this.repo.save(createPortfolioDto.formData);
    const portfolioId = (await res).id;

     let portfolio = new Portfolio();
     portfolio.id = portfolioId 

    for (let x of createPortfolioDto.tableData) {

      let assessement = new Assessment();
      assessement.id = x

      const portfolioAssessment = new PortfolioAssessment()
      portfolioAssessment.portfolio = portfolio;
      portfolioAssessment.assessment = assessement;

      await this.portfolioAssessRepo.save(portfolioAssessment);
    }


    return portfolioId;
  }


  

  async getAll(): Promise<Portfolio[]> {
    return await this.repo.find();
  }

 /*  async assessmentsByPortfolioId(portfolioId: number): Promise<any[]> {
    return this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: {  portfolio: { id: portfolioId } },
    });
  } */

  async assessmentsByPortfolioId(portfolioId: number): Promise<any[]> {
    return this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: { portfolio: { id: portfolioId } },
    });
  }


  async getPortfolioById(portfolioId: number): Promise<any[]> {
    return this.repo.find({
      where: {  id: portfolioId  },
    });
  }


  async assessmentsDataByAssessmentId(portfolioId: number): Promise<any[]> {

    let GHGvalue = 0;

    let response =  this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: { portfolio: { id: portfolioId } },
    });

    let result  = new Array();

    for(let data of await response){
      let assessmentId = data.assessment.id

      let res = await this.investorAssessRepo.find({
        relations: ['assessment', 'category', 'characteristics'],
        where: { assessment: { id: assessmentId } },
      });

      for(let x of res){
        if(x.characteristics.id == 16){
          GHGvalue = x.expected_ghg_mitigation;
        }
      }
    
      const categoriesMap = new Map<number, any>();
    
      res.forEach((item) => {
        const categoryId = item.category.id;
    
        if (!categoriesMap.has(categoryId)) {
          // Add the item to the categories map
          categoriesMap.set(categoryId, {
            ...item.category,
            characteristics: [
              {
                ...item.characteristics,
                likelihood: item.likelihood,
                relevance: item.relavance,
                score : item.score,
              },
            ],
            totalCharacteristics: 1,
            totalLikelihood: item.likelihood,
            totalRelevance: item.relavance,
            totalScore : item.score,
          });
        } else {
          // Push the characteristics to the existing category
          const existingCategory = categoriesMap.get(categoryId);
          existingCategory.characteristics.push({
            ...item.characteristics,
            likelihood: item.likelihood,
            relevance: item.relavance,
            score : item.score,
          });
          existingCategory.totalCharacteristics += 1;
          existingCategory.totalLikelihood += item.likelihood;
          existingCategory.totalRelevance += item.relavance;
          existingCategory.totalScore += item.score;
        }
      });
    
      // Calculate the averages for each category
      categoriesMap.forEach((category) => {
        category.likelihoodAverage = (category.totalLikelihood / category.totalCharacteristics).toFixed(3);
        category.relevanceAverage = (category.totalRelevance / category.totalCharacteristics).toFixed(3);
        category.scoreAverage = (category.totalScore / category.totalCharacteristics).toFixed(3);
      });
    
      // Convert the map values back to an array
      const updatedRes = Array.from(categoriesMap.values());


      result.push({result : updatedRes, assessment : data.assessment , ghgValue : GHGvalue })
    }
    
  
    return result;
  }
  
  

 /*  async getLastID(): Promise<string | undefined> {
    const lastPortfolio = await this.repo.findOne({
        order: { id: 'DESC' },
        select: ['portfolioId']
    });
    return lastPortfolio?.portfolioId;
} */
  

async getLastID(): Promise<Portfolio[]> {
  return await this.repo.find({ order: { id: 'DESC' }, take: 1 });
}


}
