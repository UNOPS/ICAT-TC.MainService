import { ConsoleLogger, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { PortfolioSdg } from './entities/portfolio-sdg.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { SdgAssessment } from './entities/sdg-assessment.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
import { UsersService } from 'src/users/users.service';
import { MethodologyAssessmentService } from 'src/methodology-assessment/methodology-assessment.service';
import { User } from 'src/users/entity/user.entity';
import { Country } from 'src/country/entity/country.entity';
import { PortfolioQuestions } from './entities/portfolio-questions.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

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
    @InjectRepository(InvestorQuestions) private investorQuestionRepo: Repository<InvestorQuestions>,
    @InjectRepository(IndicatorDetails) private readonly indicatorDetailsRepo: Repository<IndicatorDetails>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    @InjectRepository(Category) private readonly categotyRepository: Repository<Category>,
    @InjectRepository(ParameterRequest) private readonly dataRequestRepository: Repository<ParameterRequest>,
    @InjectRepository(PortfolioSdg) private readonly portfolioSDgsRepo: Repository<PortfolioSdg>,
    @InjectRepository(SdgAssessment) private readonly sdgsRepo: Repository<SdgAssessment>,
    @InjectRepository(PolicySector) private readonly PolicySectorsRepo: Repository<PolicySector>,
    @InjectRepository(PortfolioQuestions) private readonly portfolioQuestionRepo: Repository<PortfolioQuestions>,

    private userService: UsersService,
    private methAssessService: MethodologyAssessmentService

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
      investor.investment_type = createInvestorToolDto.investortool?.investment_type;
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
        investorImpacts.name = impacts.name;
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

  async findAllSDGs(): Promise<PortfolioSdg[]> {
    return this.portfolioSDgsRepo.find()
  }

  async getResultByAssessment(assessmentId: number) {
    return await this.repo.findOne({
      where: { assessment: { id: assessmentId } },
      relations: ['assessment']
    })
  }

  async findAllSectorData(assessmentId: number) {
    return this.investorSectorRepo.find({
      relations: ['assessment', 'sector'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async findAllImpactCoverData(assessmentId: number) {
    return this.investorImpactRepo.find({
      relations: ['assessment'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async findAllAssessData(assessmentId: number) {
    return this.investorAssessRepo.find({
      relations: ['assessment', 'characteristics', 'category', 'portfolioSdg'],
      where: { assessment: { id: assessmentId } },
    });
  }



  async createFinalAssessment(request: FinalInvestorAssessmentDto[]): Promise<any> {
    console.log("....request", request)
    let mitigation: number;
    for (let req of request) {
      for (let assess of req.data) {
        if (assess.expected_ghg_mitigation) {
          mitigation = assess.expected_ghg_mitigation

        }
      }
    }

    for (let req of request) {
      for (let assess of req.data) {

        assess.category.id = req.categoryID;
        assess.type = req.type;
        assess.expected_ghg_mitigation = mitigation

        let port = new PortfolioSdg()
        port.id = 1

        assess.portfolioSdg = port
        let a = await this.investorAssessmentRepo.save(assess).then(
          async (x) => {
            for (let item of x.indicator_details) {
              if (item.value || item.justification) {
                // console.log("44444")
                // item.institution =new Institution()
                item.investorAssessment = x
                await this.indicatorDetailsRepo.save(item)
                console.log("saved", item.question.id, item.value, item.justification)

              }

            }
          })

        console.log("saved")

      }

    }
    let data = new Results()
    data.assessment = request[0].data[0].assessment;
    await this.resultRepository.save(data);
    return 0

  }

  /*  async createFinalAssessment(request2: FinalInvestorAssessmentDto[]): Promise<any> {
     let data2: any = request2;
     let request = data2.finalArray;
     console.log("request", request2);
     console.log("abcdee",  request[0].data[0].assessment)
   
     for (let req of request) {
       let vvv : InvestorAssessment[] = req.data
       for (let assess of vvv) { 
       //  console.log("assesss", assess);
   
         let iassess = new InvestorAssessment();
   
         
         // Set the values for the entity
 
        // let assess3 = new Assessment();
        // assess3.id = assess.assessment.id
        iassess.assessment = request[0].data[0].assessment
 
         let category = new Category();
         category.id =  req.categoryID
         iassess.type = req.type;
         iassess.category = category;
 
 
       //  iassess.assessment = assess3
         iassess.characteristics = assess.characteristics;
 
         let port = new PortfolioSdg()
         port.id = assess.portfolioSdg.id
 
         iassess.description = assess?.description;
         iassess.starting_situation = assess.starting_situation;
         iassess.relavance = assess.relavance;
         iassess.justification = assess.justification;
         iassess.likelihood = assess.likelihood;
         iassess.likelihood_justification = assess.likelihood_justification;
         iassess.relevance_weight = assess.relevance_weight;
         iassess.likelihood_weight = assess.likelihood_weight;
         iassess.score = assess.score;
         iassess.uploadedDocumentPath = assess.uploadedDocumentPath;
 
 
         iassess.indicator = assess.indicator;
         iassess.indicatorStartingVal = assess.indicatorStartingVal;
         iassess.indicatorExpectedVal = assess.indicatorExpectedVal;
         iassess.expected_ghg_mitigation = assess.expected_ghg_mitigation;
 
         let institution = new Institution();
         institution.id = 1
         iassess.institution = assess.institution;
         iassess.institutionDescription = assess.institutionDescription;
         iassess.parameter_value = assess.parameter_value;
         iassess.enterDataAssumption = assess.enterDataAssumption;
         iassess.indicator_details = assess.indicator_details;
         // Save the entity
 
         if( category.id != 6 && category.id != 8 ){
           let a = await this.investorAssessmentRepo.save(iassess).then(
             async (x) => {            
                 for(let item of x.indicator_details){
                   if(item.value || item.justification){
                     item.investorAssessment =x
                     await this.indicatorDetailsRepo.save(item)
                     console.log("saved",item.question.id, item.value,item.justification)
                   }
                 }
             })
 
 
           console.log("saved");
         }
         
       }
     }
 
     for (let req of data2.scaleSDGs) {
       for (let assess of req.data) {
       //  console.log("assesss", assess);
   
         let iassess = new InvestorAssessment();
   
         // Set the values for the entity
 
        // let assess3 = new Assessment();
        // assess3.id = assess.assessment.id
 
         let category = new Category();
         category.id =  req.categoryID
         iassess.type = req.type;
         iassess.category = category;
 
         iassess.assessment = request[0].data[0].assessment
         //iassess.assessment = assess3
         iassess.characteristics = assess.characteristics;
 
       //  console.log("xxxx",assess.portfolioSdg)
         if(assess.portfolioSdg.id){
           let port = new PortfolioSdg()
           port.id = assess.portfolioSdg.id
 
           iassess.portfolioSdg = port
         }
        
         iassess.description = assess?.description;
         iassess.starting_situation = assess.starting_situation;
         iassess.relavance = assess.relavance;
         iassess.justification = assess.justification;
         iassess.likelihood = assess.likelihood;
         iassess.likelihood_justification = assess.likelihood_justification;
         iassess.relevance_weight = assess.relevance_weight;
         iassess.likelihood_weight = assess.likelihood_weight;
         iassess.score = assess.score;
         iassess.uploadedDocumentPath = assess.uploadedDocumentPath;
 
         iassess.indicator = assess.indicator;
         iassess.indicatorStartingVal = assess.indicatorStartingVal;
         iassess.indicatorExpectedVal = assess.indicatorExpectedVal;
         iassess.expected_ghg_mitigation = assess.expected_ghg_mitigation;
 
         let institution = new Institution();
         institution.id = 1
         iassess.institution = assess.institution;
         iassess.institutionDescription = assess.institutionDescription;
         iassess.parameter_value = assess.parameter_value;
         iassess.enterDataAssumption = assess.enterDataAssumption;
   
         // Save the entity
         let a = await this.investorAssessmentRepo.save(iassess);
         console.log("saved");
       }
     }
 
     for (let req of data2.sustainedSDGs) {
       for (let assess of req.data) {
       //  console.log("assesss", assess);
   
         let iassess = new InvestorAssessment();
   
         // Set the values for the entity
 
         //let assess3 = new Assessment();
         //assess3.id = assess.assessment.id
 
         let category = new Category();
         category.id =  req.categoryID
         iassess.type = req.type;
         iassess.category = category;
 
         iassess.assessment = request[0].data[0].assessment
        // iassess.assessment = assess3
         iassess.characteristics = assess.characteristics;
     //    console.log("xxxx22",assess.portfolioSdg)
         if(assess.portfolioSdg.id){
           let port = new PortfolioSdg()
           port.id = assess.portfolioSdg.id
 
           iassess.portfolioSdg = port
         }
         iassess.description = assess?.description;
         iassess.starting_situation = assess.starting_situation;
         iassess.relavance = assess.relavance;
         iassess.justification = assess.justification;
         iassess.likelihood = assess.likelihood;
         iassess.likelihood_justification = assess.likelihood_justification;
         iassess.relevance_weight = assess.relevance_weight;
         iassess.likelihood_weight = assess.likelihood_weight;
         iassess.score = assess.score;
         iassess.uploadedDocumentPath = assess.uploadedDocumentPath;
 
         iassess.indicator = assess.indicator;
         iassess.indicatorStartingVal = assess.indicatorStartingVal;
         iassess.indicatorExpectedVal = assess.indicatorExpectedVal;
         iassess.expected_ghg_mitigation = assess.expected_ghg_mitigation;
 
         let institution = new Institution();
         institution.id = 1
         iassess.institution = assess.institution;
         iassess.institutionDescription = assess.institutionDescription;
         iassess.parameter_value = assess.parameter_value;
         iassess.enterDataAssumption = assess.enterDataAssumption;
   
         // Save the entity
         let a = await this.investorAssessmentRepo.save(iassess);
         console.log("saved");
       }
     }
   
   
     for(let item of data2.sdgs){
       let sdgs = new SdgAssessment()
       sdgs.assessment = request[0].data[0].assessment
       sdgs.sdg = item
       sdgs.answer = item.answer;
       await this.sdgsRepo.save(sdgs)
     }
     let data = new Results();
     data.assessment = request[0].data[0].assessment;
     await this.resultRepository.save(data);
     return 0;
   } */



  async createFinalAssessment2(request2: FinalInvestorAssessmentDto[]): Promise<any> {
    let data2: any = request2;
    let request = data2.finalArray;
    console.log("request", request2);
    console.log("abcdee", request[0].data[0].assessment)

    for (let req of request) {
      for (let assess of req.data) {
        //  console.log("assesss", assess);

        let iassess = new InvestorAssessment();

        // Set the values for the entity

        // let assess3 = new Assessment();
        // assess3.id = assess.assessment.id
        iassess.assessment = request[0].data[0].assessment

        let category = new Category();
        category.id = req.categoryID
        iassess.type = req.type;
        iassess.category = category;


        //  iassess.assessment = assess3
        iassess.characteristics = assess.characteristics;

        let port = new PortfolioSdg()
        port.id = assess.portfolioSdg.id

        iassess.description = assess?.description;
        iassess.starting_situation = assess.starting_situation;
        iassess.relavance = assess.relavance;
        iassess.justification = assess.justification;
        iassess.likelihood = assess.likelihood;
        iassess.likelihood_justification = assess.likelihood_justification;
        iassess.relevance_weight = assess.relevance_weight;
        iassess.likelihood_weight = assess.likelihood_weight;
        iassess.score = assess.score;
        iassess.uploadedDocumentPath = assess.uploadedDocumentPath;


        iassess.indicator = assess.indicator;
        iassess.indicatorStartingVal = assess.indicatorStartingVal;
        iassess.indicatorExpectedVal = assess.indicatorExpectedVal;
        iassess.expected_ghg_mitigation = assess.expected_ghg_mitigation;

        let institution = new Institution();
        institution.id = 1
        iassess.institution = assess.institution;
        iassess.institutionDescription = assess.institutionDescription;
        iassess.parameter_value = assess.parameter_value;
        iassess.enterDataAssumption = assess.enterDataAssumption;

        // Save the entity

        if (category.id != 6 && category.id != 8) {
          let a = await this.investorAssessmentRepo.save(iassess);
          console.log("saved");
        }

      }
    }

    for (let req of data2.scaleSDGs) {
      for (let assess of req.data) {
        //  console.log("assesss", assess);

        let iassess = new InvestorAssessment();

        // Set the values for the entity

        // let assess3 = new Assessment();
        // assess3.id = assess.assessment.id

        let category = new Category();
        category.id = req.categoryID
        iassess.type = req.type;
        iassess.category = category;

        iassess.assessment = request[0].data[0].assessment
        //iassess.assessment = assess3
        iassess.characteristics = assess.characteristics;

        //  console.log("xxxx",assess.portfolioSdg)
        if (assess.portfolioSdg.id) {
          let port = new PortfolioSdg()
          port.id = assess.portfolioSdg.id

          iassess.portfolioSdg = port
        }

        iassess.description = assess?.description;
        iassess.starting_situation = assess.starting_situation;
        iassess.relavance = assess.relavance;
        iassess.justification = assess.justification;
        iassess.likelihood = assess.likelihood;
        iassess.likelihood_justification = assess.likelihood_justification;
        iassess.relevance_weight = assess.relevance_weight;
        iassess.likelihood_weight = assess.likelihood_weight;
        iassess.score = assess.score;
        iassess.uploadedDocumentPath = assess.uploadedDocumentPath;

        iassess.indicator = assess.indicator;
        iassess.indicatorStartingVal = assess.indicatorStartingVal;
        iassess.indicatorExpectedVal = assess.indicatorExpectedVal;
        iassess.expected_ghg_mitigation = assess.expected_ghg_mitigation;

        let institution = new Institution();
        institution.id = 1
        iassess.institution = assess.institution;
        iassess.institutionDescription = assess.institutionDescription;
        iassess.parameter_value = assess.parameter_value;
        iassess.enterDataAssumption = assess.enterDataAssumption;

        // Save the entity
        let a = await this.investorAssessmentRepo.save(iassess);
        console.log("saved");
      }
    }

    for (let req of data2.sustainedSDGs) {
      for (let assess of req.data) {
        //  console.log("assesss", assess);

        let iassess = new InvestorAssessment();

        // Set the values for the entity

        //let assess3 = new Assessment();
        //assess3.id = assess.assessment.id

        let category = new Category();
        category.id = req.categoryID
        iassess.type = req.type;
        iassess.category = category;

        iassess.assessment = request[0].data[0].assessment
        // iassess.assessment = assess3
        iassess.characteristics = assess.characteristics;
        //    console.log("xxxx22",assess.portfolioSdg)
        if (assess.portfolioSdg.id) {
          let port = new PortfolioSdg()
          port.id = assess.portfolioSdg.id

          iassess.portfolioSdg = port
        }
        iassess.description = assess?.description;
        iassess.starting_situation = assess.starting_situation;
        iassess.relavance = assess.relavance;
        iassess.justification = assess.justification;
        iassess.likelihood = assess.likelihood;
        iassess.likelihood_justification = assess.likelihood_justification;
        iassess.relevance_weight = assess.relevance_weight;
        iassess.likelihood_weight = assess.likelihood_weight;
        iassess.score = assess.score;
        iassess.uploadedDocumentPath = assess.uploadedDocumentPath;

        iassess.indicator = assess.indicator;
        iassess.indicatorStartingVal = assess.indicatorStartingVal;
        iassess.indicatorExpectedVal = assess.indicatorExpectedVal;
        iassess.expected_ghg_mitigation = assess.expected_ghg_mitigation;

        let institution = new Institution();
        institution.id = 1
        iassess.institution = assess.institution;
        iassess.institutionDescription = assess.institutionDescription;
        iassess.parameter_value = assess.parameter_value;
        iassess.enterDataAssumption = assess.enterDataAssumption;

        // Save the entity
        let a = await this.investorAssessmentRepo.save(iassess);
        console.log("saved");
      }
    }


    for (let item of data2.sdgs) {
      let sdgs = new SdgAssessment()
      sdgs.assessment = request[0].data[0].assessment
      sdgs.sdg = item
      sdgs.answer = item.answer;
      await this.sdgsRepo.save(sdgs)
    }
    let data = new Results();
    data.assessment = request[0].data[0].assessment;
    await this.resultRepository.save(data);
    return 0;
  }




  async findAllIndicatorquestions(): Promise<InvestorQuestions[]> {
    return this.investorQuestionRepo.find()
  }

  async findAllPortfolioquestions(): Promise<PortfolioQuestions[]> {
    return this.portfolioQuestionRepo.find()
  }

  async createFinalAssessmentIndirect(request: any): Promise<any> {
    console.log("request", request)
    let tool: any;
    if (request[0].data[0].assessment.tool === 'Investment & Private Sector Tool') {
      tool = Tool.Investor_tool
    }
    else if (request[0].data[0].assessment.tool === 'Portfolio Tool') {
      tool = Tool.Portfolio_tool
    }

    for (let req of request) {
      for (let assess of req.data) {
        let category = new Category()
        category.id = req.categoryID
        if (req.type === 'process') {

          //  assess.category.id = req.categoryID;
          //  assess.type = req.type;

          if (assess.indicatorExpectedVal) {
            let obj1 = new InvestorAssessment()
            obj1.category = category
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })



            console.log("saved1")
          }
          if (assess.indicatorStartingVal) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("saved2")
          }
          if (assess.likelihood) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("saved3")
          }
          if (assess.relavance) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("saved4")
          }
          if (assess.indicator_details) {
            for (let detail of assess.indicator_details) {

              let obj4 = new InvestorAssessment()
              obj4.category = category
              obj4.type = req.type
              obj4.characteristics = assess.characteristics
              obj4.relevance_weight = assess.relevance_weight
              obj4.description = assess.description
              obj4.starting_situation = assess.starting_situation
              obj4.likelihood_weight = assess.likelihood_weight

              obj4.institutionDescription = (detail.question) ? detail.question.id : ''
              obj4.institution = detail.value
              obj4.likelihood_justification = assess.likelihood_justification
              obj4.justification = assess.justification
              obj4.indicator = assess.indicator
              obj4.assessment = request[0].data[0].assessment
              if (detail.value) {
                obj4.institution = detail.value
                let a = await this.investorAssessmentRepo.save(obj4).then(
                  async (asess) => {
                    let datarequestParameter = new ParameterRequest()
                    datarequestParameter.investmentParameter = asess;
                    datarequestParameter.tool = tool;
                    await this.dataRequestRepository.save(datarequestParameter)
                  })
                console.log("=================", detail.value)
              }


            }
          }

          if (assess.expected_ghg_mitigation) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("savd mitigation action")
          }

        }
        else if (req.type === 'outcome') {

          if (assess.indicatorExpectedVal) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("saved5")
          }
          if (assess.indicatorStartingVal) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("saved6")
          }

          if (assess.score) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
                await this.dataRequestRepository.save(datarequestParameter)
              })
            console.log("saved7")
          }
          if (assess.indicator_details) {
            for (let detail of assess.indicator_details) {

              let obj4 = new InvestorAssessment()
              obj4.category = category
              obj4.type = req.type
              obj4.characteristics = assess.characteristics
              obj4.relevance_weight = assess.relevance_weight
              obj4.description = assess.description
              obj4.starting_situation = assess.starting_situation
              obj4.likelihood_weight = assess.likelihood_weight

              obj4.institutionDescription = (detail.question) ? detail.question.id : ''
              obj4.institution = detail.value
              obj4.likelihood_justification = assess.likelihood_justification
              obj4.justification = assess.justification
              obj4.indicator = assess.indicator
              obj4.assessment = request[0].data[0].assessment
              if (detail.value) {
                obj4.institution = detail.value
                let a = await this.investorAssessmentRepo.save(obj4).then(
                  async (asess) => {
                    let datarequestParameter = new ParameterRequest()
                    datarequestParameter.investmentParameter = asess;
                    datarequestParameter.tool = tool;
                    await this.dataRequestRepository.save(datarequestParameter)
                  })
                console.log("=================", detail.value)
              }


            }
          }
          if (assess.expected_ghg_mitigation) {
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
                let datarequestParameter = new ParameterRequest()
                datarequestParameter.investmentParameter = asess;
                datarequestParameter.tool = tool;
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



  async findSectorCount(tool: string): Promise<any[]> {
    console.log(tool)
    let user = this.userService.currentUser();
    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';
    let data = await this.investorSectorRepo
      .createQueryBuilder('investorSector')
      .leftJoinAndSelect('investorSector.assessment', 'assessment')
      .leftJoinAndSelect('assessment.climateAction', 'intervention')
      .leftJoinAndMapOne(
        'assessment.user',
        User,
        'user',
        'user.id = assessment.user_id',
      )
      .leftJoinAndMapOne(
        'user.country',
        Country,
        'cntry',
        'cntry.id = user.countryId',
      )
      .where('assessment.tool = :value', { value: tool })

    if (isUserExternal) {
      data.andWhere('user.id = :userId', { userId: currentUser.id })

    }
    else {
      data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })

    }

    let result = await data
      .leftJoinAndSelect('investorSector.sector', 'sector')
      .select('sector.name', 'sector')
      .addSelect('COUNT(investorSector.id)', 'count')
      .groupBy('sector.name')
      .having('sector IS NOT NULL')
      .getRawMany();

    return result;
  }

  async getTCValueByAssessment(tool: string): Promise<any> {
    let user = this.userService.currentUser();
    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';
    let data = await this.assessmentRepo
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.climateAction', 'intervention')
      .leftJoinAndMapOne(
        'assessment.user',
        User,
        'user',
        'user.id = assessment.user_id',
      )
      .leftJoinAndMapOne(
        'user.country',
        Country,
        'cntry',
        'cntry.id = user.countryId',
      )
      .where('assessment.tool = :value', { value: tool })

    if (isUserExternal) {
      data.andWhere('user.id = :userId', { userId: currentUser.id })

    }
    else {
      data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })

    }

    let result = data.
      select(['assessment.id', 'intervention.id', 'intervention.initialInvestment', 'intervention.policyName', 'assessment.tc_value'])
      // // .where('sector.name IS NOT NULL')
      // .select('sector.name', 'sector')
      // .addSelect('COUNT(investorSector.id)', 'count')
      // .groupBy('sector.name')
      // .having('sector IS NOT NULL')
      .getMany();

    return result;
  }

  async getSectorCountByTool(tool: string): Promise<any> {
    const data = await this.methAssessService.getTCForTool(tool)
    const promises = data.map(async (item) => {
      const policySectors = await this.PolicySectorsRepo.find({
        where: { intervention: { id: item.intervention } },
        relations: ['sector'],
      });
      // console.log(item.intervention)
      return policySectors.map((policySector) => ({ sector: policySector.sector.name }));
    });
    const sectorsArrays = await Promise.all(promises);
    // console.log(sectorsArrays)
    const sectors = sectorsArrays.flat();

    return this.countSectors(sectors)
  }

  countSectors(array: any[]): { sector: string; count: number }[] {
    const sectorCounts: { [sector: string]: number } = {};
    array.reduce((accumulator, currentValue) => {
      const sectorName = currentValue.sector;
      if (!sectorCounts[sectorName]) {
        sectorCounts[sectorName] = 1;
      } else {
        sectorCounts[sectorName]++;
      }
      return accumulator;
    }, {});

    const result: { sector: string; count: number }[] = Object.keys(sectorCounts).map((sector) => {
      return { sector, count: sectorCounts[sector] };
    });

    return result;
  }

  async calculateAssessmentResults(tool: string): Promise<any> {



    let results = await this.assessmentRepo
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.climateAction', 'intervention')
      .leftJoinAndSelect('assessment.user', 'user')
      .leftJoinAndSelect('user.userType', 'userType')
      .leftJoinAndSelect('user.country', 'country')
      .leftJoinAndSelect('user.institution', 'institution')
      .where('assessment.tool = :value', { value: tool })
      .orderBy('assessment.id', 'DESC')
      .getMany();
    let finalDataArray: {
      assesment: Assessment,
      likelihood: number,
      relevance: number
      scaleScore: number,
      sustainedScore: number
    }[] = []

    // let finalOutcomeArray:{
    //   assesment:Assessment,

    // } []=[]

    for await (let obj of results) {
      let assessment = await this.findAllAssessData(obj.id);
      let categories = await this.findAllCategories();
      //  console.log(categories.meth1Process)
      let finalLikelihood = 0
      let finalrelevance = 0
      let scaleScoreTotal = 0;
      let sustainedScoreTotal = 0;
      let categoryDataArray: any = []
      for (let category of categories.meth1Process) {

        let categoryData: any = {
          categoryName: category.name,
          characteristics: [],
          categotyRelevance: 0,
          categoryLikelihood: 0
        };

        let totalRel = 0
        let countRel = 0
        let totalLikelihood = 0
        let countLikelihood = 0
        for (let x of assessment) {
          if (category.name === x.category.name) {
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                relevance: x.relavance,
                likelihood: x.likelihood,
                name: x.characteristics.name
              }
            )
            totalRel = totalRel + x.relavance
            countRel++

            totalLikelihood = totalLikelihood + x.likelihood
            countLikelihood++

          }
        }

        categoryData.categotyRelevance = (totalRel / countRel).toFixed(3)
        categoryData.categoryLikelihood = (totalLikelihood / countLikelihood).toFixed(3)
        categoryDataArray.push(categoryData)

      }
      categoryDataArray.forEach((obj2) => {
        // console.log(obj.id,obj2.categotyRelevance,finalrelevance)
        // console.log(obj.id,obj2.categotyRelevance,":","finalrelevance",finalrelevance,obj2.categoryLikelihood,"finalLikelihood",finalLikelihood)
        finalrelevance += Number(obj2.categotyRelevance);
        finalLikelihood += Number(obj2.categoryLikelihood);
        // console.log("========")
      });



      let outcomeArray: any = []
      for (let category of categories.meth1Outcomes) {
        let categoryData: any = {
          categoryName: category.name,
          characteristics: [],
          categotyRelevance: 0,
          categoryLikelihood: 0,
          categoryScaleScore: 0,
          categorySustainedScore: 0
        };

        let totalScale = 0
        let countScale = 0
        let totalSustained = 0
        let countSustained = 0
        for (let x of assessment) {
          if (category.name === x.category.name && (x.category.name === 'Scale GHGs' || x.category.name === 'Scale SD')) {
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {

                scaleScore: x.score,
                sustainedScore: '-',
                name: x.characteristics.name
              }
            )

            totalScale = totalScale + x.score
            countScale++

          }
          if (category.name === x.category.name && (x.category.name === 'Sustained nature-GHGs' || x.category.name === 'Sustained nature-SD')) {
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                scaleScore: '-',
                sustainedScore: x.score,
                name: x.characteristics.name
              }
            )

            totalSustained = totalSustained + x.score
            countSustained++

          }
        }

        if (category.name === 'Scale GHGs' || category.name === 'Scale SD') {
          categoryData.categoryScaleScore = (totalScale / countScale).toFixed(3)
          categoryData.categorySustainedScore = '-'
        }

        if (category.name === 'Sustained nature-GHGs' || category.name === 'Sustained nature-SD') {
          categoryData.categorySustainedScore = (totalSustained / countSustained).toFixed(3)
          categoryData.categoryScaleScore = '-'
        }

        outcomeArray.push(categoryData)
      }

      outcomeArray.forEach((obj3) => {
        // console.log(obj.id,obj3.categoryScaleScore,":","scaleScoreTotal",scaleScoreTotal,obj3.categorySustainedScore,"sustainedScoreTotal",sustainedScoreTotal)
        if (obj3.categoryScaleScore !== '-') {
          scaleScoreTotal += Number(obj3.categoryScaleScore);
        }
        if (obj3.categorySustainedScore !== '-') {
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

    /* //////////////////////////////////////// */
    let user = this.userService.currentUser();
    // console.log("ussssser : ",(await user).fullname, "and ", (await user).username, "Id :", (await user).id , "user Type", (await user)?.userType?.name, "country ID :", (await user)?.country?.id)

    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';

    let finalDataArray2 = []

    for (const x of await finalDataArray) {
      const isSameUser = x.assesment?.user?.id === currentUser?.id;
      const isMatchingCountry = x.assesment?.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.assesment?.user?.userType?.name !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        finalDataArray2.push(x);
      }
    }

    /* //////////////////////////////////////// */
    return [finalDataArray2];

  }

  async calculateNewAssessmentResults(assesId: number): Promise<any> {


    let characteristicData: {
      characteristic: string,
      relevance: { name: string, value: number },
      likelihood: { name: string, value: number },
      char_weight: number,
      recalculated_char_weight: number;
      isCalulate: boolean;
    } = {
      characteristic: '',
      relevance: {
        name: '',
        value: 0
      },
      likelihood: {
        name: '',
        value: 0
      },
      char_weight: 0,
      recalculated_char_weight: 0,
      isCalulate: false
    }

    let processCategoryData: {
      category: string,
      category_score: { name: string, value: number },
      category_weight: number;
      recalculated_category_weight: number;
      characteristicData: typeof characteristicData[]

    } = {
      category: '',
      category_score: {
        name: '',
        value: 0
      },
      category_weight: 0,
      recalculated_category_weight: 0,
      characteristicData: []
    }
    let outcomeCharateristics: {
      characteristic: string,
      score: { name: string, value: number },
      isCalulate: boolean;
      sdg: string;
    } = {
      characteristic: '',
      score: {
        name: '',
        value: 0
      },
      isCalulate: false,
      sdg: ''
    }
    let outcomeCategoryData: {
      category: string,
      category_score: { name: string, value: number },
      category_weight: number,
      isSDG: Boolean,
      characteristicData: any[]

    }
    let finalProcessDataArray: {
      processData: typeof processCategoryData[],
      outcomeData: typeof outcomeCategoryData[]
      processScore: number,
      outcomeScore: number,
    } = {
      processData: [],
      processScore: 0,
      outcomeScore: 0,
      outcomeData: []
    }

    let assessment = await this.findAllAssessData(assesId);
    let categories = await this.findAllCategories();
    //  console.log(categories.meth1Process)
    let categoryDataArray: typeof processCategoryData[] = []
    //Creating objects
    for (let category of categories.meth1Process) {

      let categoryData: typeof processCategoryData = {
        category: category.name,
        category_score: {
          name: '',
          value: undefined
        },
        category_weight: undefined,
        recalculated_category_weight: undefined,
        characteristicData: [],
      };
      for (let x of assessment) {
        if (category.name === x.category.name) {
          categoryData.category = category.name;
          // console.log(category.ip_weight)
          categoryData.category_weight = category.ip_weight
          categoryData.characteristicData.push(
            {
              relevance: { name: this.mapRelevance(x?.relavance), value: x?.relavance },
              likelihood: { name: this.mapLikelihood(x?.likelihood), value: x?.likelihood },
              characteristic: x.characteristics.name,
              char_weight: x.characteristics.ip_weight,
              recalculated_char_weight: x.relavance, // for now
              isCalulate: (x.relavance == 0 || !x.relavance) ? false : true,
            }

          )
        }
      }
      categoryDataArray.push(categoryData)

    }
    //Assigning values 
    let total_cat_weight = 0;
    let process_score = 0;
    for (let category of categoryDataArray) {
      let total_char_weight = 0
      let cat_score = 0
      category.characteristicData.map(item => (item.isCalulate ? (total_char_weight += item.recalculated_char_weight) : total_char_weight))
      // console.log(category.category,"total_char_weight",total_char_weight)
      for (let char of category.characteristicData) {
        if (char.isCalulate) {
          // console.log(char.characteristic,char.recalculated_char_weight)
          char.recalculated_char_weight = Math.floor(100 * (char.recalculated_char_weight / total_char_weight));
          if (!isNaN(char.likelihood.value)) {
            cat_score += Math.floor(char.recalculated_char_weight * char.likelihood.value) //rounddown
          }

          // console.log(category.category,"---cat_score",cat_score)
        }
        else {
          char.recalculated_char_weight = 0
        }

      }
      ;
      if (category.characteristicData.every(element => element.isCalulate === false)) {
        category.category_score = { name: "-", value: null }
      }
      else {
        category.category_score = { name: this.mapLikelihood(Math.floor(cat_score / 100)), value: Math.floor(cat_score / 100) }; //round down
        total_cat_weight += category.category_weight;
      }

    }
    // console.log("total_cat_weight",total_cat_weight)
    categoryDataArray.map(item => {
      if (item.category_score.value == null) {
        item.recalculated_category_weight = 0
      }
      else {
        item.recalculated_category_weight = Math.round(item.category_weight / total_cat_weight * 100);
        // console.log(item.recalculated_category_weight)
        process_score += item.recalculated_category_weight * item.category_score.value;
      }
    })
    finalProcessDataArray.processData = categoryDataArray;
    finalProcessDataArray.processScore = Math.floor(process_score / 100);

    // outcome..............
    let total_outcome_cat_weight = 0
    let outcomeArray: typeof outcomeCategoryData[] = []
    for (let category of categories.meth1Outcomes) {
      // let sdg
      let categoryData: typeof outcomeCategoryData = {
        category: category.name,
        category_score: {
          name: '',
          value: undefined
        },
        category_weight: undefined,
        characteristicData: [],
        isSDG: false,
      };
      for (let x of assessment) {
        if (category.name === x.category.name) {
          categoryData.category = category.name;
          // console.log(category.ip_weight)
          categoryData.category_weight = category.ip_weight;
          categoryData.isSDG = (category.code == 'SCALE_SD' || category.code == 'SUSTAINED_SD') ? (true) : (false)
          let isSutained: boolean = (category.code == 'SUSTAINED_GHG' || category.code == 'SUSTAINED_ADAPTATION') ? (true) : (false)
          categoryData.characteristicData.push(
            {
              score: { name: (isSutained) ? (this.mapSustaineScores(x?.score)) : (this.mapSustaineScores(x?.score)), value: x?.score },
              characteristic: x.characteristics.name,
              isCalulate: (x.score == null) ? false : true,
              sdg: (categoryData.isSDG) ? (x?.portfolioSdg?.name) : ''
            }
          )
        }
      }
      outcomeArray.push(categoryData)

    }
    for (let category of outcomeArray) {
      let total_char = 0
      let cat_score = 0
      // console.log(category.category,"total_char_weight",total_char_weight)
      if (category.isSDG) {
        const categorizedData: any = {};
        category.characteristicData.forEach(item => {
          const sdg = item.sdg;
          if (!categorizedData[sdg]) {
            categorizedData[sdg] = [];
          }
          categorizedData[sdg].push(item);
        });
        const categorizedDataArray = Object.entries(categorizedData).map(([sdg, data]) => ({
          name: sdg,
          sdg_score: 0,
          data: data,

        }));
        category.characteristicData = categorizedDataArray;
        let sdg_count = 0
        let total_sdg_score = 0
        for (let char of category.characteristicData) {
          let sdg_total_char = 0
          let sdg_cat_score = 0
          for (let sdg of char.data) {
            if (sdg.isCalulate) {
              sdg_cat_score += sdg.score.value;
              sdg_total_char++;
            }
            else {
              sdg_total_char = sdg_total_char
            }
          }
          if (char.data.every(element => element.isCalulate === false)) {
            char.sdg_score = { name: "-", value: null }
          }
          else {
            char.sdg_score = Math.floor(sdg_cat_score / sdg_total_char); //round down
            sdg_count++
            total_sdg_score += char.sdg_score;
          }
        }
        if (sdg_count != 0) {
          category.category_score = { name: this.mapSustaineScores(Math.floor(total_sdg_score / sdg_count)), value: Math.floor(total_sdg_score / sdg_count) }; //round down
          total_outcome_cat_weight += category.category_weight * category.category_score.value;
          console.log(category.category, category.category_weight * category.category_score.value)
        }


      }
      else {
        for (let char of category.characteristicData) {
          if (char.isCalulate) {
            cat_score += char.score.value;
            total_char++;
          }
          else {
            total_char = total_char
          }

        }
        if (category.characteristicData.every(element => element.isCalulate === false)) {
          category.category_score = { name: "-", value: null }
        }
        else {
          category.category_score = { name: this.mapSustaineScores(Math.floor(cat_score / total_char)), value: Math.floor(cat_score / total_char) }; //round down
          total_outcome_cat_weight += category.category_weight * category.category_score.value;
          console.log(category.category, category.category_weight * category.category_score.value)
        }
      }
    }
    finalProcessDataArray.outcomeData = outcomeArray;
    finalProcessDataArray.outcomeScore = Math.floor(total_outcome_cat_weight / 100)

    return finalProcessDataArray;
  }
  async findAllCategories(): Promise<any> {
    let categories = await this.categotyRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.methodology', 'methodology')
      .where('category.methodology_id = methodology.id')
      .getMany();
    // console.log("categoryList", categories)
    let meth1Process: any = []
    let meth1Outcomes: any = []
    for (let x of categories) {
      //this.categotyList.push(x);
      if (x.type === 'process') {
        meth1Process.push(x)
      }
      if (x.type === 'outcome') {
        meth1Outcomes.push(x)
      }
    }
    return { meth1Process, meth1Outcomes }

  }

  async getInvestorQuestionById(id: number) {
    return await (this.investorQuestionRepo.createQueryBuilder('qu').where('id = :id', { id: id })).getOne()
  }

  async updateInvestorAssessment(req: UpdateInvestorToolDto) {
    try {
      let invest_assessment = await this.investorAssessmentRepo.findBy({ id: req.id })
      if (invest_assessment) {
        invest_assessment[0].parameter_value = req.parameter_value
        invest_assessment[0].enterDataAssumption = req.assumption
      }

      return await this.investorAssessmentRepo.update(invest_assessment[0].id, invest_assessment[0])
    } catch (error) {
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


  async findSDGs(assessmentId: number): Promise<SdgAssessment[]> {
    return this.sdgsRepo.find({
      where: { assessment: { id: assessmentId } },
    });
  }
  async sdgSumCalculate(): Promise<any[]> {





    const sectorSum = await this.assessmentRepo
      .createQueryBuilder('assesment')
      .leftJoinAndMapMany(
        'assesment.sdgasses',
        SdgAssessment,
        'sdgasses',
        `assesment.id = sdgasses.assessmentId`,
      )
      .leftJoinAndMapOne(
        'sdgasses.sdg',
        PortfolioSdg,
        'sdg',
        `sdgasses.sdgId = sdg.id`,
      )
      .where('assesment.tool="Investment & Private Sector Tool"')
      .select('sdg.name', 'sdg')
      .addSelect('COUNT(sdgasses.id)', 'count')
      .groupBy('sdg.name')
      .having('sdg IS NOT NULL')
      .getRawMany();
    console.log("sectorSum", sectorSum)
    return sectorSum;
  }
  async getDashboardData(options: IPaginationOptions): Promise<Pagination<any>> {
    let tool = 'Investment & Private Sector Tool';
    let filter = 'asses.tool=:tool '
    let user = this.userService.currentUser();
    const currentUser = await user;
    let userId = currentUser.id;
    let userCountryId = currentUser.country?.id;
    console.log(userId, userCountryId)
    if (currentUser?.userType?.name === 'External') {
      filter = filter + ' and asses.user_id=:userId '

    }
    else {
      filter = filter + ' and country.id=:userCountryId '
    }

    const data = this.assessmentRepo.createQueryBuilder('asses')
      .select(['asses.id', 'asses.process_score', 'asses.outcome_score'])
      .leftJoinAndMapOne(
        'asses.climateAction',
        ClimateAction,
        'climateAction',
        'asses.climateAction_id = climateAction.id'
      )
      .leftJoinAndMapOne(
        'climateAction.country',
        Country,
        'country',
        'climateAction.countryId = country.id'
      ).where(filter, { tool, userId, userCountryId })
    let result = await paginate(data, options);
    return result;
  }

  mapRelevance(value: number) {
    switch (value) {
      case 0:
        return 'Not relevant';
      case 1:
        return 'Possibly relvant';
      case 2:
        return 'Relevant';
    }
  }

  mapLikelihood(value: number) {
    switch (value) {
      case 0:
        return 'Very unlikely (0-10%)';
      case 1:
        return 'Unlikely (10-33%)';
      case 2:
        return 'Possible (33-66%)';
      case 3:
        return 'Likely (60-90%)';
      case 4:
        return 'Very likely (90-100%)';
    }
  }

  mapSustaineScores(value: number) {
    switch (value) {
      case -1:
        return 'Minor Negative';
      case -2:
        return 'Moderate Negative';
      case -3:
        return 'Major Negative';
      case 0:
        return 'None';
      case 1:
        return 'Minor';
      case 2:
        return 'Moderate';
      case 3:
        return 'Major';

    }
  }

  mapSustainedScores(value: number) {
    switch (value) {
      case -1:
        return 'Unlikely (0-10%)';
      case 0:
        return 'Less likely (10-33%)';
      case 1:
        return 'Possible (33-66%)';
      case 2:
        return 'Likely (60-90%)';
      case 3:
        return 'Very likely (90-100%)';
    }
  }
}