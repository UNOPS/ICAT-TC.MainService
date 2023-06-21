import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Tool } from 'src/data-request/enum/tool.enum';

const schema = {
  'id': {
    prop: 'id',
    type: Number
  },
  'value': {
    prop: 'value',
    type: Number
  }
}

@Injectable()
export class InvestorToolService extends TypeOrmCrudService<InvestorTool>{

  constructor(
    @InjectRepository(InvestorTool) repo,
    @InjectRepository(ImpactCovered) private readonly impactCoveredRepo: Repository<ImpactCovered>,
    @InjectRepository(InvestorSector) private readonly investorSectorRepo: Repository<InvestorSector>,
    @InjectRepository(InvestorImpacts) private readonly investorImpactRepo: Repository<InvestorImpacts>,
    @InjectRepository(InvestorAssessment) private readonly investorAssessRepo: Repository<InvestorAssessment>,
    @InjectRepository(InvestorAssessment) private investorAssessmentRepo: Repository<InvestorAssessment>,
    @InjectRepository(Results) private readonly resultRepository: Repository<Results>,
    @InjectRepository(InvestorQuestions) private  investorQuestionRepo: Repository<InvestorQuestions>,
    @InjectRepository(IndicatorDetails) private readonly indicatorDetailsRepo: Repository<IndicatorDetails>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    @InjectRepository(Category) private readonly categotyRepository: Repository<Category>,
    @InjectRepository(ParameterRequest) private readonly dataRequestRepository: Repository<ParameterRequest>,

  ) {
    super(repo)
  }

  readXlsxFile = require('read-excel-file/node');


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
      let mitigation:number;
      for (let req of request) {
        for (let assess of req.data) {
          if(assess.expected_ghg_mitigation){
           mitigation =assess.expected_ghg_mitigation
           
          }
        }
      }

