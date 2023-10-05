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
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Country } from 'src/country/entity/country.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ComparisonDto, ComparisonTableDataDto } from './dto/comparison.dto';
import { CMAssessmentQuestionService } from 'src/carbon-market/service/cm-assessment-question.service';
import { MasterDataService } from 'src/shared/entities/master-data.service';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';

@Injectable()
export class PortfolioService extends TypeOrmCrudService<Portfolio> {

  col_set_2 = [
    { label: 'ID', code: 'id' },
    { label: 'INTERVENTION NAME', code: 'name' },
    { label: 'INTERVENTION TYPE', code: 'type' },
    { label: 'STATUS', code: 'status' }
  ]

  constructor(
    @InjectRepository(Portfolio) repo,
    @InjectRepository(PortfolioAssessment) private readonly portfolioAssessRepo: Repository<PortfolioAssessment>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,
    @InjectRepository(SdgAssessment) private readonly sdgAssessRepo: Repository<SdgAssessment>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    @InjectRepository(SdgAssessment) private readonly sdgAssessmentRepo: Repository<SdgAssessment>,
    private userService: UsersService,
    private cMAssessmentQuestionService: CMAssessmentQuestionService,
    private masterDataService: MasterDataService,
    private investorToolService: InvestorToolService

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


    const data = this.sdgAssessRepo
      .createQueryBuilder('sdgasess')
      .leftJoinAndSelect('sdgasess.assessment', 'assessment')

    if (portfolioId&&Number(portfolioId)) {
      let response = this.portfolioAssessRepo.find({
        relations: ['assessment'],
        where: { portfolio: { id: portfolioId } },
      });
      let assessementIdArray: number[] = [];
      for (let data of await response) {
        let assessmentId = data.assessment.id
        assessementIdArray.push(assessmentId)
      }
      data.where('assessment.id IN (:...ids)', { ids: assessementIdArray })

    }else{
      let filter = 'assessment.tool="Portfolio Tool" '


      let user = this.userService.currentUser();
      const currentUser = await user;
      let userId = currentUser.id;
      let userCountryId = currentUser.country?.id;
      if (currentUser?.userType?.name === 'External') {
        filter = filter + ' and assessment.user_id=:userId '
  
      }
      else {
        filter = filter + ' and country.id=:userCountryId '
        data.leftJoinAndMapOne(
          'assessment.climateAction',
          ClimateAction,
          'climateAction',
          'assessment.climateAction_id = climateAction.id'
        )
        .leftJoinAndMapOne(
          'climateAction.country',
          Country,
          'country',
          'climateAction.countryId = country.id'
        )
      }


      data.where(filter,{userId,userCountryId})
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


  async getLastID(): Promise<Portfolio[]> {
    return await this.repo.find({ order: { id: 'DESC' }, take: 1 });
  }

  async getPortfolioComparisonData(portfolioId: number) {

 
    let response = new ComparisonTableDataDto()
    let sdgs: any[] = []

    let pAssessments = await this.assessmentsByPortfolioId(portfolioId)

    response.process_data = await this.getProcessData(pAssessments)
    let outcomeResponse = await this.getOutcomeData(pAssessments)
    response.outcome_data = outcomeResponse.outcomeData
    response.aggregation_data = await this.getAggragationData(pAssessments)
    sdgs = outcomeResponse.sdgs
    response.alignment_data = await this.getAlignmentData(pAssessments, sdgs)

    return response
  }

  async getProcessData(pAssessments: PortfolioAssessment[]) {
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
      switch (pAssessment.assessment.tool) {
        case 'Portfolio Tool':
        case 'Investment & Private Sector Tool':
          res = await this.getProcessDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          res = await this.getProcessDataCarbonMarket(pAssessment.assessment)
          break;
      }
      categories = res.categories
      int_categories.push(...res.cat_names)
      intervention_data.push({ categories: categories, intervention: _intervention, category_scores: res.category_scores })
    }

    int_categories = [... new Set(int_categories)]

    let likelihood_comparison = new ComparisonDto()

    likelihood_comparison.col_set_1.push(...col_set_1)
    likelihood_comparison.col_set_2.push(...this.col_set_2)
    let obj = {}
    for (let [idx, cat] of int_categories.entries()) {
      likelihood_comparison.col_set_1.push({label: cat.toUpperCase(), colspan: 1})
      likelihood_comparison.col_set_2.push({label: 'CATEGORY SCORE', code: cat})
      let comparisonData = new ComparisonDto()
      comparisonData.col_set_1.push(...col_set_1)
      comparisonData.col_set_2.push(...this.col_set_2)
      for (let [index, int_data] of intervention_data.entries()) {
        let data = int_data.categories.find(o => o.col_set_1.label === cat)
        data.col_set_1 = {...data.col_set_1, label: data.col_set_1.label.toUpperCase(),}
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
    likelihood_comparison.col_set_2.push({label: 'PROCESSES SCORE', code: 'category_score'})
    for (let int of intervention_data){
      likelihood_comparison.interventions.push({...int.intervention, ...int.category_scores})
    }
    likelihood_comparison.characteristic_count = int_categories.length
    likelihood_comparison.order = int_categories.length + 1
    response.push(likelihood_comparison)
    likelihood_comparison.col_set_1.push({label: '', colsapn: 1})
    response.sort((a, b) => a.order - b.order)
    return response;
  }

  async getOutcomeData(pAssessments: PortfolioAssessment[]) {
    let response: ComparisonDto[] = []
    let sdgs: any[] = []
    let intervention_data = []
    let col_set_1 = [{ label: 'INTERVENTION INFORMATION', colspan: 4 }]
    let col_set_2_scale = [
      { label: 'INTERNATIONAL', code: 'international' },
      { label: 'NATIONAL/SECTORIAL', code: 'national' },
      { label: 'SUBNATIONAL/SUBSECTORIAL', code: 'subnational' },
      { label: 'CATEGORY SCORE', code: 'category_score' }
    ]
    let col_set_2_sustained = [
      { label: 'LONG TERM', code: 'long_term' },
      { label: 'MEDIUM TERM', code: 'medium_term' },
      { label: 'SHORT TERM', code: 'short_term' },
      { label: 'CATEGORY SCORE', code: 'category_score' }
    ]

    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name,
        assessment_id: pAssessment.assessment.id
      }

      let data
      switch (pAssessment.assessment.tool) {
        case 'Portfolio Tool':
        case 'Investment & Private Sector Tool':
          data = await this.getOutcomeDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          data = await this.getOutcomeDataCarbonMarket(pAssessment.assessment)
          break;
      }
      sdgs.push(...data.sdg)
      sdgs = [... new Set(sdgs)]
      intervention_data.push({ data: data, intervention: _intervention })
    }

    let scaleGhgData = new ComparisonDto()
    let scalAdaptationData = new ComparisonDto()
    let scaleSdgData = {}
    let sustainedGhgData = new ComparisonDto()
    let sustainedSdgData = {}
    let sustainedAdaptationData = new ComparisonDto()

    scaleGhgData.comparison_type = 'SCALE COMPARISON',
      scaleGhgData.comparison_type_2 = 'OUTCOMES'
    scalAdaptationData.comparison_type = 'SCALE COMPARISON'
    scalAdaptationData.comparison_type_2 = 'OUTCOMES'
    sustainedGhgData.comparison_type = 'SUSTAINED IN TIME COMPARISON'
    sustainedGhgData.comparison_type_2 = 'OUTCOMES'
    sustainedAdaptationData.comparison_type = 'SUSTAINED IN TIME COMPARISON'
    sustainedAdaptationData.comparison_type_2 = 'OUTCOMES'
    let order = 0
    let sus_order = 0
    let outcome_score = {}

    for (let sd of sdgs) {
      scaleSdgData[sd] = new ComparisonDto()
      scaleSdgData[sd].comparison_type = 'SCALE COMPARISON'
      scaleSdgData[sd].comparison_type_2 = 'OUTCOMES'
      scaleSdgData[sd].col_set_2 = [...this.col_set_2, ...col_set_2_scale]
      sustainedSdgData[sd] = new ComparisonDto()
      sustainedSdgData[sd].comparison_type = 'SUSTAINED IN TIME COMPARISON'
      sustainedSdgData[sd].comparison_type_2 = 'OUTCOMES'
      sustainedSdgData[sd].col_set_2 = [...this.col_set_2, ...col_set_2_sustained]
    }

    for (let [index, int_data] of intervention_data.entries()) {
      if (index === 0) {
        scaleGhgData.col_set_1 = [...col_set_1, int_data.data.scale_comparisons.ghg.col_set_1]
        scaleGhgData.col_set_2 = [...this.col_set_2, ...col_set_2_scale]
        scalAdaptationData.col_set_1 = [...col_set_1, int_data.data.scale_comparisons.adaptation.col_set_1]
        scalAdaptationData.col_set_2 = [...this.col_set_2, ...col_set_2_scale]
        sustainedGhgData.col_set_1 = [...col_set_1, int_data.data.sustained_comparisons.ghg.col_set_1]
        sustainedGhgData.col_set_2 = [...this.col_set_2, ...col_set_2_sustained]
        sustainedAdaptationData.col_set_1 = [...col_set_1, int_data.data.sustained_comparisons.adaptation.col_set_1]
        sustainedAdaptationData.col_set_2 = [...this.col_set_2, ...col_set_2_sustained]
      }
      for (let sd of sdgs) {
        if (int_data.data.sdg.includes(sd)) {
          if (scaleSdgData[sd].col_set_1.length === 0) scaleSdgData[sd].col_set_1 = [...col_set_1, int_data.data.scale_comparisons.sdg[sd].col_set_1]
          if (sustainedSdgData[sd].col_set_1.length === 0) sustainedSdgData[sd].col_set_1 = [...col_set_1, int_data.data.sustained_comparisons.sdg[sd].col_set_1]
        }
      }

      outcome_score[int_data.intervention.assessment_id] = int_data.data.outcome_score

      scaleGhgData.interventions.push({ ...int_data.intervention, ...int_data.data.scale_comparisons.ghg.data })
      scaleGhgData.order = 1
      order = 1
      sus_order = 2 + sdgs.length
      for (let sd of sdgs) {
        if (int_data.data.sdg.includes(sd) && int_data.data.scale_comparisons.sdg[sd]) {
          order += 1
          sus_order += 1
          scaleSdgData[sd].interventions.push({ ...int_data.intervention, ...int_data.data.scale_comparisons.sdg[sd].data })
          scaleSdgData[sd].order = order
          sustainedSdgData[sd].interventions.push({ ...int_data.intervention, ...int_data.data.sustained_comparisons.sdg[sd].data })
          sustainedSdgData[sd].order = sus_order
        }
      }

      scalAdaptationData.interventions.push({ ...int_data.intervention, ...int_data.data.scale_comparisons.adaptation.data })
      order += 1
      scalAdaptationData.order = order

      sustainedGhgData.interventions.push({ ...int_data.intervention, ...int_data.data.sustained_comparisons.ghg.data })
      sus_order += 1
      sustainedGhgData.order = order++
      sustainedAdaptationData.interventions.push({ ...int_data.intervention, ...int_data.data.sustained_comparisons.adaptation.data })
      sustainedAdaptationData.order = sus_order
    }

    let scale_comparison = new ComparisonDto()
    scale_comparison.comparison_type = 'SCALE COMPARISON'
    scale_comparison.comparison_type_2 = 'OUTCOMES'
    scale_comparison.col_set_1 = [
      ...col_set_1,
      { label: 'GHG', colspan: 1 }
    ]
    scale_comparison.col_set_2 = [
      ...this.col_set_2,
      { label: 'CATEGORY SCORE', code: 'ghg_score' }
    ]

    let sc_cat_total = {}
    let sc_sus_total = {}
    let scale_cat_total = {}
    let scale_cat_count = {}
    let sustain_cat_total = {}
    let sustain_cat_count = {}
    let comparison_type_2 = 'GHG, '

    let sc_sus_col_2 = [
      { label: 'SCALE CATEGORY SCORE', code: 'scale_score' },
      { label: 'SUSTAINED CATEGORY SCORE', code: 'sustained_score' },
      { label: 'CATEGORY SCORE', code: 'category_score' }
    ]

    let sc_sus_ghg_comparison = new ComparisonDto()
    sc_sus_ghg_comparison.comparison_type = 'SCALE & SUSTAINED IN TIME COMPARISON'
    sc_sus_ghg_comparison.comparison_type_2 = 'GHG OUTCOMES'
    sc_sus_ghg_comparison.col_set_1 = [
      ...col_set_1,
      { label: '', colspan: 3 }
    ]
    sc_sus_ghg_comparison.col_set_2 = [...this.col_set_2, ...sc_sus_col_2]

    scaleGhgData.interventions.map(int => {
      scale_comparison.interventions.push({
        id: int.id, name: int.name, type: int.type, status: int.status, assessment_id: int.assessment_id, ghg_score: int.category_score
      })
      sc_sus_ghg_comparison.interventions.push({
        id: int.id, name: int.name, type: int.type, status: int.status, assessment_id: int.assessment_id, scale_score: int.category_score
      })

      scale_cat_total[int.assessment_id] = int.category_score.value
      scale_cat_count[int.assessment_id] = 1
      sc_cat_total[int.assessment_id] = int.category_score.value
      sc_sus_total[int.assessment_id] = int.category_score.value
    })

    let sustained_comparison = new ComparisonDto()
    sustained_comparison.comparison_type = 'SUSTAINED COMPARISON'
    sustained_comparison.comparison_type_2 = 'OUTCOMES'
    sustained_comparison.col_set_1 = [
      ...col_set_1,
      { label: 'GHG', colspan: 1 }
    ]
    sustained_comparison.col_set_2 = [
      ...this.col_set_2,
      { label: 'CATEGORY SCORE', code: 'ghg_score' }
    ]

    let ss_cat_total = {}

    sustainedGhgData.interventions.map(int => {
      sustained_comparison.interventions.push({
        id: int.id, name: int.name, type: int.type, status: int.status, assessment_id: int.assessment_id, ghg_score: int.category_score
      })
      let res = sc_sus_ghg_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      res['sustained_score'] = int.category_score
      sustain_cat_total[int.assessment_id] = int.category_score.value
      sustain_cat_count[int.assessment_id] = 1
      ss_cat_total[int.assessment_id] = int.category_score.value
      sc_sus_total[int.assessment_id] += int.category_score.value
    })

    let sc_sus_sdgs = {}

    for (let [index, sd] of sdgs.entries()) {
      scale_comparison.col_set_1.push({ label: scaleSdgData[sd].col_set_1[1].label, colspan: 1 })
      scale_comparison.col_set_2.push({ label: 'CATEGORY SCORE', code: sd + '_score' })

      sustained_comparison.col_set_1.push({ label: sustainedSdgData[sd].col_set_1[1].label, colspan: 1 })
      sustained_comparison.col_set_2.push({ label: 'CATEGORY SCORE', code: sd + '_score' })

      sc_sus_sdgs[sd] = new ComparisonDto()
      sc_sus_sdgs[sd].comparison_type = 'SCALE & SUSTAINED IN TIME COMPARISON'
      sc_sus_sdgs[sd].comparison_type_2 = 'SDG OUTCOMES - ' + (scaleSdgData[sd].col_set_1[1].label).split('-')[1]
      sc_sus_sdgs[sd].col_set_1 = [
        ...col_set_1,
        { label: '', colspan: 3 }
      ]
      sc_sus_sdgs[sd].col_set_2 = [...this.col_set_2, ...sc_sus_col_2]
      comparison_type_2 += 'SDG - ' + (scaleSdgData[sd].col_set_1[1].label).split('-')[1] + ' ,'

      let sc_sus_sd_total = {}

      scaleSdgData[sd].interventions.map(int => {
        let res = scale_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
        if (res) {
          res[sd + '_score'] = int.category_score
          sc_sus_sdgs[sd].interventions.push({
            id: int.id, name: int.name, type: int.type, status: int.status, assessment_id: int.assessment_id, scale_score: int.category_score
          })
          scale_cat_total[int.assessment_id] += int.category_score.value
          scale_cat_count[int.assessment_id]++
          sc_sus_sd_total[int.assessment_id] = int.category_score.value
          sc_cat_total[int.assessment_id] += int.category_score.value
        }
      })
      sustainedSdgData[sd].interventions.map(int => {
        let res = sustained_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
        if (res) {
          res[sd + '_score'] = int.category_score
        }
        let res2 = sc_sus_sdgs[sd].interventions.find(o => o.assessment_id === int.assessment_id)
        if (res2){
          res2['sustained_score'] = int.category_score
        }
        sc_sus_sd_total[int.assessment_id] += int.category_score.value
        sustain_cat_total[int.assessment_id] += int.category_score.value
        sustain_cat_count[int.assessment_id]++
        ss_cat_total[int.assessment_id] += int.category_score.value
      })

      sc_sus_sdgs[sd].interventions = sc_sus_sdgs[sd].interventions.map(int => {
        console.log("574", int)
        let score = Math.floor(sc_sus_sd_total[int.assessment_id] / 2)
        // console.log(sd, score)
        int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
        return int
      })

      sc_sus_sdgs[sd].order = sus_order + 4 + index
      response.push(scaleSdgData[sd], sustainedSdgData[sd], sc_sus_sdgs[sd])
    }

    scale_comparison.col_set_1.push({ label: 'ADAPTATION', colspan: 1 }, { label: 'SCALE CATEGORY SCORE', colspan: 1 })

    scale_comparison.col_set_2.push(...[
      { label: 'CATEGORY SCORE', code: 'adaptation_score' },
      { label: 'CATEGORY SCORE', code: 'category_score' },
    ])

    sustained_comparison.col_set_1.push({ label: 'ADAPTATION', colspan: 1 }, { label: 'SUSTAINED CATEGORY SCORE', colspan: 1 })
    sustained_comparison.col_set_2.push(...[
      { label: 'CATEGORY SCORE', code: 'adaptation_score' },
      { label: 'CATEGORY SCORE', code: 'category_score' },
    ])

    comparison_type_2 += 'ADAPTATION OUTCOMES'

    let sc_sus_ad_comparison = new ComparisonDto()
    sc_sus_ad_comparison.comparison_type = 'SCALE & SUSTAINED IN TIME COMPARISON'
    sc_sus_ad_comparison.comparison_type_2 = 'ADAPTATION OUTCOMES'
    sc_sus_ad_comparison.col_set_1 = [
      ...col_set_1,
      { label: '', colspan: 3 }
    ]
    sc_sus_ad_comparison.col_set_2 = [...this.col_set_2, ...sc_sus_col_2]

    let sc_sus_ad_total = {}


    scalAdaptationData.interventions.map(int => {
      let res = scale_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      res['adaptation_score'] = int.category_score
      sc_sus_ad_comparison.interventions.push({
        id: int.id, name: int.name, type: int.type, status: int.status, assessment_id: int.assessment_id, scale_score: int.category_score
      })
      scale_cat_total[int.assessment_id] += int.category_score.value
      scale_cat_count[int.assessment_id]++
      sc_cat_total[int.assessment_id] += int.category_score.value
      sc_sus_ad_total[int.assessment_id] = int.category_score.value
    })

    sustainedAdaptationData.interventions.map(int => {
      let res = sustained_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      if (res) {
        res['adaptation_score'] = int.category_score
        sustain_cat_total[int.assessment_id] += int.category_score.value
        sustain_cat_count[int.assessment_id]++
        ss_cat_total[int.assessment_id] += int.category_score.value
      }
      let res2 = sc_sus_ad_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      if (res2) {
        res2['sustained_score'] = int.category_score
        sc_sus_ad_total[int.assessment_id] += int.category_score.value
      }
    })

    scale_comparison.interventions = scale_comparison.interventions.map(int => {
      let score = Math.round(sc_cat_total[int.assessment_id] / (scale_comparison.col_set_2.length - 4))
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
      return int
    })

    sustained_comparison.interventions = sustained_comparison.interventions.map(int => {
      let score = Math.round(ss_cat_total[int.assessment_id] / (sustained_comparison.col_set_2.length - 4))
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapSustainedScores(score), score)
      return int
    })

    sc_sus_ghg_comparison.interventions = sc_sus_ghg_comparison.interventions.map(int => {
      let score = Math.floor(sc_sus_total[int.assessment_id] / 2)
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
      return int
    })

    sc_sus_ad_comparison.interventions = sc_sus_ad_comparison.interventions.map(int => {
      let score = Math.floor(sc_sus_ad_total[int.assessment_id] / 2)
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
      return int
    })

    let outcome_level_comparison = new ComparisonDto()
    outcome_level_comparison.comparison_type = 'OUTCOME LEVEL COMPARISON'
    outcome_level_comparison.comparison_type_2 = comparison_type_2
    outcome_level_comparison.col_set_1 = [
      ...col_set_1,
      { label: '', colspan: 3 }
    ]
    outcome_level_comparison.col_set_2 = [
      ...this.col_set_2,
      { label: 'SCALE CATEGORY SCORE', code: 'scale_cat_score' },
      { label: 'SUSTAINED CATEGORY SCORE', code: 'sustained_cat_score' },
      { label: 'OUTCOME SCORE', code: 'category_score' }
    ]
    scaleGhgData.interventions.map(int => {
      let scale_score = Math.round(scale_cat_total[int.assessment_id] / scale_cat_count[int.assessment_id])
      let sustaine_score = Math.round(sustain_cat_total[int.assessment_id] / sustain_cat_count[int.assessment_id])
      let _cat_score = Math.round((scale_score + sustaine_score) / 2)
      outcome_level_comparison.interventions.push({
        id: int.id, name: int.name, type: int.type, status: int.status,
        scale_cat_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(scale_score), scale_score),
        sustained_cat_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(sustaine_score), sustaine_score),
        category_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(outcome_score[int.assessment_id]), outcome_score[int.assessment_id])
      })
    })


    scale_comparison.order = sus_order + 1
    sustained_comparison.order = sus_order + 2
    sc_sus_ghg_comparison.order = sus_order + 3
    sc_sus_ad_comparison.order = sus_order + sdgs.length + 5
    outcome_level_comparison.order = sc_sus_ad_comparison.order + 1


    response.push(scaleGhgData, scalAdaptationData, sustainedGhgData, sustainedAdaptationData, scale_comparison,
      sustained_comparison, sc_sus_ghg_comparison, sc_sus_ad_comparison, outcome_level_comparison)

    response.sort((a, b) => a.order - b.order)

    return {
      outcomeData: response,
      sdgs: sdgs
    }
  }

  async getAggragationData(pAssessments: PortfolioAssessment[]) {
    let response: ComparisonDto=new ComparisonDto();
    let total=0;
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name,
        mitigation:0
      }

      let data
      switch (pAssessment.assessment.tool) {
        case 'Portfolio Tool':
          _intervention.mitigation = await this.getAlignmentDataforTool(pAssessment.assessment.id);
          total+= _intervention.mitigation;
          response.interventions.push(_intervention);
          break
        case 'Investment & Private Sector Tool':
          _intervention.mitigation = await this.getAlignmentDataforTool(pAssessment.assessment.id);
          total+= _intervention.mitigation;
          response.interventions.push(_intervention)
          break;
        case 'Carbon Market Tool':
          // _intervention.mitigation = await this.getAlignmentDataforTool(pAssessment.assessment.id);
          // total+= _intervention.mitigation;
          // response.interventions.push(_intervention)
          break;
      }
    }
      response.total=total;
    return response
  }

  async getAlignmentData(pAssessments: PortfolioAssessment[], sdgs: any[]) {
    let response: ComparisonDto = new ComparisonDto()
    let intervention_data = []
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        type: pAssessment.assessment.climateAction.typeofAction,
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let data
      switch (pAssessment.assessment.tool) {
        case 'Portfolio Tool':
        case 'Investment & Private Sector Tool':
          data = await this.getAlignmentDataPortfolioInvestor(pAssessment.assessment)
          break;
        case 'Carbon Market Tool':
          data = await this.getAlignmentDataCarbonMarket(pAssessment.assessment, sdgs)
          break;
      }
      intervention_data.push({ data: data, intervention: _intervention })
    }

    response.col_set_1 = [
      { label: "INTERVENTION INFORMATION", colspan: 4 },
      { label: '', colspan: sdgs.length }
    ]
    response.col_set_2 = [
      ...this.col_set_2,
    ]

    let cols = []
    for (let sd of sdgs){
      cols.push({label: sd.replace('_', ' '), code: sd})
    }

    for (let int_data of intervention_data){
      response.interventions.push({...int_data.intervention, ...int_data.data})
    }

    response.col_set_2.push(...cols)
    response.sdg_count = sdgs.length

    return response
  }

  async getProcessDataPortfolioInvestor(assessement: Assessment) {
    let categories = []
    let cat_names = []
    let cat_obj = {}
    let cat_total = 0

    let data = (await this.investorToolService.calculateNewAssessmentResults(assessement.id)).processData

    for (let cat of data) {
      let obj = {}
      let characteristics = []
      let ch_data = {}
      for await (let ch of cat.characteristicData) {
        characteristics.push({ label: ch.characteristic.toUpperCase(), code: ch.ch_code })
        ch_data[ch.ch_code] = ch.likelihood.name
      }
      characteristics.push({ label: 'Category score', code: 'category_score' })
      ch_data['category_score'] = cat.category_score.value
      obj['characteristics'] = characteristics
      obj['ch_data'] = ch_data
      obj['characteristic_count'] = characteristics.length
      obj['col_set_1'] = { label: cat.category, colspan: characteristics.length + 1 }
      cat_obj[cat.category] = cat.category_score.value
      cat_total += cat.category_score.value
      cat_names.push(cat.category)
      categories.push(obj)
    }
    // cat_obj['category_score'] = this.investorToolService.mapSustainedScores(Math.round(cat_total / cat_names.length))
    cat_obj['category_score'] = Math.round(cat_total / cat_names.length)

    return { categories: categories, cat_names: cat_names, category_scores: cat_obj }
  }

  async getOutcomeDataPortfolioInvestor(assessement: Assessment) {
    let res = (await this.investorToolService.calculateNewAssessmentResults(assessement.id))
    let sdg = []
    let outcome_score = 0
    outcome_score = res.outcomeScore
    let data = res.outcomeData

    let scGHG = data.find(o => o.code === 'SCALE_GHG')
    let int = scGHG.characteristicData.find(o => o.ch_code === 'MACRO_LEVEL')?.score
    let nat = scGHG.characteristicData.find(o => o.ch_code === 'MEDIUM_LEVEL')?.score
    let sub = scGHG.characteristicData.find(o => o.ch_code === 'MICRO_LEVEL')?.score

    let scale_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        international: this.mapNameAndValue(int.name, int.value),
        national: this.mapNameAndValue(nat.name, nat.value),
        subnational: this.mapNameAndValue(sub.name, sub.value),
        category_score: this.mapNameAndValue(scGHG.category_score.name, scGHG.category_score.value)
      }
    }

    let scSD = data.find(o => o.code === 'SCALE_SD')

    let scale_SDs = {}

    for (let sd of scSD.characteristicData) {
      let sd_code = (sd.name.replace(' ', '_')).toUpperCase()
      sdg.push(sd_code)
      let international = sd.data.find(o => o.ch_code === 'MACRO_LEVEL').score
      let national = sd.data.find(o => o.ch_code === 'MEDIUM_LEVEL').score
      let subnational = sd.data.find(o => o.ch_code === 'MICRO_LEVEL').score

      scale_SDs[sd_code] = {
        col_set_1: { label: 'SCALE - ' + sd.name.toUpperCase(), colspan: 4 },
        data: {
          international: this.mapNameAndValue(international.name, international.value),
          national: this.mapNameAndValue(national.name, national.value),
          subnational: this.mapNameAndValue(subnational.name, subnational.value),
          category_score: this.mapNameAndValue(scSD.category_score.name, scSD.category_score.value) 
        }
      }
    }

    let scAD = data.find(o => o.code === 'SCALE_ADAPTATION')

    int = scAD.characteristicData.find(o => o.ch_code === 'INTERNATIONAL')?.score
    nat = scAD.characteristicData.find(o => o.ch_code === 'NATIONAL')?.score
    sub = scAD.characteristicData.find(o => o.ch_code === 'SUBNATIONAL')?.score

    let scale_adaptation = {
      col_set_1: { label: 'ADAPTATION', colspan: 4 },
      data: {
        international: this.mapNameAndValue(int.name, int.value),
        national: this.mapNameAndValue(nat.name, nat.value),
        subnational: this.mapNameAndValue(sub.name, sub.value),
        category_score: this.mapNameAndValue(scAD.category_score.name, scAD.category_score.value)
      }
    }

    let susGHG = data.find(o => o.code === 'SUSTAINED_GHG')

    let _long = susGHG.characteristicData.find(o => o.ch_code === 'LONG_TERM')?.score
    let medium = susGHG.characteristicData.find(o => o.ch_code === 'MEDIUM_TERM')?.score
    let short = susGHG.characteristicData.find(o => o.ch_code === 'SHORT_TERM')?.score

    let sustained_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        long_term: this.mapNameAndValue(_long.name, _long.value),
        medium_term: this.mapNameAndValue(medium.name, medium.value),
        short_term: this.mapNameAndValue(short.name, short.value),
        category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susGHG.category_score.value), susGHG.category_score.value)
      }
    }

    let susSD = data.find(o => o.code === 'SUSTAINED_SD')

    let sustained_SDs = {}

    for (let sd of susSD.characteristicData) {
      let sd_code = (sd.name.replace(' ', '_')).toUpperCase()
      let long_term = sd.data.find(o => o.ch_code === 'LONG_TERM').score
      let medium_term = sd.data.find(o => o.ch_code === 'MEDIUM_TERM').score
      let short_term = sd.data.find(o => o.ch_code === 'SHORT_TERM').score

      sustained_SDs[sd_code] = {
        col_set_1: { label: 'SUSTAINED - ' + sd.name.toUpperCase(), colspan: 4 },
        data: {
          long_term: this.mapNameAndValue(long_term.name, long_term.value),
          medium_term: this.mapNameAndValue(medium_term.name, medium_term.value),
          short_term: this.mapNameAndValue(short_term.name, short_term.value),
          category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(sd.sdg_score), sd.sdg_score)
        }
      }
    }

    let susAD = data.find(o => o.code === 'SUSTAINED_ADAPTATION')

    _long = susAD.characteristicData.find(o => o.ch_code === 'INTERNATIONAL')?.score
    medium = susAD.characteristicData.find(o => o.ch_code === 'NATIONAL')?.score
    short = susAD.characteristicData.find(o => o.ch_code === 'SUBNATIONAL')?.score

    let sustained_adaptation = {
      col_set_1: { label: 'ADAPTATION', colspan: 4 },
      data: {
        long_term: this.mapNameAndValue(_long.name, _long.value),
        medium_term: this.mapNameAndValue(medium.name, medium.value),
        short_term: this.mapNameAndValue(short.name, short.value),
        category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susAD.category_score.value), susAD.category_score.value)
      }
    }

    return {
      scale_comparisons: {
        ghg: scale_GHGs, sdg: scale_SDs, adaptation: scale_adaptation
      },
      sustained_comparisons: {
        ghg: sustained_GHGs, sdg: sustained_SDs, adaptation: sustained_adaptation
      },
      sdg: sdg,
      outcome_score: outcome_score
    }
  }

  async getAlignmentDataforTool(assessementid: number): Promise<number> {
    let result = await this.assessmentRepo.createQueryBuilder('asses')
      .leftJoinAndMapMany(
        'asses.investor_assessment',
        InvestorAssessment,
        'investor_assessment',
        'investor_assessment.assessment_id = asses.id'
      )
      .where('asses.id=:assessementid  and investor_assessment.characteristic_id in (16,28)', { assessementid })
      .getOne();
    let total = 0

    if (result.investor_assessment) {
      for (let investor of result.investor_assessment) {

        investor.expected_ghg_mitigation ? total += Number(investor.expected_ghg_mitigation) : 0
      }
    }

    return total
  }

  async getAlignmentDataPortfolioInvestor(assessement: Assessment) {
    let response = {}
    let data = this.sdgAssessRepo.createQueryBuilder('sdgAssessment')
      .innerJoin(
        'sdgAssessment.assessment',
        'assessment',
        'assessment.id = sdgAssessment.assessmentId'
      )
      .innerJoinAndSelect(
        'sdgAssessment.sdg',
        'sdg',
        'sdg.id = sdgAssessment.sdgId'
      )
      .where('assessment.id = :id', { id: assessement.id })

    let sdgs = await data.getMany()

    sdgs.map(sd => {
      let code = (sd.sdg.name.replace(' ', '_')).toUpperCase()
      response[code] = sd.answer
    })
    return response
  }

  async getAggregationDataPortfolioTool(assessement: Assessment): Promise<number> {
    return 0
  }
  
  async getProcessDataCarbonMarket(assessement: Assessment) {
    let data = (await this.cMAssessmentQuestionService.getProcessData(assessement.id)).data
    let categories = []
    let cat_names = []
    let cat_obj = {}
    let cat_total = 0
    for await (let cat of data) {
      let obj = {}
      let characteristics = []
      let ch_data = {}
      for await (let ch of cat.characteristic) {
        characteristics.push({ label: ch.name.toUpperCase(), code: ch.code })
        ch_data[ch.code] = this.investorToolService.mapSustainedScores(ch.ch_score)
      }
      characteristics.push({ label: 'Category score', code: 'category_score' })
      ch_data['category_score'] = cat.cat_score
      obj['characteristics'] = characteristics
      obj['ch_data'] = ch_data
      obj['characteristic_count'] = characteristics.length
      obj['col_set_1'] = { label: cat.name, colspan: characteristics.length + 1 }
      cat_obj[cat.name] = cat.cat_score
      cat_total += cat.cat_score
      cat_names.push(cat.name)
      categories.push(obj)
    }
    cat_obj['category_score'] = Math.round(cat_total / cat_names.length)

    return { categories: categories, cat_names: cat_names, category_scores: cat_obj }
  }

  async getOutcomeDataCarbonMarket(assessement: Assessment) {
    let data = (await this.cMAssessmentQuestionService.getResults(assessement.id))?.outComeData
    let result = await this.cMAssessmentQuestionService.calculateResult(assessement.id)

    let scGHG_int = data.scale_GHGs.find(o => o.ch_code === 'MACRO_LEVEL').outcome_score
    let scGHG_nat = data.scale_GHGs.find(o => o.ch_code === 'MEDIUM_LEVEL').outcome_score
    let scGHG_sub = data.scale_GHGs.find(o => o.ch_code === 'MICRO_LEVEL').outcome_score

    let scale_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        international: { name: scGHG_int + ' - ' + this.investorToolService.mapScaleScores(scGHG_int) , value: scGHG_int },
        national: { name: scGHG_nat + ' - ' +  this.investorToolService.mapScaleScores(scGHG_nat), value: scGHG_nat },
        subnational: { name: scGHG_sub  + ' - ' +  this.investorToolService.mapScaleScores(scGHG_sub), value: scGHG_sub },
        category_score: { name: result.outcome_score.scale_ghg_score  + ' - ' + this.investorToolService.mapScaleScores(result.outcome_score.scale_ghg_score), value: result.outcome_score.scale_ghg_score }
      }
    }

    let sdg = this.cMAssessmentQuestionService.group(data.scale_SDs, 'SDG')

    let scale_SDs = {}
    let sdg_count = Object.keys(sdg).length
    for (let sd of Object.keys(sdg)) {
      let international = data.scale_SDs.find(o => o.ch_code === 'MACRO_LEVEL' && o.SDG === sd).outcome_score
      let national = data.scale_SDs.find(o => o.ch_code === 'MEDIUM_LEVEL' && o.SDG === sd).outcome_score
      let subnational = data.scale_SDs.find(o => o.ch_code === 'MICRO_LEVEL' && o.SDG === sd).outcome_score
      let cat_score = Math.round((+international + +national + +subnational) / 3)
      scale_SDs[sd] = {
        col_set_1: { label: 'SCALE - ' + this.getSDGName(sd).toUpperCase(), colspan: 4 },
        data: {
          international: { name: international + ' - ' + this.investorToolService.mapScaleScores(international), value: international },
          national: { name: national  + ' - ' + this.investorToolService.mapScaleScores(national) , value: national },
          subnational: { name: subnational + ' - ' + this.investorToolService.mapScaleScores(subnational) , value: subnational },
          category_score: { name: cat_score  + ' - ' + this.investorToolService.mapScaleScores(cat_score), value: cat_score }
        }
      }
    }


    let scAD_int = data.scale_adaptation.find(o => o.ch_code === 'INTERNATIONAL').outcome_score
    let scAD_nat = data.scale_adaptation.find(o => o.ch_code === 'NATIONAL').outcome_score
    let scAD_sub = data.scale_adaptation.find(o => o.ch_code === 'SUBNATIONAL').outcome_score
    let scAD_cat_score = result.outcome_score.scale_adaptation_score

    let scale_adaptation = {
      col_set_1: { label: 'ADAPTATION', colspan: 4 },
      data: {
        international: { name: scAD_int + ' - ' + this.investorToolService.mapScaleScores(scAD_int), value: scAD_int },
        national: { name: scAD_nat  + ' - ' +  this.investorToolService.mapScaleScores(scAD_nat), value: scAD_nat },
        subnational: { name: scAD_sub  + ' - ' + this.investorToolService.mapScaleScores(scAD_sub), value: scAD_sub },
        category_score: { name: scAD_cat_score  + ' - ' + this.investorToolService.mapScaleScores(scAD_cat_score), value: scAD_cat_score }
      }
    }


    let ssGHG_int = data.sustained_GHGs.find(o => o.ch_code === 'LONG_TERM').outcome_score
    let ssGHG_nat = data.sustained_GHGs.find(o => o.ch_code === 'MEDIUM_TERM').outcome_score
    let ssGHG_sub = data.sustained_GHGs.find(o => o.ch_code === 'SHORT_TERM').outcome_score
    let ssGHG_cat_score = result.outcome_score.sustained_ghg_score

    let sustained_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        long_term: { name: ssGHG_int + ' - ' + this.investorToolService.mapSustainedScores(ssGHG_int), value: ssGHG_int },
        medium_term: { name: ssGHG_nat + ' - ' + this.investorToolService.mapSustainedScores(ssGHG_nat), value: ssGHG_nat },
        short_term: { name: ssGHG_sub + ' - ' + this.investorToolService.mapSustainedScores(ssGHG_sub), value: ssGHG_sub },
        category_score: { name: ssGHG_cat_score + ' - ' + this.investorToolService.mapSustainedScores(ssGHG_cat_score), value: ssGHG_cat_score }
      }
    }

    let sustained_SDs = {}
    for (let sd of Object.keys(sdg)) {
      let long_term = data.sustained_SDs.find(o => o.ch_code === 'LONG_TERM' && o.SDG === sd).outcome_score
      let medium_term = data.sustained_SDs.find(o => o.ch_code === 'MEDIUM_TERM' && o.SDG === sd).outcome_score
      let short_term = data.sustained_SDs.find(o => o.ch_code === 'SHORT_TERM' && o.SDG === sd).outcome_score
      let cat_score = Math.round((+long_term + +medium_term + +short_term) / sdg_count / 3)
      sustained_SDs[sd] = {
        col_set_1: { label: 'SUSTAINED - ' + this.getSDGName(sd).toUpperCase(), colspan: 4 },
        data: {
          long_term: { name: long_term + ' - ' + this.investorToolService.mapSustainedScores(long_term), value: long_term },
          medium_term: { name: medium_term + ' - ' + this.investorToolService.mapSustainedScores(medium_term), value: medium_term },
          short_term: { name: short_term + ' - ' + this.investorToolService.mapSustainedScores(short_term), value: short_term },
          category_score: { name: cat_score + ' - ' + this.investorToolService.mapSustainedScores(cat_score), value: cat_score }
        }
      }
    }

    let susAD_int = data.sustained_adaptation.find(o => o.ch_code === 'INTERNATIONAL').outcome_score
    let susAD_nat = data.sustained_adaptation.find(o => o.ch_code === 'NATIONAL').outcome_score
    let susAD_sub = data.sustained_adaptation.find(o => o.ch_code === 'SUBNATIONAL').outcome_score
    let susAD_cat_score = result.outcome_score.sustained_adaptation_score

    let sustained_adaptation = {
      col_set_1: { label: 'ADAPTATION', colspan: 4 },
      data: {
        long_term: { name: susAD_int + ' - ' + this.investorToolService.mapSustainedScores(susAD_int), value: susAD_int },
        medium_term: { name: susAD_nat + ' - ' + this.investorToolService.mapSustainedScores(susAD_nat), value: susAD_nat },
        short_term: { name: susAD_sub + ' - ' + this.investorToolService.mapSustainedScores(susAD_sub), value: susAD_sub },
        category_score: { name: susAD_cat_score + ' - ' + this.investorToolService.mapSustainedScores(susAD_cat_score), value: susAD_cat_score }
      }
    }

    return {
      scale_comparisons: {
        ghg: scale_GHGs, sdg: scale_SDs, adaptation: scale_adaptation
      },
      sustained_comparisons: {
        ghg: sustained_GHGs, sdg: sustained_SDs, adaptation: sustained_adaptation
      },
      sdg: Object.keys(sdg),
      outcome_score: result.outcome_score.outcome_score
    }

  }

  async getAggregationDataCarbonMarket(assessement: Assessment) {

  }


  async getAlignmentDataCarbonMarket(assessement: Assessment, sdgs: any[]) {
    let response = {}
    sdgs.map(sd => {
      response[sd] = '-'
    })

    return response
  }

  getSDGName(code) {
    let sdg = this.masterDataService.SDGs.find(o => o.code === code)
    return sdg.name
  }

  async getDashboardData(portfolioID: number, options: IPaginationOptions): Promise<Pagination<any>> {
    let tool = 'Portfolio Tool';
    let filter = '(asses.process_score is not null and asses.outcome_score is not null)'
    let user = this.userService.currentUser();
    const currentUser = await user;
    let userId = currentUser.id;
    let userCountryId = currentUser.country?.id;

    if (currentUser?.userType?.name === 'External') {
      filter = filter + ' and asses.user_id=:userId '
    }
    else {
      filter = filter + ' and country.id=:userCountryId '
    }

    let data = this.assessmentRepo.createQueryBuilder('asses')

    if (Number(portfolioID)) {

      filter = filter + 'and portfolio_assesmet.portfolio_id=:portfolioID'
      data.innerJoinAndMapOne(
        'asses.portfolio_assesmet',
        PortfolioAssessment,
        'portfolio_assesmet',
        'asses.id = portfolio_assesmet.assessment_id'
      )
    }else{

      filter = filter + ' and asses.tool=:tool '
    }
    data.select(['asses.id', 'asses.process_score', 'asses.outcome_score'])
      .leftJoinAndMapOne(
        'asses.climateAction',
        ClimateAction,
        'climateAction',
        'asses.climateAction_id = climateAction.id'
      )

      // .leftJoinAndMapOne(
      //   'asses.user',
      //    User,
      //   'user',
      //   'asses.user_id = user.id'
      // )
      .leftJoinAndMapOne(
        'climateAction.country',
        Country,
        'country',
        'climateAction.countryId = country.id'
      ).where(filter, { tool, userId, userCountryId, portfolioID }).orderBy('asses.id','DESC')


  

    let result = await paginate(data, options);
    // console.log("result",result)
    // return {
    //   assessment: result.id,
    //   process_score: data?.process_score,
    //   outcome_score: data?.outcome_score?.outcome_score,
    //   intervention: result.climateAction?.policyName
    // };

    return result;
  }

  mapNameAndValue(name, value){
    if (value === null || value === '-' || value === undefined || Number.isNaN(value)){
      return {name: 'Empty', value: null}
    } else {
      return {name: value + ' - ' + name, value: value}
    }
  }

  addCategoryScores(add, score){
    if (score === null){
      if (add === undefined){
        add = undefined
      } 
    } else {
      if (add === undefined){
        add = undefined
      } else {
        add += score
      }
    }
    return add
  }
}
