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
import { SdgPriority } from 'src/investor-tool/entities/sdg-priority.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { isNull } from '@nestjsx/util';

@Injectable()
export class PortfolioService extends TypeOrmCrudService<Portfolio> {

  col_set_2 = [
    { label: 'ID', code: 'id' },
    { label: 'Intervention name', code: 'name' },
    { label: 'Tool applied', code: 'tool' },
    { label: 'Status', code: 'status' }
  ]


  constructor(
    @InjectRepository(Portfolio) repo,
    @InjectRepository(PortfolioAssessment) private readonly portfolioAssessRepo: Repository<PortfolioAssessment>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,
    @InjectRepository(SdgAssessment) private readonly sdgAssessRepo: Repository<SdgAssessment>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    @InjectRepository(SdgAssessment) private readonly sdgAssessmentRepo: Repository<SdgAssessment>,
    @InjectRepository(Results) private readonly resultsRepo: Repository<Results>,
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
      let assessment = new Assessment();
      assessment.id = x
      const portfolioAssessment = new PortfolioAssessment()
      portfolioAssessment.portfolio = portfolio;
      portfolioAssessment.assessment = assessment;
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
   
    let response = await this.portfolioAssessRepo.find({
      relations: ['assessment'],
      where: { portfolio: { id: portfolioId } },
    });
    let result = new Array();
    let assessmentIdArray: number[] = [];
    for (let data of await response) {
      let GHGvalue:number|null =null;
      let assessmentId = data.assessment.id;
      assessmentIdArray.push(assessmentId);
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
      if(GHGvalue!==null){
        result.push({ result: updatedRes, assessment: data.assessment, ghgValue: GHGvalue })
      }
      
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
      let assessmentIdArray: number[] = [];
      for (let data of await response) {
        let assessmentId = data.assessment.id;
        assessmentIdArray.push(assessmentId);
      }
      data.where('assessment.id IN (:...ids)', { ids: assessmentIdArray })

    }else{
      let filter = 'assessment.tool="PORTFOLIO" '


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
          'assessment.climateAction_id = climateAction.id and not climateAction.status =-20'
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
      .addSelect('sdg.number', 'number')
      .addSelect('COUNT(sdgasess.id)', 'count')
      .groupBy('sdg.name')
      .having('sdg IS NOT NULL')


    return await data.getRawMany();
  }


  async getLastID(): Promise<Portfolio[]> {
    return await this.repo.find({ order: { id: 'DESC' }, take: 1 });
  }

  async getPortfolioComparisonData(portfolioId: number) {

 
    let response = new ComparisonTableDataDto()
    let sdgs: any[] = []

    let pAssessments = await this.assessmentsByPortfolioId(portfolioId)

    let cmScores = {}
    let piScores = {}
    for (let pAssessment of pAssessments){
      let score = await this.cMAssessmentQuestionService.calculateResult(pAssessment.assessment.id)
      let piscore = await this.investorToolService.calculateNewAssessmentResults(pAssessment.assessment.id)
      cmScores[pAssessment.assessment.id] = score
      piScores[pAssessment.assessment.id] = piscore
    }

    response.process_data = await this.getProcessData(pAssessments, cmScores, piScores)
    let outcomeResponse = await this.getOutcomeData(pAssessments, cmScores, piScores)
    response.outcome_data = outcomeResponse.outcomeData
    response.aggregation_data = await this.getAggragationData(pAssessments)
    response.alignment_data = await this.getAlignmentData(pAssessments, cmScores, outcomeResponse.sdg_scores)

    return response
  }

  async getProcessData(pAssessments: PortfolioAssessment[], cmScores: any, piScores: any) {
    let response: ComparisonDto[] = []
    let intervention_data = []
    let int_categories = []
    let col_set_1 = [{ label: 'Intervention information', colspan: 4 }]

    for await (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        tool: this.masterDataService.getToolName(pAssessment.assessment.tool),
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let categories
      let res
      switch (pAssessment.assessment.tool) {
        case 'PORTFOLIO':
        case 'INVESTOR':
          res = await this.getProcessDataPortfolioInvestor(pAssessment.assessment, piScores)
          break;
        case 'CARBON_MARKET':
          res = await this.getProcessDataCarbonMarket(pAssessment.assessment, cmScores)
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
      likelihood_comparison.col_set_1.push({label: 'Category - ' + cat, colspan: 1})
      likelihood_comparison.col_set_2.push({label: 'Category score', code: cat})
      let comparisonData = new ComparisonDto()
      comparisonData.col_set_1.push(...col_set_1)
      comparisonData.col_set_2.push(...this.col_set_2)
      for (let [index, int_data] of intervention_data.entries()) {
        let data = int_data.categories.find(o => o.col_set_1.label === cat)
        if(data) {
          data.col_set_1 = {...data.col_set_1, label: 'Category - ' + data.col_set_1.label,}
          if (comparisonData.col_set_1.length === 1) comparisonData.col_set_1.push(data.col_set_1)
          if (index === 0) {
            comparisonData.col_set_2.push(...data.characteristics)
            comparisonData.characteristic_count = data.characteristic_count
          }
          comparisonData.interventions.push({ ...int_data.intervention, ...data.ch_data })
        }
      }
      comparisonData.order = idx + 1
      response.push(comparisonData)
    }
    likelihood_comparison.col_set_2.push({label: 'Processes score', code: 'category_score'})
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

  async getOutcomeData(pAssessments: PortfolioAssessment[], cmScores: any, piScores: any) {
    let response: ComparisonDto[] = []
    let sdgs: any[] = []
    let sdgs_score: any = {}
    let intervention_data = []
    let col_set_1 = [{ label: 'Intervention information', colspan: 4 }]
    let col_set_2_scale = [
      { label: 'International', code: 'international' },
      { label: 'National/Sectoral', code: 'national' },
      { label: 'Subnational/Subsectoral', code: 'subnational' },
      { label: 'Category score', code: 'category_score' }
    ]
    let col_set_2_sustained = [
      { label: 'Long term', code: 'long_term' },
      { label: 'Medium term', code: 'medium_term' },
      { label: 'Short term', code: 'short_term' },
      { label: 'Category score', code: 'category_score' }
    ]

    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        tool: this.masterDataService.getToolName(pAssessment.assessment.tool),
        status: pAssessment.assessment.climateAction.projectStatus?.name,
        assessment_id: pAssessment.assessment.id
      }

      let data
      switch (pAssessment.assessment.tool) {
        case 'PORTFOLIO':
        case 'INVESTOR':
          data = await this.getOutcomeDataPortfolioInvestor(pAssessment.assessment, piScores)
          break;
        case 'CARBON_MARKET':
          data = await this.getOutcomeDataCarbonMarket(pAssessment.assessment, cmScores)
          break;
      }
      sdgs.push(...data.sdg)
      sdgs = [... new Set(sdgs)]
      sdgs_score[pAssessment.assessment.id] = data.sdgs_score

      intervention_data.push({ data: data, intervention: _intervention })
    }

    let scaleGhgData = new ComparisonDto()
    let sustainedGhgData = new ComparisonDto()
    let sc_sus_ghg_comparison = new ComparisonDto()
    let scalAdaptationData = new ComparisonDto()
    let sustainedAdaptationData = new ComparisonDto()
    let scaleSdgData = {}
    let sustainedSdgData = {}
    let scale_comparison = new ComparisonDto()
    let sc_sus_ad_comparison = new ComparisonDto()
    let sustained_comparison = new ComparisonDto()
    let outcome_level_comparison = new ComparisonDto()

    scaleGhgData.comparison_type = 'Scale comparison',
      scaleGhgData.comparison_type_2 = 'Outcomes'
    scalAdaptationData.comparison_type = 'Scale comparison'
    scalAdaptationData.comparison_type_2 = 'Outcomes'
    sustainedGhgData.comparison_type = 'Sustained in time comparison'
    sustainedGhgData.comparison_type_2 = 'Outcomes'
    sustainedAdaptationData.comparison_type = 'Sustained in time comparison'
    sustainedAdaptationData.comparison_type_2 = 'Outcomes'
    let order = 0
    let sus_order = 0
    let outcome_score = {}

    scaleGhgData.order = 1
    sustainedGhgData.order = 2
    sc_sus_ghg_comparison.order = 3

    order = 3

    for (let sd of sdgs) {
      scaleSdgData[sd] = new ComparisonDto()
      scaleSdgData[sd].comparison_type = 'Scale comparison'
      scaleSdgData[sd].comparison_type_2 = 'Outcomes'
      scaleSdgData[sd].col_set_2 = [...this.col_set_2, ...col_set_2_scale]
      scaleSdgData[sd].order = ++order
      sustainedSdgData[sd] = new ComparisonDto()
      sustainedSdgData[sd].comparison_type = 'Sustained in time comparison'
      sustainedSdgData[sd].comparison_type_2 = 'Outcomes'
      sustainedSdgData[sd].col_set_2 = [...this.col_set_2, ...col_set_2_sustained]
      sustainedSdgData[sd].order = ++order
      order++
    }
    scalAdaptationData.order = ++order
    sustainedAdaptationData.order = ++order
    sc_sus_ad_comparison.order = ++order
    scale_comparison.order = ++order
    sustained_comparison.order = ++order
    outcome_level_comparison.order = ++order

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

      outcome_score[int_data.intervention.assessment_id] = int_data.data.outcome_score;
      scaleGhgData.interventions.push({ ...int_data.intervention, ...int_data.data.scale_comparisons.ghg.data });
      order = 1;
      sus_order = 2 + sdgs.length;
      for (let sd of sdgs) {
        if (int_data.data.sdg.includes(sd) && int_data.data.scale_comparisons.sdg[sd]) {
          order += 1;
          sus_order += 1;
          scaleSdgData[sd].interventions.push({ ...int_data.intervention, ...int_data.data.scale_comparisons.sdg[sd].data });
          sustainedSdgData[sd].interventions.push({ ...int_data.intervention, ...int_data.data.sustained_comparisons.sdg[sd].data });
        }
      }

      scalAdaptationData.interventions.push({ ...int_data.intervention, ...int_data.data.scale_comparisons.adaptation.data });
      order += 1;

      sustainedGhgData.interventions.push({ ...int_data.intervention, ...int_data.data.sustained_comparisons.ghg.data });
      sus_order += 1;
      sustainedAdaptationData.interventions.push({ ...int_data.intervention, ...int_data.data.sustained_comparisons.adaptation.data });
    }

    scale_comparison.comparison_type = 'Scale comparison';
    scale_comparison.comparison_type_2 = 'Outcomes';
    scale_comparison.col_set_1 = [
      ...col_set_1,
      { label: 'GHG', colspan: 1 }
    ]
    scale_comparison.col_set_2 = [
      ...this.col_set_2,
      { label: 'catogory score', code: 'ghg_score' }
    ]

    let sc_cat_total = {};
    let sc_sus_total = {};
    let scale_cat_total = {};
    let scale_cat_count = {};
    let sustain_cat_total = {};
    let sustain_cat_count = {};
    let comparison_type_2 = 'GHG, ';

    let sc_sus_col_2 = [
      { label: 'Scale category score', code: 'scale_score' },
      { label: 'Sustained catogory score', code: 'sustained_score' },
      { label: 'Catogory score', code: 'category_score' }
    ]

    
    sc_sus_ghg_comparison.comparison_type = 'Scale & Sustained in time comparison'
    sc_sus_ghg_comparison.comparison_type_2 = 'GHG Outcomes'
    sc_sus_ghg_comparison.col_set_1 = [
      ...col_set_1,
      { label: '', colspan: 3 }
    ]
    sc_sus_ghg_comparison.col_set_2 = [...this.col_set_2, ...sc_sus_col_2];

    scaleGhgData.interventions.map(int => {
      scale_comparison.interventions.push({
        id: int.id, name: int.name, tool: int.tool, status: int.status, assessment_id: int.assessment_id, ghg_score: int.category_score
      })
      sc_sus_ghg_comparison.interventions.push({
        id: int.id, name: int.name, tool: int.tool, status: int.status, assessment_id: int.assessment_id, scale_score: int.category_score
      })

      scale_cat_total[int.assessment_id] = int.category_score.value === null ? null : int.category_score.value;
      scale_cat_count[int.assessment_id] = 1;
      sc_cat_total[int.assessment_id] = int.category_score.value === null ? null : int.category_score.value;
      sc_sus_total[int.assessment_id] = int.category_score.value === null ? null : int.category_score.value;
    })

    sustained_comparison.comparison_type = 'Sustained comparison';
    sustained_comparison.comparison_type_2 = 'Outcomes';
    sustained_comparison.col_set_1 = [
      ...col_set_1,
      { label: 'GHG', colspan: 1 }
    ]
    sustained_comparison.col_set_2 = [
      ...this.col_set_2,
      { label: 'Catogory score', code: 'ghg_score' }
    ]

    let ss_cat_total = {};

    sustainedGhgData.interventions.map(int => {
      sustained_comparison.interventions.push({
        id: int.id, name: int.name, tool: int.tool, status: int.status, assessment_id: int.assessment_id, ghg_score: int.category_score
      })
      let res = sc_sus_ghg_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      res['sustained_score'] = int.category_score;
      sustain_cat_total[int.assessment_id] = int.category_score.value;
      sustain_cat_count[int.assessment_id] = 1;
      ss_cat_total[int.assessment_id] = int.category_score.value;
      sc_sus_total[int.assessment_id] += int.category_score.value;
    })

    let sc_sus_sdgs = {};

    for (let [index, sd] of sdgs.entries()) {
      scale_comparison.col_set_1.push({ label: scaleSdgData[sd].col_set_1[1].label, colspan: 1 });
      scale_comparison.col_set_2.push({ label: 'Catogory score', code: sd + '_score' });

      sustained_comparison.col_set_1.push({ label: sustainedSdgData[sd].col_set_1[1].label, colspan: 1 });
      sustained_comparison.col_set_2.push({ label: 'Catogory score', code: sd + '_score' });

      sc_sus_sdgs[sd] = new ComparisonDto()
      sc_sus_sdgs[sd].comparison_type = 'Scale & Sustained in time comparison';
      let label = (scaleSdgData[sd].col_set_1[1].label).split('-');
      sc_sus_sdgs[sd].comparison_type_2 = 'SDG Outcomes - ' + label[1].trim() + ' - ' + label[2].trim();
      sc_sus_sdgs[sd].col_set_1 = [
        ...col_set_1,
        { label: '', colspan: 3 }
      ]
      sc_sus_sdgs[sd].col_set_2 = [...this.col_set_2, ...sc_sus_col_2];
      comparison_type_2 += label[1] + ' - ' + label[2] + ' ,';

      let sc_sus_sd_total = {};

      scaleSdgData[sd].interventions.map(int => {
        let res = scale_comparison.interventions.find(o => o.assessment_id === int.assessment_id);
        if (res) {
          res[sd + '_score'] = int.category_score;
          sc_sus_sdgs[sd].interventions.push({
            id: int.id, name: int.name, tool: int.tool, status: int.status, assessment_id: int.assessment_id, scale_score: int.category_score
          });
          sc_sus_sdgs[sd].order = scaleSdgData[sd].order + 2;
          scale_cat_total[int.assessment_id] === null ? 
            (int.category_score.value === null ? scale_cat_total[int.assessment_id] = null : scale_cat_total[int.assessment_id] = int.category_score.value) :
            scale_cat_total[int.assessment_id] += int.category_score.value
          scale_cat_count[int.assessment_id]++
          sc_sus_sd_total[int.assessment_id] = (int.category_score.value === null) ? null : int.category_score.value
          sc_cat_total[int.assessment_id] === null ? 
            (int.category_score.value === null ? sc_cat_total[int.assessment_id] = null : sc_cat_total[int.assessment_id] = int.category_score.value) :
            sc_cat_total[int.assessment_id] += int.category_score.value
        }
      })
      sustainedSdgData[sd].interventions.map(int => {
        let res = sustained_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
        if (res) {
          res[sd + '_score'] = int.category_score;
        }
        let res2 = sc_sus_sdgs[sd].interventions.find(o => o.assessment_id === int.assessment_id)
        if (res2){
          res2['sustained_score'] = int.category_score;
        }
        sc_sus_sd_total[int.assessment_id] === null ? 
            (int.category_score.value === null ? sc_sus_sd_total[int.assessment_id] = null : sc_sus_sd_total[int.assessment_id] = int.category_score.value) :
            sc_sus_sd_total[int.assessment_id] += int.category_score.value
        sustain_cat_total[int.assessment_id] === null ? 
            (int.category_score.value === null ? sustain_cat_total[int.assessment_id] = null : sustain_cat_total[int.assessment_id] = int.category_score.value) :
            sustain_cat_total[int.assessment_id] += int.category_score.value
        sustain_cat_count[int.assessment_id]++
        ss_cat_total[int.assessment_id] === null ? 
            (int.category_score.value === null ? ss_cat_total[int.assessment_id] = null : ss_cat_total[int.assessment_id] = int.category_score.value) :
            ss_cat_total[int.assessment_id] += int.category_score.value
      })

      sc_sus_sdgs[sd].interventions = sc_sus_sdgs[sd].interventions.map(int => {
        let score = null
      if (int.scale_score.value !== null) {
        score = int.scale_score.value;
      }
      if (int.sustained_score.value !== null) {
       ( score !== null) ? score += int.sustained_score.value : score = int.sustained_score.value;
      }
      ( score !== null) ? score = Math.floor(score / 2) : score = score
        int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
        return int
      })
      response.push(scaleSdgData[sd], sustainedSdgData[sd], sc_sus_sdgs[sd]);
    }

    scale_comparison.col_set_1.push({ label: 'Adaptation', colspan: 1 }, { label: 'Scale catogory score', colspan: 1 });

    scale_comparison.col_set_2.push(...[
      { label: 'Catogory score', code: 'adaptation_score' },
      { label: 'Catogory score', code: 'category_score' },
    ])

    sustained_comparison.col_set_1.push({ label: 'Adaptation', colspan: 1 }, { label: 'Sustained catogory score', colspan: 1 });
    sustained_comparison.col_set_2.push(...[
      { label: 'Catogory score', code: 'adaptation_score' },
      { label: 'Catogory score', code: 'category_score' },
    ]);

    comparison_type_2 += 'Adaptation Outcomes'

    
    sc_sus_ad_comparison.comparison_type = 'Scale & Sustained in time comparison'
    sc_sus_ad_comparison.comparison_type_2 = 'Adaptation Outcomes'
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
        id: int.id, name: int.name, tool: int.tool, status: int.status, assessment_id: int.assessment_id, scale_score: int.category_score
      });
      
      scale_cat_total[int.assessment_id] === null ? 
      (int.category_score.value === null ? scale_cat_total[int.assessment_id] = null : scale_cat_total[int.assessment_id] = int.category_score.value) :
      scale_cat_total[int.assessment_id] += int.category_score.value
      scale_cat_count[int.assessment_id]++
      sc_cat_total[int.assessment_id] === null ? 
      (int.category_score.value === null ? sc_cat_total[int.assessment_id] = null : sc_cat_total[int.assessment_id] = int.category_score.value) :
      sc_cat_total[int.assessment_id] += int.category_score.value
      sc_sus_ad_total[int.assessment_id] = int.category_score.value === null ? null : int.category_score.value
    })

    sustainedAdaptationData.interventions.map(int => {
      let res = sustained_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      if (res) {
        res['adaptation_score'] = int.category_score
        sustain_cat_total[int.assessment_id] === null ?
          (int.category_score.value === null ? sustain_cat_total[int.assessment_id] = null : sustain_cat_total[int.assessment_id] = int.category_score.value) :
          sustain_cat_total[int.assessment_id] += int.category_score.value
        sustain_cat_count[int.assessment_id]++
        ss_cat_total[int.assessment_id] === null ?
          (int.category_score.value === null ? ss_cat_total[int.assessment_id] = null : ss_cat_total[int.assessment_id] = int.category_score.value) :
          ss_cat_total[int.assessment_id] += int.category_score.value
      }
      let res2 = sc_sus_ad_comparison.interventions.find(o => o.assessment_id === int.assessment_id)
      if (res2) {
        res2['sustained_score'] = int.category_score
        sc_sus_ad_total[int.assessment_id] === null ?
          (int.category_score.value === null ? sc_sus_ad_total[int.assessment_id] = null : sc_sus_ad_total[int.assessment_id] = int.category_score.value) :
          sc_sus_ad_total[int.assessment_id] += int.category_score.value
      }
    })

    scale_comparison.interventions = scale_comparison.interventions.map(int => {

      let score = sc_cat_total[int.assessment_id] !== null ? Math.floor(sc_cat_total[int.assessment_id] / (scale_comparison.col_set_2.length - 4)) : null
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
      return int
    })

    sustained_comparison.interventions = sustained_comparison.interventions.map(int => {
      let score = ss_cat_total[int.assessment_id] !== null ? Math.floor(ss_cat_total[int.assessment_id] / (sustained_comparison.col_set_2.length - 4)) : null
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapSustainedScores(score), score)
      return int
    })

    sc_sus_ghg_comparison.interventions = sc_sus_ghg_comparison.interventions.map(int => {
      let score = null
      if (int.scale_score.value !== null) {
        score = int.scale_score.value
      }
      if (int.sustained_score.value !== null) {
       ( score !== null) ? score += int.sustained_score.value : score = int.sustained_score.value;
      }
      ( score !== null) ? score = Math.floor(score / 2) : score = score
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
      return int;
    })

    sc_sus_ad_comparison.interventions = sc_sus_ad_comparison.interventions.map(int => {
      let score = null
      if (int.scale_score.value !== null) {
        score = int.scale_score.value;
      }
      if (int.sustained_score.value !== null) {
       ( score !== null) ? score += int.sustained_score.value : score = int.sustained_score.value;
      }
      ( score !== null) ? score = Math.floor(score / 2) : score = score
      int['category_score'] = this.mapNameAndValue(this.investorToolService.mapScaleScores(score), score)
      return int;
    })

    outcome_level_comparison.comparison_type = 'Outcome level comparison';
    outcome_level_comparison.comparison_type_2 = comparison_type_2;
    outcome_level_comparison.col_set_1 = [
      ...col_set_1,
      { label: '', colspan: 3 }
    ]
    outcome_level_comparison.col_set_2 = [
      ...this.col_set_2,
      { label: 'Scale category score', code: 'scale_cat_score' },
      { label: 'Sustained catogory score', code: 'sustained_cat_score' },
      { label: 'Outcome score', code: 'category_score' }
    ]
    scaleGhgData.interventions.map(int => {
      let scale_score = scale_cat_total[int.assessment_id] !== null ? Math.floor(scale_cat_total[int.assessment_id] / scale_cat_count[int.assessment_id]) : null
      let sustaine_score = sustain_cat_total[int.assessment_id] !== null ? Math.floor(sustain_cat_total[int.assessment_id] / sustain_cat_count[int.assessment_id]) : null
      let _cat_score = Math.floor((scale_score + sustaine_score) / 2)
      outcome_level_comparison.interventions.push({
        id: int.id, name: int.name, tool: int.tool, status: int.status,
        scale_cat_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(scale_score), scale_score),
        sustained_cat_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(sustaine_score), sustaine_score),
        category_score: outcome_score[int.assessment_id] === null ? 'N/A' : this.mapNameAndValue(this.investorToolService.mapScaleScores(outcome_score[int.assessment_id]), outcome_score[int.assessment_id])
      })
    })


    response.push(scaleGhgData, scalAdaptationData, sustainedGhgData, sustainedAdaptationData, scale_comparison,
      sustained_comparison, sc_sus_ghg_comparison, sc_sus_ad_comparison, outcome_level_comparison)

    response.sort((a, b) => a.order - b.order)

    return {
      outcomeData: response,
      sdgs: sdgs,
      sdg_scores: sdgs_score
    }
  }

  async getAggragationData(pAssessments: PortfolioAssessment[]) {
    let response: ComparisonDto = new ComparisonDto();
    let total = 0;
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        tool: this.masterDataService.getToolName(pAssessment.assessment.tool),
        status: pAssessment.assessment.climateAction.projectStatus?.name,
        mitigation: 0
      }

      switch (pAssessment.assessment.tool) {
        case 'PORTFOLIO':
          _intervention.mitigation = await this.getAggregationDataPortfolioTool(pAssessment.assessment);
          total += _intervention.mitigation;
          response.interventions.push(_intervention);
          break
        case 'INVESTOR':
          _intervention.mitigation = await this.getAggregationDataPortfolioTool(pAssessment.assessment);
          total += _intervention.mitigation;
          response.interventions.push(_intervention)
          break;
        case 'CARBON_MARKET':
          _intervention.mitigation = await this.getAggregationDataCarbonMarket(pAssessment.assessment);
          total += _intervention.mitigation;
          response.interventions.push(_intervention)
          break;
      }
      _intervention.mitigation = this.thousandSeperate(_intervention.mitigation, 4)
    }
    total = this.thousandSeperate(total, 4)
    response.total = total;
    return response
  }

  async getAlignmentData(pAssessments: PortfolioAssessment[], cmScores: any, sdgs_score: any) {
    let sdgs = []
    let response: ComparisonDto = new ComparisonDto()
    let intervention_data = []

    let user = this.userService.currentUser();
    const currentUser = await user;
    let userCountryId = currentUser.country?.id;
    let sdgPriorities = await this.investorToolService.getSdgPrioritiesByCountryId(userCountryId);
    for (let pAssessment of pAssessments) {
      let _intervention = {
        id: pAssessment.assessment.climateAction.intervention_id,
        name: pAssessment.assessment.climateAction.policyName,
        tool: this.masterDataService.getToolName(pAssessment.assessment.tool),
        status: pAssessment.assessment.climateAction.projectStatus?.name
      }

      let data
      switch (pAssessment.assessment.tool) {
        case 'PORTFOLIO':
        case 'INVESTOR':
          data = await this.getAlignmentDataPortfolioInvestor(pAssessment.assessment, sdgPriorities, sdgs_score[pAssessment.assessment.id.toString()])
          break;
        case 'CARBON_MARKET':
          data = await this.getAlignmentDataCarbonMarket(pAssessment.assessment, cmScores, sdgPriorities)
          break;
      }
      intervention_data.push({ data: data, intervention: _intervention })
    }

    response.col_set_1 = [
      { label: "Intervention information", colspan: 4 }
    ]
    response.col_set_2 = [
      ...this.col_set_2,
    ]


    for (let int_data of intervention_data) {
      response.interventions.push({ ...int_data.intervention, ...int_data.data.response })
      response.col_set_2.push(...int_data.data.col2)
      response.col_set_1.push(...int_data.data.col1)
      sdgs.push(...int_data.data.sdgs)
    }

    sdgs = [...new Set(sdgs)]

    response.col_set_2 = response.col_set_2.reduce((uniqueArray, currentItem) => {
      const code = currentItem.code;
      if (!uniqueArray.some(item => item.code === code)) {
        uniqueArray.push(currentItem);
      }
      return uniqueArray;
    }, []);
    response.col_set_1 = response.col_set_1.reduce((uniqueArray, currentItem) => {
      const code = currentItem.label;
      if (!uniqueArray.some(item => item.label === code)) {
        uniqueArray.push(currentItem);
      }
      return uniqueArray;
    }, []);

    response.sdg_count = sdgs.length;

    return response;
  }

  async getProcessDataPortfolioInvestor(assessment: Assessment, piScores: any) {
    let categories = [];
    let cat_names = [];
    let cat_obj = {};
    let cat_total = 0;

    let res = piScores[assessment.id];
    let data = res.processData;

    for (let cat of data) {
      let obj = {};
      let characteristics = [];
      let ch_data = {};
      for await (let ch of cat.characteristicData) {
        characteristics.push({ label: ch.characteristic, code: ch.ch_code })
        ch_data[ch.ch_code] = ch.likelihood?.name
      }
      characteristics.push({ label: 'Category score', code: 'category_score' });
      ch_data['category_score'] = cat.category_score?.value;
      obj['characteristics'] = characteristics;
      obj['ch_data'] = ch_data;
      obj['characteristic_count'] = characteristics?.length;
      obj['col_set_1'] = { label: cat.category, colspan: characteristics?.length + 1 };
      cat_obj[cat.category] = cat.category_score?.value;
      cat_total += cat.category_score?.value;
      cat_names.push(cat.category);
      categories.push(obj);
    }
    cat_obj['category_score'] = res.processScore === null ? 'N/A' : res.processScore;

    return { categories: categories, cat_names: cat_names, category_scores: cat_obj };
  }

  async getOutcomeDataPortfolioInvestor(assessment: Assessment, piScores: any) {
    let sdgs_score: any = {}
    let res = piScores[assessment.id];
    let sdg = [];
    let outcome_score = 0;
    outcome_score = res.outcomeScore;
    let data = res.outcomeData;

    let scGHG = data.find(o => o.code === 'SCALE_GHG');
    let int = scGHG.characteristicData.find(o => o.ch_code === 'MACRO_LEVEL')?.score;
    let nat = scGHG.characteristicData.find(o => o.ch_code === 'MEDIUM_LEVEL')?.score;
    let sub = scGHG.characteristicData.find(o => o.ch_code === 'MICRO_LEVEL')?.score;

    let scale_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        international: this.mapNameAndValue(int?.name, int?.value),
        national: this.mapNameAndValue(nat?.name, nat?.value),
        subnational: this.mapNameAndValue(sub?.name, sub?.value),
        category_score: this.mapNameAndValue(scGHG.category_score?.name, scGHG.category_score?.value)
      }
    }

    let scSD = data.find(o => o.code === 'SCALE_SD');

    let scale_SDs = {};

    for (let sd of scSD.characteristicData) {
      let sd_code = (sd.name.replace(' ', '_'));
      sdg.push(sd_code);
      let international = sd.data.find(o => o.ch_code === 'MACRO_LEVEL').score;
      let national = sd.data.find(o => o.ch_code === 'MEDIUM_LEVEL').score;
      let subnational = sd.data.find(o => o.ch_code === 'MICRO_LEVEL').score;

      scale_SDs[sd_code] = {
        col_set_1: { label: 'Scale - ' + sd.name, colspan: 4 },
        data: {
          international: this.mapNameAndValue(international?.name, international?.value),
          national: this.mapNameAndValue(national?.name, national?.value),
          subnational: this.mapNameAndValue(subnational?.name, subnational?.value),
          category_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(sd.sdg_score), sd.sdg_score) 
        }
      }
      if (sdgs_score[sd.name]) sdgs_score[sd.name] += sd.sdg_score;
      else sdgs_score[sd.name] = sd.sdg_score;
    }

    let scAD = data.find(o => o.code === 'SCALE_ADAPTATION');

    int = scAD.characteristicData.find(o => o.ch_code === 'INTERNATIONAL')?.score;
    nat = scAD.characteristicData.find(o => o.ch_code === 'NATIONAL')?.score;
    sub = scAD.characteristicData.find(o => o.ch_code === 'SUBNATIONAL')?.score;

    let scale_adaptation = {
      col_set_1: { label: 'Adaptation', colspan: 4 },
      data: {
        international: this.mapNameAndValue(int?.name, int?.value),
        national: this.mapNameAndValue(nat?.name, nat?.value),
        subnational: this.mapNameAndValue(sub?.name, sub?.value),
        category_score: this.mapNameAndValue(scAD.category_score?.name, scAD.category_score?.value)
      }
    }

    let susGHG = data.find(o => o.code === 'SUSTAINED_GHG');

    let _long = susGHG.characteristicData.find(o => o.ch_code === 'LONG_TERM')?.score;
    let medium = susGHG.characteristicData.find(o => o.ch_code === 'MEDIUM_TERM')?.score;
    let short = susGHG.characteristicData.find(o => o.ch_code === 'SHORT_TERM')?.score;

    let sustained_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        long_term: this.mapNameAndValue(_long?.name, _long?.value),
        medium_term: this.mapNameAndValue(medium?.name, medium?.value),
        short_term: this.mapNameAndValue(short?.name, short?.value),
        category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susGHG.category_score?.value), susGHG.category_score?.value)
      }
    }

    let susSD = data.find(o => o.code === 'SUSTAINED_SD');

    let sustained_SDs = {};

    for (let sd of susSD.characteristicData) {
      let sd_code = (sd.name.replace(' ', '_'));
      let long_term = sd.data.find(o => o.ch_code === 'LONG_TERM').score;
      let medium_term = sd.data.find(o => o.ch_code === 'MEDIUM_TERM').score;
      let short_term = sd.data.find(o => o.ch_code === 'SHORT_TERM').score;

      sustained_SDs[sd_code] = {
        col_set_1: { label: 'Sustained - ' + sd.name, colspan: 4 },
        data: {
          long_term: this.mapNameAndValue(long_term.name, long_term.value),
          medium_term: this.mapNameAndValue(medium_term.name, medium_term.value),
          short_term: this.mapNameAndValue(short_term.name, short_term.value),
          category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(sd.sdg_score), sd.sdg_score)
        }
      }
      if (sdgs_score[sd.name]) sdgs_score[sd.name] += sd.sdg_score
      else sdgs_score[sd.name] = sd.sdg_score
    }

    let susAD = data.find(o => o.code === 'SUSTAINED_ADAPTATION');

    _long = susAD.characteristicData.find(o => o.ch_code === 'INTERNATIONAL')?.score;
    medium = susAD.characteristicData.find(o => o.ch_code === 'NATIONAL')?.score;
    short = susAD.characteristicData.find(o => o.ch_code === 'SUBNATIONAL')?.score;

    let sustained_adaptation = {
      col_set_1: { label: 'Adaptation', colspan: 4 },
      data: {
        long_term: this.mapNameAndValue(_long?.name, _long?.value),
        medium_term: this.mapNameAndValue(medium?.name, medium?.value),
        short_term: this.mapNameAndValue(short?.name, short?.value),
        category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susAD.category_score?.value), susAD.category_score?.value)
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
      outcome_score: outcome_score,
      sdgs_score: sdgs_score
    }
  }

  async getAlignmentDataPortfolioInvestor(assessment: Assessment, sdgPriorities: SdgPriority[], sdgs_score: any) {
  
    let response = {}
    let col1 = []
    let col2 = []
    let sdgsArr = []
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
      .where('assessment.id = :id', { id: assessment.id })

    let sdgs = await data.getMany();

    sdgs.map(sd => {
      let code = (sd.sdg?.name.replace(' ', '_'))
      let sdg_val = sdgs_score['SDG ' + sd.sdg?.number + ' - ' + sd.sdg?.name]
      let val = sdg_val === null ? null : Math.floor(sdg_val / 2)
      let ans = (this.mapNameAndValue(this.investorToolService.mapScaleScores(val), val))
      let priority_value = ans?.value
      if (sdgPriorities.length !== 0){
        let priority = sdgPriorities.find(o => o.sdg.id === sd.sdg.id) 
        let priority_name = this.masterDataService.sdg_priorities.find(o => o.code === priority.priority)?.name
        priority_value =  ans.value === null ? null : (4 - Math.abs(ans.value - priority.value))
        col2.push({label: priority_name, code: code}) 
      }
      response[code] = {name: ans?.name, value: priority_value}
      col1.push({label: 'SDG ' + sd.sdg.number + ' - ' + sd.sdg.name, colspan: 1})
      sdgsArr.push(sd.sdg.name)
    })
    return {
      response: response,
      col2: col2,
      col1: col1,
      sdgs: sdgsArr
    }
  }

  async getAggregationDataPortfolioTool(assessment: Assessment) {
    let result = await this.assessmentRepo.createQueryBuilder('asses')
      .leftJoinAndMapMany(
        'asses.investor_assessment',
        InvestorAssessment,
        'investor_assessment',
        'investor_assessment.assessment_id = asses.id'
      )
      .where('asses.id=:assessmentid  and investor_assessment.characteristic_id in (16,28)', { assessmentid: assessment.id })
      .getOne();
    let total = 0

    if (result.investor_assessment) {
      for (let investor of result.investor_assessment) {
        if (assessment.tool === 'INVESTOR') {
          investor.expected_ghg_mitigation_year ? total += Number(investor.expected_ghg_mitigation_year) : 0
        } else {
          investor.expected_ghg_mitigation ? total += Number(investor.expected_ghg_mitigation) : 0
        }
      }
    }

    return total
  }
  
  async getProcessDataCarbonMarket(assessment: Assessment, cmScores: any) {
    let data = (await this.cMAssessmentQuestionService.getProcessData(assessment.id)).data;
    let result = cmScores[assessment.id];
    let categories = [];
    let cat_names = [];
    let cat_obj = {};
    let cat_total = 0;
    for await (let cat of data) {
      let obj = {};
      let characteristics = [];
      let ch_data = {};
      for await (let ch of cat.characteristic) {
        characteristics.push({ label: ch.name, code: ch.code });
        ch_data[ch.code] = this.investorToolService.mapLikelihood(ch.ch_score);
      }
      characteristics.push({ label: 'Category score', code: 'category_score' });
      ch_data['category_score'] = cat.cat_score;
      obj['characteristics'] = characteristics;
      obj['ch_data'] = ch_data;
      obj['characteristic_count'] = characteristics.length;
      obj['col_set_1'] = { label: cat.name, colspan: characteristics.length + 1 };
      cat_obj[cat.name] = cat.cat_score;
      cat_total += cat.cat_score;
      cat_names.push(cat.name);
      categories.push(obj);
    }
    cat_obj['category_score'] = result.process_score === null ? 'N/A' : result.process_score

    return { categories: categories, cat_names: cat_names, category_scores: cat_obj }
  }

  async getOutcomeDataCarbonMarket(assessment: Assessment, cmScores: any) {
    let data = (await this.cMAssessmentQuestionService.getResults(assessment.id))?.outComeData;
    let result = cmScores[assessment.id];

    let scGHG_int = data.scale_GHGs.find(o => o.ch_code === 'MACRO_LEVEL')?.outcome_score;
    let scGHG_nat = data.scale_GHGs.find(o => o.ch_code === 'MEDIUM_LEVEL')?.outcome_score;
    let scGHG_sub = data.scale_GHGs.find(o => o.ch_code === 'MICRO_LEVEL')?.outcome_score;

    let scale_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        international: this.mapNameAndValue(this.investorToolService.mapScaleScores(scGHG_int),scGHG_int ),
        national: this.mapNameAndValue(this.investorToolService.mapScaleScores(scGHG_nat), scGHG_nat),
        subnational: this.mapNameAndValue(this.investorToolService.mapScaleScores(scGHG_sub), scGHG_sub),
        category_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(result.outcome_score?.scale_ghg_score), result.outcome_score?.scale_ghg_score)
      }
    }

    let sdg = this.cMAssessmentQuestionService.group(data.scale_SDs, 'SDG');

    let scale_SDs = {}
    let sdg_count = Object.keys(sdg).length;
    for (let sd of Object.keys(sdg)) {
      let international = data.scale_SDs.find(o => o.ch_code === 'MACRO_LEVEL' && o.SDG === sd)?.outcome_score;
      let national = data.scale_SDs.find(o => o.ch_code === 'MEDIUM_LEVEL' && o.SDG === sd)?.outcome_score;
      let subnational = data.scale_SDs.find(o => o.ch_code === 'MICRO_LEVEL' && o.SDG === sd)?.outcome_score;
      let cat_score = Math.floor((+international + +national + +subnational) / 3);
      scale_SDs[sd] = {
        col_set_1: { label: 'Scale - ' + sd, colspan: 4 },
        data: {
          international: this.mapNameAndValue(this.investorToolService.mapScaleScores(international), international),
          national: this.mapNameAndValue(this.investorToolService.mapScaleScores(national), national),
          subnational: this.mapNameAndValue(this.investorToolService.mapScaleScores(subnational), subnational),
          category_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(cat_score), cat_score)
        }
      }
    }


    let scAD_int = data.scale_adaptation.find(o => o.ch_code === 'INTERNATIONAL')?.outcome_score;
    let scAD_nat = data.scale_adaptation.find(o => o.ch_code === 'NATIONAL')?.outcome_score;
    let scAD_sub = data.scale_adaptation.find(o => o.ch_code === 'SUBNATIONAL')?.outcome_score;
    let scAD_cat_score = result.outcome_score?.scale_adaptation_score;

    let scale_adaptation = {
      col_set_1: { label: 'Adaptation', colspan: 4 },
      data: {
        international: this.mapNameAndValue(this.investorToolService.mapScaleScores(scAD_int), scAD_int),
        national: this.mapNameAndValue(this.investorToolService.mapScaleScores(scAD_nat), scAD_nat),
        subnational: this.mapNameAndValue(this.investorToolService.mapScaleScores(scAD_sub), scAD_sub),
        category_score: this.mapNameAndValue(this.investorToolService.mapScaleScores(scAD_cat_score), scAD_cat_score)
      }
    }


    let ssGHG_int = data.sustained_GHGs.find(o => o.ch_code === 'LONG_TERM')?.outcome_score;
    let ssGHG_nat = data.sustained_GHGs.find(o => o.ch_code === 'MEDIUM_TERM')?.outcome_score;
    let ssGHG_sub = data.sustained_GHGs.find(o => o.ch_code === 'SHORT_TERM')?.outcome_score;
    let ssGHG_cat_score = result.outcome_score?.sustained_ghg_score;

    let sustained_GHGs = {
      col_set_1: { label: 'GHG', colspan: 4 },
      data: {
        long_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(ssGHG_int), ssGHG_int),
        medium_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(ssGHG_nat), ssGHG_nat),
        short_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(ssGHG_sub), ssGHG_sub),
        category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(ssGHG_cat_score), ssGHG_cat_score)
      }
    }

    let sustained_SDs = {}
    for (let sd of Object.keys(sdg)) {
      let long_term = data.sustained_SDs.find(o => o.ch_code === 'LONG_TERM' && o.SDG === sd)?.outcome_score;
      let medium_term = data.sustained_SDs.find(o => o.ch_code === 'MEDIUM_TERM' && o.SDG === sd)?.outcome_score;
      let short_term = data.sustained_SDs.find(o => o.ch_code === 'SHORT_TERM' && o.SDG === sd)?.outcome_score;
      let cat_score = Math.floor((+long_term + +medium_term + +short_term) / 3);
      sustained_SDs[sd] = {
        col_set_1: { label: 'Sustained - ' + sd, colspan: 4 },
        data: {
          long_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(long_term), long_term),
          medium_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(medium_term), medium_term),
          short_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(short_term), short_term),
          category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(cat_score), cat_score)
        }
      }
    }

    let susAD_int = data.sustained_adaptation.find(o => o.ch_code === 'INTERNATIONAL')?.outcome_score;
    let susAD_nat = data.sustained_adaptation.find(o => o.ch_code === 'NATIONAL')?.outcome_score;
    let susAD_sub = data.sustained_adaptation.find(o => o.ch_code === 'SUBNATIONAL')?.outcome_score;
    let susAD_cat_score = result.outcome_score?.sustained_adaptation_score;

    let sustained_adaptation = {
      col_set_1: { label: 'Adaptation', colspan: 4 },
      data: {
        long_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susAD_int), susAD_int),
        medium_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susAD_nat), susAD_nat),
        short_term: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susAD_sub), susAD_sub),
        category_score: this.mapNameAndValue(this.investorToolService.mapSustainedScores(susAD_cat_score), susAD_cat_score)
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
      outcome_score: result.outcome_score?.outcome_score
    }

  }

  async getAggregationDataCarbonMarket(assessment: Assessment) {
    let result = await this.assessmentRepo.createQueryBuilder('assessment')
      .leftJoinAndSelect(
        'assessment.cmAssessmentDetails',
        'cm_assessment_detail',
        'cm_assessment_detail.cmassessmentId = assessment.id'
      )
      .where('assessment.id = :assessmentId', {assessmentId: assessment.id})
      .getOne()

      let total = 0

      if (result.cmAssessmentDetails[0]) {
        return result.cmAssessmentDetails[0].expected_ghg_mitigation;
      } else {
        return 0;
      }
  }


  async getAlignmentDataCarbonMarket(assessment: Assessment, cmScores: any, sdgPriorities: SdgPriority[]) {
    let response = {};
    let col1 = [];
    let col2 = [];
    let sdgsArr = [];
    let result = cmScores[assessment.id];
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
      .where('assessment.id = :id', { id: assessment.id })
    let sdgs = await data.getMany()

    sdgs.map(sd => {
      let code = (sd.sdg?.name.replace(' ', '_'))
      let val = result.outcome_score?.sdgs_score[sd.sdg.id];
      let sdg_val = val === null ? null : val;
      let ans = (this.mapNameAndValue(this.investorToolService.mapScaleScores(sdg_val), sdg_val));
      let priority_value = ans?.value;
      if (sdgPriorities.length !== 0){
        let priority = sdgPriorities.find(o => o.sdg.id === sd.sdg.id) 
        let priority_name = this.masterDataService.sdg_priorities.find(o => o.code === priority.priority)?.name
        priority_value = ans.value === null ? null : 4 - Math.abs(ans.value - priority.value)
        col2.push({label: priority_name, code: code}) 
      }
      response[code] = {name: ans?.name, value: priority_value}
      col1.push({label: 'SDG ' + sd.sdg?.number + ' - ' + sd.sdg?.name, colspan: 1})
      sdgsArr.push(sd.sdg?.name)
    })

    return {
      response: response,
      col2: col2,
      col1: col1,
      sdgs: sdgsArr
    }
  }


  async getDashboardData(portfolioID: number, options: IPaginationOptions, selectedAssessIds?:number[],allTool?:string, ): Promise<Pagination<any>> {
    let filter = ''
    let tool = 'PORTFOLIO';
    let user = this.userService.currentUser();
    const currentUser = await user;
    let userId = currentUser.id;
    let userCountryId = currentUser.country?.id;

    if (currentUser?.userType?.name === 'External') {
      if(filter){
        filter = filter + ' and asses.user_id=:userId '
      }else{
        filter = filter + '  asses.user_id=:userId '  
      }
      
    }
    else { if(filter){
      filter = filter + ' and country.id=:userCountryId '
    }else{
      filter = filter + ' country.id=:userCountryId '
    }
     
    }

    let data = this.assessmentRepo.createQueryBuilder('asses').innerJoinAndMapOne(
      'asses.result',
      Results,
      'result',
      'asses.id = result.assessment_id'
    )

    if (Number(portfolioID)) {

      filter = filter + 'and portfolio_assesmet.portfolio_id=:portfolioID'
      data.innerJoinAndMapOne(
        'asses.portfolio_assesmet',
        PortfolioAssessment,
        'portfolio_assesmet',
        'asses.id = portfolio_assesmet.assessment_id'
      )
    }
    if(allTool !='ALL_OPTION'){
      filter = filter + ' and asses.tool=:tool '
    }
    data.select(['asses.id','asses.tool','asses.from','asses.to', 'result.id', 'result.averageProcess','result.averageOutcome',])
      .leftJoinAndMapOne(
        'asses.climateAction',
        ClimateAction,
        'climateAction',
        'asses.climateAction_id = climateAction.id and not climateAction.status =-20'
      )
      .leftJoinAndMapOne(
        'climateAction.country',
        Country,
        'country',
        'climateAction.countryId = country.id'
      )
      if(selectedAssessIds && selectedAssessIds.length>0){
        data.andWhere('asses.id IN (:selectedAssessIds)',{selectedAssessIds:selectedAssessIds})
      }
      data.andWhere(filter, { tool, userId, userCountryId, portfolioID })
      .orderBy('asses.id','DESC')
      let allData = await data.getMany()
      let result = await paginate(data, options);
      return {
        items: result.items,
        meta: {
          totalItems: result.meta.totalItems,
          itemsPerPage: result.meta.itemsPerPage,
          totalPages: result.meta.totalPages,
          currentPage: result.meta.currentPage,
          allData: allData,
        } as any,
      };

  }

  mapNameAndValue(name, value){
    if (value === null || value === '-' || value === undefined || Number.isNaN(value)){
      return {name: '-', value: null}
    } else {
      return {name: ((value === 99 || value === -99 || value === '-99') ? '' : value + ' - ')  + name, value: ((value === 99 || value === -99 || value === '-99') ? null : value)}
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

  thousandSeperate(value: any, decimals: number){
    if ((value !== undefined)) {
      if (value === '-'){
        return value
      } else if (isNull(value)) {
        return '-'
      } else {
        return parseFloat(value.toFixed(decimals)).toLocaleString('en')
      }
    } else {
      return '-'
    }
  }
}
