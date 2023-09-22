import { Injectable } from '@nestjs/common';
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
import { ComparisonDto, ComparisonTableDataDto } from './dto/comparison.dto';
import { CMAssessmentQuestionService } from 'src/carbon-market/service/cm-assessment-question.service';
import { MasterDataService } from 'src/shared/entities/master-data.service';

@Injectable()
export class PortfolioService extends TypeOrmCrudService<Portfolio> {

  col_set_2 = [
    { label: 'ID', code: 'id' },
    { label: 'Intervention Name', code: 'name' },
    { label: 'Intervention Type', code: 'type' },
    { label: 'Status', code: 'status' }
  ]

  constructor(
    @InjectRepository(Portfolio) repo,
    @InjectRepository(PortfolioAssessment) private readonly portfolioAssessRepo: Repository<PortfolioAssessment>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,
    @InjectRepository(SdgAssessment) private readonly sdgAssessRepo: Repository<SdgAssessment>,

    private userService: UsersService,
    private cMAssessmentQuestionService: CMAssessmentQuestionService,
    private masterDataService: MasterDataService

  ) {
    super(repo)
  }

  async create(createPortfolioDto: any) {
    let user = this.userService.currentUser();
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

  async assessmentsByPortfolioId(portfolioId: number): Promise<any[]> {
    return this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: { portfolio: { id: portfolioId } },
    });
  }

  async getPortfolioById(portfolioId: number): Promise<any[]> {
    return this.repo.find({
      where: { id: portfolioId },
    });
  }

  async assessmentsDataByAssessmentId(portfolioId: number): Promise<any[]> {
    let GHGvalue = 0;
    let response = this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: { portfolio: { id: portfolioId } },
    });

    let result = new Array();
    let assessementIdArray: number[] = [];
    for (let data of await response) {
      let assessmentId = data.assessment.id
      assessementIdArray.push(assessmentId)
      let res = await this.investorAssessRepo.find({
        relations: ['assessment', 'category', 'characteristics'],
        where: { assessment: { id: assessmentId } },
      });
      for (let x of res) {
        if (x.characteristics.id == 16) {
          GHGvalue = x.expected_ghg_mitigation;
        }
      }

      const categoriesMap = new Map<number, any>();
      res.forEach((item) => {
        const categoryId = item.category.id;
        if (!categoriesMap.has(categoryId)) {
          categoriesMap.set(categoryId, {
            ...item.category,
            characteristics: [
              {
                ...item.characteristics,
                likelihood: item.likelihood,
                relevance: item.relavance,
                score: item.score,
              },
            ],
            totalCharacteristics: 1,
            totalLikelihood: item.likelihood,
            totalRelevance: item.relavance,
            totalScore: item.score,
          });
        } else {
          const existingCategory = categoriesMap.get(categoryId);
          existingCategory.characteristics.push({
            ...item.characteristics,
            likelihood: item.likelihood,
            relevance: item.relavance,
            score: item.score,
          });
          existingCategory.totalCharacteristics += 1;
          existingCategory.totalLikelihood += item.likelihood;
          existingCategory.totalRelevance += item.relavance;
          existingCategory.totalScore += item.score;
        }
      });

      categoriesMap.forEach((category) => {
        category.likelihoodAverage = (category.totalLikelihood / category.totalCharacteristics)?.toFixed(0);
        category.relevanceAverage = (category.totalRelevance / category.totalCharacteristics)?.toFixed(0);
        category.scoreAverage = (category.totalScore / category.totalCharacteristics)?.toFixed(0);
      });
      const updatedRes = Array.from(categoriesMap.values());

      result.push({ result: updatedRes, assessment: data.assessment, ghgValue: GHGvalue })
    }

    return result;
  }

  async sdgSumCalculate(portfolioId: number): Promise<any[]> {
    let response = this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: { portfolio: { id: portfolioId } },
    });
    let assessementIdArray: number[] = [];
    for (let data of await response) {
      let assessmentId = data.assessment.id
      assessementIdArray.push(assessmentId)
    }

    const sectorSum = await this.sdgAssessRepo
      .createQueryBuilder('sdgasess')
      .leftJoinAndSelect('sdgasess.assessment', 'assessment')
      .where('assessment.id IN (:...ids)', { ids: assessementIdArray })
      .leftJoinAndSelect('sdgasess.sdg', 'sdg')
      .select('sdg.name', 'sdg')
      .addSelect('COUNT(sdgasess.id)', 'count')
      .groupBy('sdg.name')
      .having('sdg IS NOT NULL')
      .getRawMany();
    return sectorSum;
  }

  async getLastID(): Promise<Portfolio[]> {
    return await this.repo.find({ order: { id: 'DESC' }, take: 1 });
  }

  async getPortfolioComparisonData(portfolioId: number) {
    let response = new ComparisonTableDataDto()

    let pAssessments = await this.assessmentsByPortfolioId(portfolioId)

    response.process_data = await this.getProcessData(pAssessments)
    response.outcome_data = await this.getOutcomeData(pAssessments)
    response.aggregation_data = await this.getAggragationData(pAssessments)
    response.alignment_data = await this.getAlignmentData(pAssessments)

    return response
  }

  async getProcessData(pAssessments: PortfolioAssessment[]){
    let response: ComparisonDto[] = []
    let intervention_data = []
    let int_categories = []
    let col_set_1 = [{ label: 'INTERVENTION INFORMATION', colspan: 4 }]
    
    for await (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let categories
      let res
      switch(pAssessment.assessment.tool){
        case 'Investment & Private Sector Tool' || 'Portfolio Tool':
          res = await this.getProcessDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          res = await this.getProcessDataCarbonMarket(pAssessment.assessment)
          break;
      }
      categories = res.categories
      int_categories.push(...res.cat_names)
      intervention_data.push({categories: categories, intervention: _intervention})
    }

    int_categories = [... new Set(int_categories)]

    for (let [idx, cat] of int_categories.entries()){
      let comparisonData = new ComparisonDto()
      comparisonData.col_set_1.push(...col_set_1)
      comparisonData.col_set_2.push(...this.col_set_2)
      for (let [index, int_data] of intervention_data.entries()){
        let data = int_data.categories.find(o => o.col_set_1.label === cat)
        if (comparisonData.col_set_1.length === 1) comparisonData.col_set_1.push(data.col_set_1)
        if (index === 0) {
          comparisonData.col_set_2.push(...data.characteristics)
          comparisonData.characteristic_count = data.characteristic_count
        }
        comparisonData.interventions.push({ ...int_data.intervention, ...data.ch_data })
      }
      comparisonData.order = idx + 1
      response.push(comparisonData)
    }
    response.sort((a,b) => a.order - b.order)
    return response;
  }

  async getOutcomeData(pAssessments: PortfolioAssessment[]){
    let response: ComparisonDto[] = []
    let intervention_data = []
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let data
      switch(pAssessment.assessment.tool){
        case 'Investment & Private Sector Tool' || 'Portfolio Tool':
          data = await this.getOutcomeDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          data = await this.getOutcomeDataCarbonMarket(pAssessment.assessment)
          break;
      }

      intervention_data.push({data: data, intervention: _intervention})
    }

    console.log("intervention data", intervention_data)

    return response
  }

  async getAggragationData(pAssessments: PortfolioAssessment[]){
    let response: ComparisonDto 
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let data
      switch(pAssessment.assessment.tool){
        case 'Investment & Private Sector Tool' || 'Portfolio Tool':
          data = this.getAggregationDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          data = this.getAggregationDataCarbonMarket(pAssessment.assessment)
          break;
      }
    }

    return response
  }

  async getAlignmentData(pAssessments: PortfolioAssessment[]){
    let response: ComparisonDto
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let data
      switch(pAssessment.assessment.tool){
        case 'Investment & Private Sector Tool' || 'Portfolio Tool':
          data = this.getAlignmentDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          data = this.getAlignmentDataCarbonMarket(pAssessment.assessment)
          break;
      }
    }

    return response
  }

  async getProcessDataPortfolioInvestor(assessement: Assessment){

  }

  async getOutcomeDataPortfolioInvestor(assessement: Assessment){

  }
  
  async getAggregationDataPortfolioInvestor(assessement: Assessment){

  }

  async getAlignmentDataPortfolioInvestor(assessement: Assessment){

  }

  async getProcessDataCarbonMarket(assessement: Assessment){
    let data = (await this.cMAssessmentQuestionService.getProcessData(assessement.id)).data
    let categories = []
    let cat_names = []
    for await  (let cat of data){
      let obj = {}
      let characteristics = []
      let ch_data = {}
      for await (let ch of cat.characteristic) {
        characteristics.push({label: ch.name, code: ch.code})
        ch_data[ch.code] = ch.ch_score
      }
      characteristics.push({label: 'Category score', code: 'category_score'})
      ch_data['category_score'] = cat.cat_score
      obj['characteristics'] = characteristics
      obj['ch_data'] = ch_data
      obj['characteristic_count'] = characteristics.length
      obj['col_set_1'] = {label: cat.name, colspan: characteristics.length + 1}
      cat_names.push(cat.name)
      categories.push(obj)
    }

    return {categories: categories, cat_names: cat_names}

  }


  async getOutcomeDataCarbonMarket(assessement: Assessment){
    let data = (await this.cMAssessmentQuestionService.getResults(assessement.id))?.outComeData
    let result = await this.cMAssessmentQuestionService.calculateResult(assessement.id)

    let scale_GHGs = {
      col_set_1: {label: 'GHG', colspan: 4},
      data: {
        international: data.scale_GHGs.find(o => o.ch_code === 'MACRO_LEVEL').outcome_score,
        national: data.scale_GHGs.find(o => o.ch_code === 'MACRO_LEVEL').outcome_score,
        subnational: data.scale_GHGs.find(o => o.ch_code === 'MACRO_LEVEL').outcome_score,
        category_score: result.outcome_score.scale_ghg_score
      }
    }

    let sdg = this.cMAssessmentQuestionService.group(data.scale_SDs, 'SDG')

    let scale_SDs = {}
    let sdg_count = Object.keys(sdg).length
    for (let sd of Object.keys(sdg)){
      let international = data.scale_SDs.find(o => o.ch_code === 'MACRO_LEVEL' && o.SDG === sd).outcome_score
      let national =  data.scale_SDs.find(o => o.ch_code === 'MACRO_LEVEL' && o.SDG === sd).outcome_score
      let subnational = data.scale_SDs.find(o => o.ch_code === 'MACRO_LEVEL' && o.SDG === sd).outcome_score
      scale_SDs[sd] = {
        col_set_1: { label: this.getSDGName(sd), colspan: 4 },
        data: {
          international: international,
          national: national,
          subnational: subnational,
          category_score: (international + national + subnational) / sdg_count / 3 
        }
      }
    }

    let scale_adaptation = {
      col_set_1: {label: 'ADAPTATION', colspan: 4},
      data: {
        international: data.scale_adaptation.find(o => o.ch_code === 'INTERNATIONAL').outcome_score,
        national: data.scale_adaptation.find(o => o.ch_code === 'NATIONAL').outcome_score,
        subnational: data.scale_adaptation.find(o => o.ch_code === 'SUBNATIONAL').outcome_score,
        category_score: result.outcome_score.scale_adaptation_score
      }
    }

    let sustained_GHGs = {
      col_set_1: {label: 'GHG', colspan: 4},
      data: {
        international: data.sustained_GHGs.find(o => o.ch_code === 'LONG_TERM').outcome_score,
        national: data.sustained_GHGs.find(o => o.ch_code === 'MEDIUM_TERM').outcome_score,
        subnational: data.sustained_GHGs.find(o => o.ch_code === 'SHORT_TERM').outcome_score,
        category_score: result.outcome_score.sustained_ghg_score
      }
    }

    let sustained_SDs = {}
    for (let sd of Object.keys(sdg)){
      let international = data.sustained_SDs.find(o => o.ch_code === 'LONG_TERM' && o.SDG === sd).outcome_score
      let national =  data.sustained_SDs.find(o => o.ch_code === 'MEDIUM_TERM' && o.SDG === sd).outcome_score
      let subnational = data.sustained_SDs.find(o => o.ch_code === 'SHORT_TERM' && o.SDG === sd).outcome_score
      sustained_SDs[sd] = {
        col_set_1: { label: this.getSDGName(sd), colspan: 4 },
        data: {
          international: international,
          national: national,
          subnational: subnational,
          category_score: (international + national + subnational) / sdg_count / 3 
        }
      }
    }

    let sustained_adaptation = {
      col_set_1: {label: 'ADAPTATION', colspan: 4},
      data: {
        international: data.sustained_adaptation.find(o => o.ch_code === 'INTERNATIONAL').outcome_score,
        national: data.sustained_adaptation.find(o => o.ch_code === 'NATIONAL').outcome_score,
        subnational: data.sustained_adaptation.find(o => o.ch_code === 'SUBNATIONAL').outcome_score,
        category_score: result.outcome_score.sustained_adaptation_score
      }
    }

    return {
      scale_comparisons: {
        ghg: scale_GHGs, sdg: scale_SDs, adaptation: scale_adaptation
      },
      sustained_comparisons: {
        ghg: sustained_GHGs, sdg: sustained_SDs, adaptation: sustained_adaptation
      },
      sdg: Object.keys(sdg)
    }

  }


  async getAggregationDataCarbonMarket(assessement: Assessment){
    
  }


  async getAlignmentDataCarbonMarket(assessement: Assessment){
    
  }

  getSDGName(code){
    let sdg = this.masterDataService.SDGs.find(o => o.code === code)
    return sdg.name
  }


}
