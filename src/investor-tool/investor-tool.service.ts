import { ConsoleLogger, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { FinalInvestorAssessmentDto, ToolsMultiselectDto } from './dto/final-investor-assessment.dto';
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
import { GeographicalAreasCovered } from './entities/geographical-areas-covered.entity';
import { MasterDataService } from 'src/shared/entities/master-data.service';
import { SdgPriority } from './entities/sdg-priority.entity';
import { ProcessData, ProcessData2, ProcessDataDto } from './dto/processData.dto';
import { TotalInvestment } from './entities/total-investment.entity';

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
    @InjectRepository(GeographicalAreasCovered) private readonly geographicalAreaRepo: Repository<GeographicalAreasCovered>,
    @InjectRepository(SdgPriority) private readonly sdgPriorityRepo: Repository<SdgPriority>,
    @InjectRepository(TotalInvestment) private readonly totalInvestmentRepo: Repository<TotalInvestment>,
    private userService: UsersService,
    private methAssessService: MethodologyAssessmentService,
    private masterDataService: MasterDataService

  ) {
    super(repo)
  }

  readXlsxFile = require('read-excel-file/node');


  async createinvestorToolAssessment(createInvestorToolDto: CreateInvestorToolDto): Promise<any> {

    if (createInvestorToolDto.investortool) {
      let assessment = createInvestorToolDto.investortool.assessment;
      // console.log("investor......", createInvestorToolDto.investortool.level_of_implemetation)
      let investor = new InvestorTool();
      investor.assessment = assessment;
      // investor.geographical_areas_covered = createInvestorToolDto.investortool.geographical_areas_covered;
      investor.level_of_implemetation = createInvestorToolDto.investortool.level_of_implemetation;
      investor.national_country = createInvestorToolDto.investortool?.national_country;
      investor.subnational_region = createInvestorToolDto.investortool?.subnational_region;
      investor.investment_type = createInvestorToolDto.investortool?.investment_type;
      investor.total_investment = createInvestorToolDto.investortool?.total_investment
      let result = await this.repo.save(investor)
      // console.log("result", result)
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
      for await (let area of createInvestorToolDto.geographicalAreas) {
        let _area = new GeographicalAreasCovered()
        _area.assessment = assessment
        _area.investorTool = result
        _area.name = area.name
        _area.code = area.code
        let areas = await this.geographicalAreaRepo.save(_area)
      }
      // console.log("created investor tool,", createInvestorToolDto)
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
      relations: ['assessment', 'total_investements']
    })
  }

  async findAllSectorData(assessmentId: number) {
    return this.investorSectorRepo.find({
      relations: ['assessment', 'sector'],
      where: { assessment: { id: assessmentId } },
    });
  }

  async findAllGeographicalAreaData(assessmentId: number) {
    return this.geographicalAreaRepo.find({
      relations: ['assessment'],
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
  async getIndicatorDetials(investorAssessmentId: number) {
    return this.indicatorDetailsRepo.find({
      relations: ['question'],
      where: { investorAssessment: { id: investorAssessmentId } },
    });
  }


  // async createFinalAssessment(request: FinalInvestorAssessmentDto[]): Promise<any> {
  //   console.log("....request", request)
  //   let mitigation: number;
  //   for (let req of request) {
  //     for (let assess of req.data) {
  //       if (assess.expected_ghg_mitigation) {
  //         mitigation = assess.expected_ghg_mitigation

  //       }
  //     }
  //   }

  //   for (let req of request) {
  //     for (let assess of req.data) {

  //       assess.category.id = req.categoryID;
  //       assess.type = req.type;
  //       assess.expected_ghg_mitigation = mitigation

  //       let port = new PortfolioSdg()
  //       port.id = 1

  //       assess.portfolioSdg = port
  //       let a = await this.investorAssessmentRepo.save(assess).then(
  //         async (x) => {
  //           for (let item of x.indicator_details) {
  //             if (item.value || item.justification) {
  //               // console.log("44444")
  //               // item.institution =new Institution()
  //               item.investorAssessment = x
  //               await this.indicatorDetailsRepo.save(item)
  //               console.log("saved", item.question.id, item.value, item.justification)

  //             }

  //           }
  //         })

  //       console.log("saved")

  //     }

  //   }
  //   let data = new Results()
  //   data.assessment = request[0].data[0].assessment;
  //   await this.resultRepository.save(data);
  //   return 0

  // }

    async createFinalAssessment(request2: FinalInvestorAssessmentDto[]): Promise<any> {
     let data2: any = request2;
     let request = data2.finalArray;
     let assessment = request[0].data[0].assessment
    //  console.log("request", request2);
     console.log("assessID",  assessment.id)
    console.log("isEdit", data2.isEdit,"isDraft",data2.isDraft);
     for (let req of request) {
       let vvv : InvestorAssessment[] = req.data
       for (let assess of vvv) { 
         let iassess = new InvestorAssessment();
        iassess.assessment = request[0].data[0].assessment
 
         let category = new Category();
         category.id =  req.categoryID
         iassess.type = req.type;
         iassess.category = category;
 
 
       //  iassess.assessment = assess3
         iassess.characteristics = assess.characteristics;
 
         let port = new PortfolioSdg()
         port.id = assess.portfolioSdg?.id
 
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
 
         if( category.id != 6 && category.id != 8 && data2.isEdit==false){
           let a = await this.investorAssessmentRepo.save(iassess).then(
             async (x) => {            
                 for(let item of x.indicator_details){
                  //  if(item.value || item.justification){
                     item.investorAssessment =x
                     await this.indicatorDetailsRepo.save(item)
                    //  console.log("saved",item.question.id, item.value,item.justification)
                  //  }
                 }
             })
 
 
           console.log("saved");
          }
          //update
          if( category.id != 6 && category.id != 8 && category.id != 5 && category.id != 7  && category.id != 9 && category.id != 10  && data2.isEdit==true ){
            let a = await this.investorAssessmentRepo.save(assess)
             .then(
              async (x) => {            
                  for(let item of x.indicator_details){
                    // if(item.value || item.justification){
                      item.investorAssessment =x
                      await this.indicatorDetailsRepo.save(item)
                     //  console.log("saved",item.question.id, item.value,item.justification)
                    // }
                  }
              })
            console.log("updated1: categoryID",category.id);
           }

           if( category.id != 6 && category.id != 8 && category.id != 1 && category.id != 2  && category.id != 3 && category.id != 4  && data2.isEdit==true ){
            let a = await this.investorAssessmentRepo.save(assess)
            console.log("updated2 : categoryID",category.id  );
           }
           
         
       }
     }

    const assessmentIdToDelete = request[0].data[0].assessment.id;
    const categoryIDsToDelete = [6, 8]; // Add the category IDs you want to delete

    // Step 2: Delete rows that match the specified conditions
    await this.investorAssessmentRepo
      .createQueryBuilder()
      .delete()
      .from(InvestorAssessment)
      .where("assessment_id = :assessmentIdToDelete", { assessmentIdToDelete })
      .andWhere("category_id IN (:...categoryIDsToDelete)", { categoryIDsToDelete })
      .execute();

     if(data2.scaleSDGs){
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
     }
     
     if(data2.sustainedSDGs){
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
     } 
     
      console.log("assessID", assessmentIdToDelete);
      await this.sdgsRepo
      .createQueryBuilder()
      .delete()
      .from(SdgAssessment)
      .where("assessmentId = :id", { id: assessmentIdToDelete })
      .execute();

     if(data2.sdgs){
      for(let item of data2.sdgs){
        let sdgs = new SdgAssessment()
        sdgs.assessment = request[0].data[0].assessment
        sdgs.sdg = item
        sdgs.answer = item.answer;
        await this.sdgsRepo.save(sdgs)
      }
     }
     if (data2.isDraft && !data2.isEdit) {
      // console.log("draft", data2.isDraft);
      assessment.isDraft = data2.isDraft;
      assessment.processDraftLocation = data2.proDraftLocation;
      assessment.outcomeDraftLocation = data2.outDraftLocation; 
      this.assessmentRepo.save(assessment)
     }
     if (data2.isEdit) {
      assessment.editedOn = new Date();
      assessment.processDraftLocation = data2.proDraftLocation;
      assessment.outcomeDraftLocation = data2.outDraftLocation;
      // console.log("editedOn", assessment.editedOn );
      this.assessmentRepo.save(assessment)
     }
     if (!data2.isDraft) {
      
      let data = new Results();
      data.assessment = request[0].data[0].assessment;
      let results = await this.calculateNewAssessmentResults(data?.assessment?.id)
      data.averageOutcome = results?.outcomeScore;
      data.averageProcess = results?.processScore
      await this.resultRepository.save(data);
      console.log("saved in results");
       if (data2.isDraft==false && data2.isEdit==true) {
         assessment.isDraft = data2.isDraft
         await this.assessmentRepo.save(assessment)
         console.log("changed is draft", data2.isDraft);
         }
      return 0;
     }
     
   } 

   async createFinalAssessment2(request2: FinalInvestorAssessmentDto[]): Promise<any> {
    let data2: any = request2;
    let request = data2.finalArray;
    let assessment = request[0].data[0].assessment
   //  console.log("request", request2);
    console.log("assessID",  assessment.id)
    console.log("isEdit", data2.isEdit,"isDraft",data2.isDraft);
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
        port.id = assess.portfolioSdg?.id

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

        if( category.id != 6 && category.id != 8 && data2.isEdit==false){
          let a = await this.investorAssessmentRepo.save(iassess)
          console.log("saved");
         }

         //update
          if( category.id != 6 && category.id != 8 && data2.isEdit==true ){
           let a = await this.investorAssessmentRepo.save(assess)
           console.log("updated2 : categoryID",category.id  );
          }
          
        
      }
    }

   const assessmentIdToDelete = request[0].data[0].assessment.id;
   const categoryIDsToDelete = [6, 8]; // Add the category IDs you want to delete

   // Step 2: Delete rows that match the specified conditions
   await this.investorAssessmentRepo
     .createQueryBuilder()
     .delete()
     .from(InvestorAssessment)
     .where("assessment_id = :assessmentIdToDelete", { assessmentIdToDelete })
     .andWhere("category_id IN (:...categoryIDsToDelete)", { categoryIDsToDelete })
     .execute();

    if(data2.scaleSDGs){
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
    }
    
    if(data2.sustainedSDGs){
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
    } 
    
     console.log("assessID", assessmentIdToDelete);
     await this.sdgsRepo
     .createQueryBuilder()
     .delete()
     .from(SdgAssessment)
     .where("assessmentId = :id", { id: assessmentIdToDelete })
     .execute();

    if(data2.sdgs){
     for(let item of data2.sdgs){
       let sdgs = new SdgAssessment()
       sdgs.assessment = request[0].data[0].assessment
       sdgs.sdg = item
       sdgs.answer = item.answer;
       await this.sdgsRepo.save(sdgs)
     }
    }
    if (data2.isDraft && !data2.isEdit) {
      assessment.processDraftLocation = data2.proDraftLocation;
      assessment.outcomeDraftLocation = data2.outDraftLocation; 
     assessment.isDraft = data2.isDraft
     this.assessmentRepo.save(assessment)
     console.log("changed is draft", data2.isDraft);
    }
    if (data2.isEdit) {
      assessment.processDraftLocation = data2.proDraftLocation;
      assessment.outcomeDraftLocation = data2.outDraftLocation; 
      assessment.editedOn = new Date();
      // console.log("editedOn", assessment.editedOn );
      this.assessmentRepo.save(assessment)
     }
    if (!data2.isDraft) {
      
      let data = new Results();
      data.assessment = request[0].data[0].assessment;
      let results = await this.calculateNewAssessmentResults(data?.assessment?.id).then(
        
      )
      data.averageOutcome = results?.outcomeScore;
      data.averageProcess = results?.processScore;
      await this.resultRepository.save(data);
      console.log("saved in results");
      if (data2.isDraft==false && data2.isEdit==true) {
        assessment.processDraftLocation = data2.proDraftLocation;
      assessment.outcomeDraftLocation = data2.outDraftLocation; 
        assessment.isDraft = data2.isDraft
        await this.assessmentRepo.save(assessment)
        console.log("changed is draft", data2.isDraft);
        }
     return 0;
    }
   
    
    
  } 

 /*  async createFinalAssessment2(request2: FinalInvestorAssessmentDto[]): Promise<any> {
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
 */



  async findAllIndicatorquestions(): Promise<InvestorQuestions[]> {
    return this.investorQuestionRepo.find()
  }

  async findAllPortfolioquestions(): Promise<PortfolioQuestions[]> {
    return this.portfolioQuestionRepo.find()
  }

  async createFinalAssessmentIndirect(request: any): Promise<any> {
    console.log("request", request)
    let tool: any;
    // if (request[0].data[0].assessment.tool === 'Investment & Private Sector Tool') {
    //   tool = Tool.Investor_tool
    // }
    // else if (request[0].data[0].assessment.tool === 'Portfolio Tool') {
    //   tool = Tool.Portfolio_tool
    // }

    tool = request[0].data[0].assessment.tool

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

  async findAllSectorCount(): Promise<any[]> {
    // console.log(tool)
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

    // console.log(assesId)
    let characteristicData: {
      characteristic: string,
      ch_code: string,
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
      isCalulate: false,
      ch_code: ''
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
      code: string,
      category_score: { name: string, value: number },
      category_weight: number,
      isSDG: Boolean,
      characteristicData: any[]

    }
    let finalProcessDataArray: {
      processData: typeof processCategoryData[],
      outcomeData: typeof outcomeCategoryData[]
      processScore: number,
      outcomeScore: number|null,
      sdgListwithScores:any[]
      aggregatedScore:{
        name: string
        value: number|null
      },
    } = {
      processData: [],
      processScore: null,
      outcomeScore: null,
      aggregatedScore: {
        name: '',
        value: null
      },
      outcomeData: [],
      sdgListwithScores: []
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
              ch_code: x.characteristics.code,
              char_weight: x.characteristics.ip_weight,
              recalculated_char_weight: x.characteristics.ip_weight, // for now
              isCalulate: (x.relavance == 0 || !x.relavance) ? false : true,
            }

          )
        }
      }
      categoryDataArray.push(categoryData)
