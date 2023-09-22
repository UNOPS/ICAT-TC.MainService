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
import { SdgAssessment } from 'src/investor-tool/entities/sdg-assessment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class PortfolioService extends TypeOrmCrudService<Portfolio> {

  constructor(
    @InjectRepository(Portfolio) repo,
    @InjectRepository(PortfolioAssessment) private readonly portfolioAssessRepo: Repository<PortfolioAssessment>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,
    @InjectRepository(SdgAssessment) private readonly sdgAssessRepo: Repository<SdgAssessment>,

    private userService: UsersService,

  ) {
    super(repo)
  }

  async create(createPortfolioDto: any) {

    let user = this.userService.currentUser();
   // console.log("ussssser : ",(await user).fullname, "and ", (await user).username, "Id :", (await user).id)

    let currentUser = new User();
    currentUser.id = (await user).id

    createPortfolioDto.formData.user = currentUser
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
     let res = await this.repo.find();

    let user = this.userService.currentUser();
   // console.log("ussssser : ", (await user).username, "Id :", (await user).id , "user Type", (await user)?.userType?.name, "country ID :", (await user)?.country?.id)

      let portfolios: Portfolio[] = [];

    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';

    for (const x of await res) {
      const isSameUser = x.user?.id === currentUser?.id;
      const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.user?.userType?.name !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        portfolios.push(x);
      }
    }

    return portfolios
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
    let assessementIdArray :number[]=[];
    for(let data of await response){
      let assessmentId = data.assessment.id
      assessementIdArray.push(assessmentId)
      let res = await this.investorAssessRepo.find({
        relations: ['assessment', 'category', 'characteristics'],
        where: { assessment: { id: assessmentId } },
      });

      for(let x of res){
        if(x.characteristics.id == 16){
          GHGvalue = x.expected_ghg_mitigation;
        }
      }
    
      // const categoriesMap = new Map<number, any>();
    
      // res.forEach((item) => {
      //   const categoryId = item.category.id;
    
      //   if (!categoriesMap.has(categoryId)) {
      //     // Add the item to the categories map
      //     categoriesMap.set(categoryId, {
      //       ...item.category,
      //       characteristics: [
      //         {
      //           ...item.characteristics,
      //           likelihood: item.likelihood,
      //           relevance: item.relavance,
      //           score : item.score,
      //         },
      //       ],
      //       totalCharacteristics: 1,
      //       totalLikelihood: item.likelihood,
      //       totalRelevance: item.relavance,
      //       totalScore : item.score,
      //     });
      //   } else {
      //     // Push the characteristics to the existing category
      //     const existingCategory = categoriesMap.get(categoryId);
      //     existingCategory.characteristics.push({
      //       ...item.characteristics,
      //       likelihood: item.likelihood,
      //       relevance: item.relavance,
      //       score : item.score,
      //     });
      //     existingCategory.totalCharacteristics += 1;
      //     existingCategory.totalLikelihood += item.likelihood;
      //     existingCategory.totalRelevance += item.relavance;
      //     existingCategory.totalScore += item.score;
      //   }
      // });
    
      // // Calculate the averages for each category
      // categoriesMap.forEach((category) => {
      //   category.likelihoodAverage = (category.totalLikelihood / category.totalCharacteristics)?.toFixed(0);
      //   category.relevanceAverage = (category.totalRelevance / category.totalCharacteristics)?.toFixed(0);
      //   category.scoreAverage = (category.totalScore / category.totalCharacteristics)?.toFixed(0);
      // });
    
      // // Convert the map values back to an array
      // const updatedRes = Array.from(categoriesMap.values());


      result.push({ assessment : data.assessment , ghgValue : GHGvalue })
    }
    
  
    return result;
  }
  async sdgSumCalculate(portfolioId: number):Promise<any[]>{


    const data =this.sdgAssessRepo
    .createQueryBuilder('sdgasess')
    .leftJoinAndSelect('sdgasess.assessment', 'assessment')

    if(!portfolioId){
      let response =  this.portfolioAssessRepo.find({
        relations: ['assessment'],
        where: { portfolio: { id: portfolioId } },
      });
      let assessementIdArray :number[]=[];
      for(let data of await response){
        let assessmentId = data.assessment.id
        assessementIdArray.push(assessmentId)
      }
      console.log("knownIds",assessementIdArray)
      data.where('assessment.id IN (:...ids)', { ids: assessementIdArray })

    }
  
     data.leftJoinAndSelect('sdgasess.sdg', 'sdg')
     .select('sdg.name', 'sdg')
     .addSelect('COUNT(sdgasess.id)', 'count')
     .groupBy('sdg.name')
     .having('sdg IS NOT NULL')

    // const sectorSum = await this.sdgAssessRepo
    //     .createQueryBuilder('sdgasess')
    //     .leftJoinAndSelect('sdgasess.assessment', 'assessment')
    //     .where('assessment.id IN (:...ids)', { ids: assessementIdArray })
    //     .leftJoinAndSelect('sdgasess.sdg', 'sdg')
    //     // .where('sector.name IS NOT NULL')
    //     .select('sdg.name', 'sdg')
    //     .addSelect('COUNT(sdgasess.id)', 'count')
    //     .groupBy('sdg.name')
    //     .having('sdg IS NOT NULL')
    //     .getRawMany();
        // console.log("sectorSum",await data.getRawMany())


        return await data.getRawMany();
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