      for (let req of request) {
        for (let assess of req.data) {
  
          assess.category.id = req.categoryID;
          assess.type = req.type;
          assess.expected_ghg_mitigation=mitigation
          // assess.indicator_details=[]
          // if(assess.indicator_details){
          //   for (let detail of assess.indicator_details) {
          //     let obj4 = new InvestorAssessment()
          //     obj4.category = assess.category
          //     obj4.type = req.type
          //     obj4.characteristics = assess.characteristics
          //     obj4.relevance_weight = assess.relevance_weight
          //     obj4.description = assess.description
          //     obj4.starting_situation = assess.starting_situation
          //     obj4.likelihood_weight = assess.likelihood_weight
          //     obj4.institutionDescription = (detail.question)?detail.question.id.toString():''
          //     obj4.likelihood_justification = assess.likelihood_justification
          //     obj4.justification = assess.justification
          //     obj4.indicator = assess.indicator
          //     obj4.expected_ghg_mitigation=mitigation
          //     obj4.assessment = request[0].data[0].assessment
          //     let a = await this.investorAssessmentRepo.save(obj4)
              
          //     }
          //   }

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

    async createFinalAssessmentIndirect(request: any):Promise<any> {
      console.log("request",request)
      let tool:any;
      if(request[0].data[0].assessment.tool === 'Investment & Private Sector Tool'){
        tool =Tool.Investor_tool
      }
      else if(request[0].data[0].assessment.tool === 'Portfolio Tool'){
        tool=Tool.Portfolio_tool
      }
    
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
              obj1.assessment = request[0].data[0].assessment
              // let saved= new Promise
              let a = await this.investorAssessmentRepo.save(obj1).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
              
              

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
              obj2.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj2).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
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
              obj3.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj3).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
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
              obj4.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj4).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
              console.log("saved4")
            }
            if(assess.indicator_details){
              for (let detail of assess.indicator_details) {
               
                let obj4 = new InvestorAssessment()
                obj4.category = category
                obj4.type = req.type
                obj4.characteristics = assess.characteristics
                obj4.relevance_weight = assess.relevance_weight
                obj4.description = assess.description
                obj4.starting_situation = assess.starting_situation
                obj4.likelihood_weight = assess.likelihood_weight
                
                obj4.institutionDescription = (detail.question)?detail.question.id:''
                obj4.institution = detail.value
                obj4.likelihood_justification = assess.likelihood_justification
                obj4.justification = assess.justification
                obj4.indicator = assess.indicator
                obj4.assessment = request[0].data[0].assessment
                if( detail.value){
                  obj4.institution = detail.value
                let a = await this.investorAssessmentRepo.save(obj4).then(
                  async (asess) => {
                    let datarequestParameter= new ParameterRequest()
                    datarequestParameter.investmentParameter =asess;
                    datarequestParameter.tool =tool;
                    await this.dataRequestRepository.save(datarequestParameter)
                  })
                  console.log("=================",detail.value)
                }
                
                
               }
              }

              if(assess.expected_ghg_mitigation){
                let obj4 = new InvestorAssessment()
                obj4.category = category
                obj4.type = req.type
                obj4.characteristics = assess.characteristics
                obj4.relevance_weight = assess.relevance_weight
                obj4.description = assess.description
                obj4.starting_situation = assess.starting_situation
                obj4.likelihood_weight = assess.likelihood_weight
                obj4.institution = assess.expected_ghg_mitigation
                obj4.institutionDescription = 'expected_ghg_mitigation'
                obj4.likelihood_justification = assess.likelihood_justification
                obj4.justification = assess.justification
                obj4.indicator = assess.indicator
                obj4.assessment = request[0].data[0].assessment
                let a = await this.investorAssessmentRepo.save(obj4).then(
                  async (asess) => {
                    let datarequestParameter= new ParameterRequest()
                    datarequestParameter.investmentParameter =asess;
                    datarequestParameter.tool =tool;
                    await this.dataRequestRepository.save(datarequestParameter)
                  })
                console.log("savd mitigation action")
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
              obj1.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj1).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
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
              obj2.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj2).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
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
              obj3.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj3).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
              console.log("saved7")
            }
            if(assess.indicator_details){
              for (let detail of assess.indicator_details) {
               
                let obj4 = new InvestorAssessment()
                obj4.category = category
                obj4.type = req.type
                obj4.characteristics = assess.characteristics
                obj4.relevance_weight = assess.relevance_weight
                obj4.description = assess.description
                obj4.starting_situation = assess.starting_situation
                obj4.likelihood_weight = assess.likelihood_weight
                
                obj4.institutionDescription = (detail.question)?detail.question.id:''
                obj4.institution = detail.value
                obj4.likelihood_justification = assess.likelihood_justification
                obj4.justification = assess.justification
                obj4.indicator = assess.indicator
                obj4.assessment = request[0].data[0].assessment
                if( detail.value){
                  obj4.institution = detail.value
                let a = await this.investorAssessmentRepo.save(obj4).then(
                  async (asess) => {
                    let datarequestParameter= new ParameterRequest()
                    datarequestParameter.investmentParameter =asess;
                    datarequestParameter.tool =tool;
                    await this.dataRequestRepository.save(datarequestParameter)
                  })
                  console.log("=================",detail.value)
                }
                
                
               }
              }
            if(assess.expected_ghg_mitigation){
              let obj4 = new InvestorAssessment()
              obj4.category = category
              obj4.type = req.type
              obj4.characteristics = assess.characteristics
              obj4.institution = assess.expected_ghg_mitigation
              obj4.institutionDescription = 'expected_ghg_mitigation'
              obj4.indicator = assess.indicator
              obj4.assessment = request[0].data[0].assessment
              let a = await this.investorAssessmentRepo.save(obj4).then(
                async (asess) => {
                  let datarequestParameter= new ParameterRequest()
                  datarequestParameter.investmentParameter =asess;
                  datarequestParameter.tool =tool;
                  await this.dataRequestRepository.save(datarequestParameter)
                })
              console.log("savd mitigation action")
            }
          }
         
  
        }
  
      }
    //  let data = new Results ()
    //  data.assessment = request[0].data[0].assessment;
    //  await this.resultRepository.save(data);
      return 0
  
    }

    

    async  findSectorCount(tool:string): Promise<any[]> {
      console.log(tool)
      const sectorSum = await this.investorSectorRepo
        .createQueryBuilder('investorSector')
        .leftJoinAndSelect('investorSector.assessment', 'assessment')
        .where('assessment.tool = :value', { value: tool })
        .leftJoinAndSelect('investorSector.sector', 'sector')
        // .where('sector.name IS NOT NULL')
        .select('sector.name', 'sector')
        .addSelect('COUNT(investorSector.id)', 'count')
        .groupBy('sector.name')
        .having('sector IS NOT NULL')
        .getRawMany();
    
    return sectorSum;
    }

   async  getTCValueByAssessment(tool: string): Promise<any> {
        const sectorSum = await this.assessmentRepo
          .createQueryBuilder('assessment')
          .leftJoinAndSelect('assessment.climateAction', 'intervention')
          .where('assessment.tool = :value', { value: tool })
          .select(['assessment.id', 'intervention.id', 'intervention.initialInvestment','intervention.policyName','assessment.tc_value'])
          // // .where('sector.name IS NOT NULL')
          // .select('sector.name', 'sector')
          // .addSelect('COUNT(investorSector.id)', 'count')
          // .groupBy('sector.name')
          // .having('sector IS NOT NULL')
          .getMany();

        return sectorSum;
    }

    async calculateAssessmentResults(tool: string): Promise<any> {
      let results = await this.assessmentRepo
        .createQueryBuilder('assessment')
        .leftJoinAndSelect('assessment.climateAction', 'intervention')
        .where('assessment.tool = :value', { value: tool })
        .orderBy('assessment.id', 'DESC')
        .getMany();
      let finalDataArray:{
        assesment:Assessment,
        likelihood:number,
        relevance:number
        scaleScore:number,
        sustainedScore:number
      } []=[]

      // let finalOutcomeArray:{
      //   assesment:Assessment,
        
      // } []=[]
  
        for await  (let obj of  results) {
         let assessment= await this.findAllAssessData(obj.id);
         let categories =await this.findAllCategories();
        //  console.log(categories.meth1Process)
        let finalLikelihood=0
        let finalrelevance=0
        let scaleScoreTotal =0;
        let sustainedScoreTotal=0;
        let  categoryDataArray : any = []
            for(let category of categories.meth1Process){
           
              let categoryData: any = {
                categoryName: category.name ,
                characteristics: [],
                categotyRelevance : 0,
                categoryLikelihood : 0
              };
      
              let totalRel = 0
              let countRel = 0
              let totalLikelihood = 0
              let countLikelihood = 0
              for(let x of assessment ){
                if(category.name === x.category.name){
                  categoryData.categoryName = category.name;
                  categoryData.characteristics.push(
                    {
                      relevance:  x.relavance,
                      likelihood:  x.likelihood,
                      name : x.characteristics.name
                    }
                  )
                  totalRel = totalRel +  x.relavance
                  countRel ++
      
                  totalLikelihood = totalLikelihood + x.likelihood
                  countLikelihood ++
      
                }
              }
      
              categoryData.categotyRelevance = (totalRel/countRel).toFixed(3)
              categoryData.categoryLikelihood = (totalLikelihood/countLikelihood).toFixed(3)
              categoryDataArray.push(categoryData)
      
            }
            categoryDataArray.forEach((obj2) => {
              // console.log(obj.id,obj2.categotyRelevance,finalrelevance)
              // console.log(obj.id,obj2.categotyRelevance,":","finalrelevance",finalrelevance,obj2.categoryLikelihood,"finalLikelihood",finalLikelihood)
              finalrelevance  += Number(obj2.categotyRelevance);
              finalLikelihood += Number(obj2.categoryLikelihood);
              // console.log("========")
            });
           


            let  outcomeArray : any = []
            for(let category of categories.meth1Outcomes){
              let categoryData: any = {
                categoryName: category.name ,
                characteristics: [],
                categotyRelevance : 0,
                categoryLikelihood : 0,
                categoryScaleScore : 0,
                categorySustainedScore : 0
              };
      
              let totalScale = 0
              let countScale = 0
              let totalSustained = 0
              let countSustained = 0
              for(let x of assessment ){
                if(category.name === x.category.name && (x.category.name === 'Scale GHGs' || x.category.name === 'Scale SD' )){
                  categoryData.categoryName = category.name;
                  categoryData.characteristics.push(
                    {
                      
                      scaleScore : x.score,
                      sustainedScore : '-',
                      name : x.characteristics.name
                    }
                  )
      
                  totalScale = totalScale +  x.score
                  countScale ++
      
                }
                if(category.name === x.category.name && (x.category.name === 'Sustained nature-GHGs' || x.category.name === 'Sustained nature-SD' )){
                  categoryData.categoryName = category.name;
                  categoryData.characteristics.push(
                    {
                      scaleScore : '-',
                      sustainedScore : x.score,
                      name : x.characteristics.name
                    }
                  )
      
                  totalSustained = totalSustained +  x.score
                  countSustained ++
      
                }
              }
      
              if(category.name === 'Scale GHGs' || category.name === 'Scale SD' ){
                categoryData.categoryScaleScore = (totalScale/countScale).toFixed(3)
                categoryData.categorySustainedScore = '-'
              }
      
              if(category.name === 'Sustained nature-GHGs' || category.name === 'Sustained nature-SD'  ){
                categoryData.categorySustainedScore = (totalSustained/countSustained).toFixed(3)
                categoryData.categoryScaleScore  = '-'
              }
      
              outcomeArray.push(categoryData)
            }
           
            outcomeArray.forEach((obj3) => {
              // console.log(obj.id,obj3.categoryScaleScore,":","scaleScoreTotal",scaleScoreTotal,obj3.categorySustainedScore,"sustainedScoreTotal",sustainedScoreTotal)
              if (obj3.categoryScaleScore!=='-'){
                scaleScoreTotal += Number(obj3.categoryScaleScore);
              }
              if (obj3.categorySustainedScore!=='-'){ 
                sustainedScoreTotal += Number(obj3.categorySustainedScore);
              }
             
            });
            // console.log(scaleScoreTotal)
            finalDataArray.push({
              assesment: obj,
              likelihood: Math.round(finalLikelihood / 4),
              relevance: Math.round(finalrelevance / 4),
              scaleScore: Math.round(scaleScoreTotal / 2),
              sustainedScore: Math.round(sustainedScoreTotal / 2)
            });
            
            
        }

        
        return[ finalDataArray];
  
    }
    async findAllCategories(): Promise<any> {
      let categories = await this.categotyRepository.createQueryBuilder('category')
        .leftJoinAndSelect('category.methodology', 'methodology')
        .where('category.methodology_id = methodology.id')
        .getMany();
        // console.log("categoryList", categories)
       let meth1Process : any = []
        let  meth1Outcomes : any = []
        for (let x of categories) {
          //this.categotyList.push(x);
            if(x.type === 'process'){
              meth1Process.push(x)
            }
            if(x.type === 'outcome'){
              meth1Outcomes.push(x)
            }
        }
        return {meth1Process,meth1Outcomes}
      
    }

    async getInvestorQuestionById(id: number){
      return await (this.investorQuestionRepo.createQueryBuilder('qu').where('id = :id', {id:id})).getOne()
    }

    async updateInvestorAssessment(req: UpdateInvestorToolDto){
      try{
        let invest_assessment = await this.investorAssessmentRepo.findBy({id: req.id})
        if (invest_assessment){
          invest_assessment[0].parameter_value = req.parameter_value
          invest_assessment[0].enterDataAssumption = req.assumption
        }

        return await this.investorAssessmentRepo.update(invest_assessment[0].id, invest_assessment[0])
      } catch(error){
        console.log(error)
        return new InternalServerErrorException()
      }
    }

    async uplaodFileUpload(fileName: string) {
      this.readXlsxFile('./uploads/' + fileName, { schema }).then(({ rows, errors }) => {
        rows.forEach(async (key) => {
          let dataEnterItem = await this.investorAssessRepo.findOne({
            where: { id: key.id }
          })
  
          let dataStatusItem = await this.dataRequestRepository.find({
            where: { parameter: key.id }
          })
  
          dataStatusItem.forEach(async (e) => {
            if (e.dataRequestStatus === 4 || e.dataRequestStatus === 5 || e.dataRequestStatus === -8) {
              dataEnterItem.parameter_value = key.value
  
  
              let res = await this.investorAssessRepo.save(dataEnterItem);
              if (res) {
                e.dataRequestStatus = 5
                await this.dataRequestRepository.save(e)
              }
            }
          })
        });
      });
    }
    

}