// console.log("categoryData",categoryData)
    }
    //Assigning values 
    let total_cat_weight = 0;
    let process_score = null;
    let sdgArray =new Array()
    for (let category of categoryDataArray) {
      let total_char_weight = 0
      let cat_score = 0
      category.characteristicData.map(item => (item.isCalulate ? (total_char_weight += item.recalculated_char_weight) : total_char_weight))
      // console.log(category.category,"total_char_weight",total_char_weight)
      for (let char of category.characteristicData) {
        if (char.isCalulate) {
          // console.log(char.characteristic,char.recalculated_char_weight,total_char_weight)
          // console.log(char.characteristic,char.recalculated_char_weight)
          char.recalculated_char_weight = (100 * (char.recalculated_char_weight / total_char_weight));
          if (char.recalculated_char_weight%1!=0){
            // console.log("........,",char.ch_code,char.recalculated_char_weight)
            char.recalculated_char_weight =Math.round(char.recalculated_char_weight / 10) * 10 // for  round 50% in recalculated weights in 34% charactersitics
          }
          if (!isNaN(char.likelihood.value)) {
            cat_score += this.roundDown(char.recalculated_char_weight * char.likelihood.value) //rounddown
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
        category.category_score = { name: this.mapLikelihood(this.roundDown(cat_score / 100)), value: this.roundDown(cat_score / 100) }; //round down
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
        // process_score += item.recalculated_category_weight * item.category_score.value;
        process_score === null ? (item.category_score.value === null ? null : process_score = item.recalculated_category_weight * item.category_score.value) :
        process_score += item.recalculated_category_weight * item.category_score.value
      }
    })
    finalProcessDataArray.processData = categoryDataArray;
    finalProcessDataArray.processScore = process_score === null ? null : this.roundDown(process_score / 100);

    // outcome..............
    let total_outcome_cat_weight = null
    let outcomeArray: typeof outcomeCategoryData[] = []
    for (let category of categories.meth1Outcomes) {
      // let sdg
      let categoryData: typeof outcomeCategoryData = {
        category: category.name,
        code: category.code,
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
          categoryData.code = category.code;
          if(x.score==99){
            x.score =null;
          }
          // console.log(category.ip_weight)
          categoryData.category_weight = category.ip_weight;
          categoryData.isSDG = (category.code == 'SCALE_SD' || category.code == 'SUSTAINED_SD') ? (true) : (false)
          let isSutained: boolean = (category.code == 'SUSTAINED_GHG' || category.code == 'SUSTAINED_ADAPTATION'||category.code == 'SUSTAINED_SD') ? (true) : (false)
          categoryData.characteristicData.push(
            {
              score: { name: (isSutained) ? (this.mapSustainedScores(x?.score)) : (this.mapScaleScores(x?.score)), value: x?.score },
              characteristic: x.characteristics.name,
              ch_code: x.characteristics.code,
              isCalulate: (x.score == null||x.score == 99) ? false : true,
              sdg: (categoryData.isSDG) ? ('SDG ' + x?.portfolioSdg?.number + ' - ' + x?.portfolioSdg?.name) : ''
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
            // console.log("sdg.isCalulate",sdg.isCalulate)
            if (sdg.isCalulate) {
              sdg_cat_score += sdg.score.value;
              sdg_total_char++;
            }
            else {
              sdg_total_char = sdg_total_char
            }
            
          }
          if (char.data.every(element => element.isCalulate === false)) {
            char.sdg_score = null
          }
          else {
            // console.log(char.name,sdg_cat_score,sdg_total_char,(sdg_cat_score / sdg_total_char),".........")
            char.sdg_score = this.roundDown(sdg_cat_score / sdg_total_char); //round down
            sdg_count++
            total_sdg_score += char.sdg_score;
          }
        }
        if (sdg_count != 0) {
          // console.log(isSutained,category.code)
          category.category_score = { name:(this.mapScaleScores(this.roundDown(total_sdg_score / sdg_count))), value: this.roundDown(total_sdg_score / sdg_count) }; //round down
          sdgArray.push(category)
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
          category.category_score = { name: this.mapScaleScores(this.roundDown(cat_score / total_char)), value: this.roundDown(cat_score / total_char) }; //round down
          total_outcome_cat_weight += category.category_weight * category.category_score.value;
        }
      }
    }
    let aggre_Score =0;
    let sdg_count_aggre =0
    let final_aggre_score =0
    for (let category of sdgArray){
        aggre_Score += category.category_score.value
        sdg_count_aggre++
    }
    if(sdg_count_aggre!=0){
      finalProcessDataArray.aggregatedScore.value = this.roundDown(aggre_Score/sdg_count_aggre);
      finalProcessDataArray.aggregatedScore.name = this.mapScaleScores(this.roundDown(aggre_Score/sdg_count_aggre))
      total_outcome_cat_weight += 50*final_aggre_score;
      // console.log("22")
    }
    else{
      finalProcessDataArray.aggregatedScore.value = null;
      finalProcessDataArray.aggregatedScore.name = '-'
      // console.log("11")
    }
    finalProcessDataArray.outcomeData = outcomeArray;
    console.log("final total_outcome_cat_weight",total_outcome_cat_weight)
    if(total_outcome_cat_weight !=0 && total_outcome_cat_weight != null){
      // console.log("final total_outcome_cat_weight",total_outcome_cat_weight)
      finalProcessDataArray.outcomeScore = this.roundDown(total_outcome_cat_weight / 100)
      // console.log("total_outcome_cat_weight",total_outcome_cat_weight)
    }
    // else{
    //   finalProcessDataArray.outcomeScore = this.roundDown(total_outcome_cat_weight / 100)
    //   // console.log("total_outcome_cat_weight",total_outcome_cat_weight)
    // }
    let scale_sdg= finalProcessDataArray?.outcomeData?.find((item: { code: string; })=>item?.code=='SCALE_SD')
    let sustained_sdg= finalProcessDataArray?.outcomeData?.find((item: { code: string; })=>item?.code=='SUSTAINED_SD')
    console.log("sdg",scale_sdg?.characteristicData.length,"scale",sustained_sdg?.characteristicData.length)
    if(scale_sdg?.characteristicData.length>0 && sustained_sdg?.characteristicData.length>0){
      finalProcessDataArray.sdgListwithScores = this.calculateSDGScores(scale_sdg?.characteristicData,sustained_sdg?.characteristicData);
    }
    
    
    await this.assessmentRepo
    .createQueryBuilder()
    .update(Assessment)
    .set({ process_score: finalProcessDataArray.processScore,outcome_score:finalProcessDataArray.outcomeScore })
    .where("id = :id", { id: assesId })
    .execute()

    return finalProcessDataArray;
  }

  calculateSDGScores(scale:any[],sustained:any[]){
    const result = [];
    
    scale.forEach(scaleSDG => {
        const matchingSustainedSDG = sustained.find(sustainedSDG => sustainedSDG.name === scaleSDG.name);
        if (matchingSustainedSDG) {
          let score :number|string='';
          console.log("sdg",scaleSDG.name,"scale",scaleSDG.sdg_score,"sustained",matchingSustainedSDG.sdg_score)
          let scoreArray =[scaleSDG.sdg_score,matchingSustainedSDG.sdg_score]
          let notNullCount = 0;
          for (const i of scoreArray) {
            
            if(i!==null){
              notNullCount ++;
            }
          }
          if(notNullCount==0){
            score = 'Outside assessment boundaries';
          }
          else
            score = this.roundDown((scaleSDG.sdg_score + matchingSustainedSDG.sdg_score)/notNullCount)
            result.push({
                name: scaleSDG.name,
                score: score,
            });
        }
    });
    return result;
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
  async sdgSumCalculate(tool: string): Promise<any[]> {

    let filter = 'assesment.tool= :tool '


    let user = this.userService.currentUser();
    const currentUser = await user;
    let userId = currentUser.id;
    let userCountryId = currentUser.country?.id;

    const sectorSum = this.assessmentRepo
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
    if (currentUser?.userType?.name === 'External') {
      filter = filter + ' and assesment.user_id=:userId '

    }
    else {
      console.log('work')
      filter = filter + ' and country.id=:userCountryId '
      sectorSum.leftJoinAndMapOne(
        'assesment.climateAction',
        ClimateAction,
        'climateAction',
        'assesment.climateAction_id = climateAction.id'
      )
      .leftJoinAndMapOne(
        'climateAction.country',
        Country,
        'country',
        'climateAction.countryId = country.id'
      )
    }


 
    sectorSum.where(filter,{tool: tool, userId: userId, userCountryId: userCountryId})
      .select('sdg.name', 'sdg')
      .addSelect('sdg.number', 'number')
      .addSelect('COUNT(sdgasses.id)', 'count')
      .groupBy('sdg.name')
      .having('sdg IS NOT NULL')
      ;
    console.log("sectorSum", await sectorSum.getRawMany())
    return await sectorSum.getRawMany();
  }
  async getDashboardData(options: IPaginationOptions): Promise<Pagination<any>> {
    let tool = 'INVESTOR';
    let filter = 'asses.tool=:tool and (asses.process_score is not null and asses.outcome_score is not null) '
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
      ).where(filter, { tool, userId, userCountryId }).orderBy('asses.id','DESC')
    let result = await paginate(data, options);
    return result;
  }

  async sdgSumALLCalculate(): Promise<any[]> {

    let filter = ''


    let user = this.userService.currentUser();
    const currentUser = await user;
    let userId = currentUser.id;
    let userCountryId = currentUser.country?.id;
    console.log(userId, userCountryId)

    const sectorSum = this.assessmentRepo
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
    if (currentUser?.userType?.name === 'External') {
      filter = filter + ' assesment.user_id=:userId '

    }
    else {
      console.log('work')
      filter = filter + ' country.id=:userCountryId '
      sectorSum.leftJoinAndMapOne(
        'assesment.climateAction',
        ClimateAction,
        'climateAction',
        'assesment.climateAction_id = climateAction.id'
      )
      .leftJoinAndMapOne(
        'climateAction.country',
        Country,
        'country',
        'climateAction.countryId = country.id'
      )
    }


 
    sectorSum.where(filter,{userId,userCountryId})
      .select('sdg.name', 'sdg')
      .addSelect('COUNT(sdgasses.id)', 'count')
      .groupBy('sdg.name')
      .having('sdg IS NOT NULL')
      ;
    console.log("sectorSum", await sectorSum.getRawMany())
    return await sectorSum.getRawMany();
  }

  async getDashboardAllData(options: IPaginationOptions): Promise<Pagination<any>> {
    // let tool = 'Investment & Private Sector Tool';
    let filter = 'asses.process_score is not null and asses.outcome_score is not null'
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
      .select(['asses.id', 'asses.process_score', 'asses.outcome_score' ,'asses.tool'])
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
      ).where(filter, { userId, userCountryId }).orderBy('asses.id','DESC')
    let result = await paginate(data, options);
    return result;
  }

  roundDown(value: number) {
    if(value>0){
      return Math.floor(value)
    }
    else{
      return Math.ceil(value)
    }
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
        return 'Unlikely (10-30%)';
      case 2:
        return 'Possible (30-60%)';
      case 3:
        return 'Likely (60-90%)';
      case 4:
        return 'Very likely (90-100%)';
    }
  }
  

  mapScaleScores(value: number) {
    if (value !== null){
      value = +value
    }
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
      case 99:
        return 'Outside assessment boundaries'
      case null:
        return 'Outside assessment boundaries'
      default:
        return value.toString();

    }
  }

  mapSustainedScores(value: number) {
    if (value !== null){
      value = +value
    }
    switch (value) {
      case -1:
        return 'Unlikely (0-10%)';
      case 0:
        return 'Less likely (10-30%)';
      case 1:
        return 'Possible (30-60%)';
      case 2:
        return 'Likely (60-90%)';
      case 3:
        return 'Very likely (90-100%)';
      case 4:
        return 'Certainly (100%)'
      case null:
        return 'Empty'
      default:
        return value.toString();
    }
  }

  async saveToolsMultiSelect(selects: ToolsMultiselectDto):Promise<any>{
    let res_s
    let res_g
    let response = {}
    if (selects.sectors){
      res_s = await this.investorSectorRepo.save(selects.sectors)
    }
    if (selects.geographicalAreas){
      res_g = await this.geographicalAreaRepo.save(selects.geographicalAreas)
    }
    if (res_s) {
      response['sector'] = true
    } else {
      response['sector'] = false
    }
    if (res_g) {
      response['area'] = true
    } else {
      response['area'] = false
    }
    return response
  }


  async getProcessData(assesId:number): Promise<any[]>{
    let finalData:ProcessData[]=[]
    let assessment = await this.findAllAssessData(assesId);
    let categories = await this.findAllCategories();
    for (let category of categories.meth1Process) {

      let categoryData=new ProcessData()
      let assess :InvestorAssessment[]=[]
      for (let x of assessment) {
        
        if (category.name === x.category.name) {
          categoryData.CategoryName = category.name;
          categoryData.categoryID = category.id
          categoryData.type = 'process'
          let indicatordetails:IndicatorDetails[] = await this.getIndicatorDetials(x.id) 
          console.log(indicatordetails.length,x.id)
          x.indicator_details =indicatordetails;
          // console.log(category.ip_weight)
          assess.push(x)
        }
      }
      categoryData.data=assess
      finalData.push(categoryData)
// console.log("categoryData",categoryData)
    }
    return finalData

  }


  async getOutcomeData(assesId:number): Promise<any[]>{
    let finalData:ProcessData[]=[]
    let assessment = await this.findAllAssessData(assesId);
    let categories = await this.findAllCategories();

    const customOrder = [1, 2, 3, 4, 5, 7, 6, 8, 9, 10];
    let categoryDataTemp=new ProcessData()
      categories.meth1Outcomes.sort((a : any, b: any) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });
      
    for (let category of categories.meth1Outcomes) {

      let categoryData=new ProcessData()
      let assess :InvestorAssessment[]=[]
      for (let x of assessment) {
        
        if (category.name === x.category.name) {
          categoryData.CategoryName = category.name;
          categoryData.categoryID = category.id
          categoryData.type = 'outcome'
         // let indicatordetails:IndicatorDetails[] = await this.getIndicatorDetials(x.id) 
        //  console.log(indicatordetails.length,x.id)
        //  x.indicator_details =indicatordetails;
          assess.push(x)
        }
      }
      categoryData.data=assess
      categoryDataTemp = categoryData
      finalData.push(categoryData)
    }

    if(!finalData[2].categoryID){
      console.log("nulll")
      let categoryDataNew=new ProcessData()
      categoryDataNew.CategoryName = "SDG Scale of the Outcome";
      categoryDataNew.categoryID = 6;
      categoryDataNew.type = 'outcome';
      categoryDataNew.data = categoryDataTemp.data;

      finalData[2] = categoryDataNew
    }

    if(!finalData[3].categoryID){
      console.log("nulll")
      let categoryDataNew=new ProcessData()
      categoryDataNew.CategoryName = "SDG Time frame over which the outcome is sustained";
      categoryDataNew.categoryID = 8;
      categoryDataNew.type = 'outcome';
      categoryDataNew.data = categoryDataTemp.data;

      finalData[3] = categoryDataNew
    }

  //  console.log("category dataaa",categoryDataNew)
    return finalData

  }

  async getSelectedSDGs(assessmnetId: number) {
    const res=  this.sdgsRepo.find({
      relations: ['assessment', 'sdg'],
      where: { assessment: { id: assessmnetId } },
    });
    let mappedResult = new Array();
    for(let item of await res){
      let obj : SelectedSDG ={
        id: item.sdg.id,
        number: item.sdg.number,
        name: item.sdg.name,
        //answer : item.answer
      }
      mappedResult.push(obj)
    }
    return mappedResult;
  }

  async getSelectedSDGsWithAnswers(assessmnetId: number) {
    const res=  this.sdgsRepo.find({
      relations: ['assessment', 'sdg'],
      where: { assessment: { id: assessmnetId } },
    });
    let mappedResult = new Array();
    for(let item of await res){
      let obj : SelectedSDGAnswers ={
        id: item.sdg.id,
        number: item.sdg.number,
        name: item.sdg.name,
        answer : item.answer
      }
      mappedResult.push(obj)
    }
    return mappedResult;
  }

  async getSelectedScaleSDGs(assessmnetId: number) {
    const res=  this.sdgsRepo.find({
      relations: ['assessment', 'sdg'],
      where: { assessment: { id: assessmnetId } },
    });
    let mappedResult = new Array();
    for(let item of await res){
      let obj : SelectedScaleSDG ={
        id: item.sdg.id,
        number: item.sdg.number,
        name: item.sdg.name,
        answer : item.answer
      }
      mappedResult.push(obj)
    }
    return mappedResult;
  }

  async getScaleSDGData(assesId: number): Promise<any[]> {
    let finalData: ProcessData2[] = []
    let assessment = await this.findAllAssessData(assesId);
    let categories = await this.findAllCategories();
    let portfolioSdg = await this.getSelectedScaleSDGs(assesId)
    console.log("kkk", portfolioSdg)
    for (let category of categories.meth1Outcomes) {

      for (let i = 0; i < portfolioSdg.length; i++) {
        let assess: InvestorAssessment[] = []
        let categoryData = new ProcessData2()
        for (let x of assessment) {


          if ((category.name === x.category.name) && (category.id == 6)) {
            console.log("cateeeee", category)
            categoryData.CategoryName = category.name;
            categoryData.categoryID = category.id
            categoryData.type = 'outcome'
            let indicatordetails: IndicatorDetails[] = await this.getIndicatorDetials(x.id)
            //   console.log(indicatordetails.length,x.id)
            x.indicator_details = indicatordetails;
            //  let portfolioSdg  = await this.getSelectedScaleSDGs(assesId)
            //  x.portfolioSdg = portfolioSdg[0]
            if (x.portfolioSdg.id == portfolioSdg[i].id) {
              x.portfolioSdg = portfolioSdg[i];
              assess.push(x)
              console.log("mmmm", x.portfolioSdg.id, " and ", portfolioSdg[i].id)
              categoryData.index = portfolioSdg[i].id
            }
          }
        }

        if (category.id == 6) {
          categoryData.data = assess
          finalData.push(categoryData)
        }
      }
    }
    console.log("sdgDataSendArray :::", finalData)
    console.log("pppp", finalData)
    return finalData

  }

  async getSustainedSDGData(assesId: number): Promise<any[]> {
    let finalData: ProcessData2[] = []
    let assessment = await this.findAllAssessData(assesId);
    let categories = await this.findAllCategories();
    let portfolioSdg = await this.getSelectedScaleSDGs(assesId)
    for (let category of categories.meth1Outcomes) {

      for (let i = 0; i < portfolioSdg.length; i++) {
        let assess: InvestorAssessment[] = []
        let categoryData = new ProcessData2()
        for (let x of assessment) {

          if ((category.name === x.category.name) && (category.id == 8)) {
            categoryData.CategoryName = category.name;
            categoryData.categoryID = category.id
            categoryData.type = 'outcome'
            let indicatordetails: IndicatorDetails[] = await this.getIndicatorDetials(x.id)
            x.indicator_details = indicatordetails;
            if (x.portfolioSdg.id == portfolioSdg[i].id) {
              x.portfolioSdg = portfolioSdg[i];
              assess.push(x)
              categoryData.index = portfolioSdg[i].id
            }
          }
        }

        if (category.id == 8) {
          categoryData.data = assess
          finalData.push(categoryData)
        }
      }
    }
    return finalData

  }

  async saveSdgPriorities(priorities: SdgPriority[]){
    return await this.sdgPriorityRepo.save(priorities)
  }

  async getSdgPrioritiesByCountryId(countryId: number) {
    return await this.sdgPriorityRepo.find({where: {country: {id: countryId}}, relations: ['sdg']})
  }

  async saveTotalInvestments(investments: TotalInvestment[]) {
    return await this.totalInvestmentRepo.save(investments)
  }
}

interface SelectedSDG {
  id: number;
  name: string;
  number: number;
 // answer: string;
}

interface SelectedSDGAnswers {
  id: number;
  name: string;
  number: number;
  answer: string;
}

interface SelectedScaleSDG {
  id: number;
  name: string;
  number: number;
  answer: string;
}

