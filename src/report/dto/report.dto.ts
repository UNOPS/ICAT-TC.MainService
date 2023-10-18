export class ReportDto {
    reportName:string='';
    coverPage:ReportCoverPage=new ReportCoverPage()
    tableOfContent:ReportTableOfContent=new ReportTableOfContent()
    contentOne:ReportContentOne=new ReportContentOne()
    contentTwo:ReportContentTwo=new ReportContentTwo()
 
 }
 
 export class ReportCoverPage {
     generateReportName: string = "";
     reportName: string = "";
    
     companyLogoLink: string = "";
   
     document_prepared_by: string = "";
     ICATLogoLink: string = "";
     reportDate: string = "";
    
     companyAdressLine1 = ""
     companyAdressLine2 = ""
     companyAdressLine3 = ""
     companyregistrationNumber = ""
     companyEmailAdress = ""
     companyFax = ""
     companyTelephone = ""
 
 }
 
 export class ReportTableOfContent {
 
 }
 export class ReportContentOne {
    
     //genaral data
     policyName:string="";
     assesmentPersonOrOrganization:string="";
     assessmentYear:string="";
     objectives:any[]=[];
     intendedAudience:string="";
     opportunities:string="";
     assessmetType:string="";
     assessmentBoundary:string="";
     impactCoverd:string="";
     sectorCoverd:string="";
     geograpycalCover:string="";
     principles:string="";
 
     understanPolicyOrActions :object[]=[];
     barriers:object[]=[];
     policyOrActionsDetails:object[]=[];
     contextOfPolicy :object[]=[];
     prossescharacteristics:object[]=[];
     outcomecharacteristics:object[]=[]
 
 }
 export class ReportContentTwo {
     assesmentType:string;
 //    2.1
     prossesAssesmentStartingSituation:object[]=[];
     outcomeAssesmentStartingSituation:object[]=[];
 
     //2.2
     scale_ghg:object[]=[];
     scale_sd:{rows:number,name:string,sdg:{rows:number,name:string,impact:string,characteristics:any[]}[]};
     sustained_ghg:object[]=[];
     sustained_sd:{rows:number,name:string,sdg:{rows:number,name:string,impact:string,characteristics:any[]}[]};
     scale_adaptation:object[]=[];
     sustained_adaptation:object[]=[];
 
     process_categories_assessment:object[]=[];
     outcomes_categories_assessment:object[]=[];
 
     prossesExAnteAssesment:object[]=[];
     outcomeExAnteAssesment:object[]=[];
     prossesExAnteAnalysis:object[]=[]; 
     outcomeExAnteAnalysis:object[]=[];
 
 //2.3
     prossesExPostAssesment:object[]=[];
     outcomeExPostAssesment:object[]=[];
     prossesExPostAnalysis:object[]=[]; 
     outcomeExPostAnalysis:object[]=[];
     
     prossesDescribeResult:object[]=[];
     outcomeDescribeResult:object[]=[];
 
 
 
 
 }
 
 
 export class ComparisonReportDto {
     reportName:string='';
     coverPage:ComparisonReportReportCoverPage=new ComparisonReportReportCoverPage()
     tableOfContent:ComparisonReportReportTableOfContent=new ComparisonReportReportTableOfContent()
     contentOne:ComparisonReportReportContentOne=new ComparisonReportReportContentOne()
     contentTwo:ComparisonReportReportContentTwo=new ComparisonReportReportContentTwo()
     contentThree:ComparisonReportReportContentThree=new ComparisonReportReportContentThree()
     contentFour:ComparisonReportReportContentFour=new ComparisonReportReportContentFour()
  
  }
 
  export class ComparisonReportReportCoverPage {
     generateReportName: string = "";
     reportName: string = "";
    
     companyLogoLink: string = "";
   
     document_prepared_by: string = "";
     ICATLogoLink: string = "";
     reportDate: string = "";
    
     companyAdressLine1 = ""
     companyAdressLine2 = ""
     companyAdressLine3 = ""
     companyregistrationNumber = ""
     companyEmailAdress = ""
     companyFax = ""
     companyTelephone = ""
 
 }
 
 export class ComparisonReportReportTableOfContent {}
 export class ComparisonReportReportContentOne  {
  portfolio_details:object[]=[];   //ex=[{information:'',description:''}]
  intervation_details:object[]=[];//ex=[{id:'',name:''}]
 
 
 }
 export class ComparisonReportReportContentTwo {
     prosses_tech:object[]=[] //ex=[{ id:number,name:string,type:string,status:string,randd:string,adoptation:string,scaleup:string,score:string}]
     prosses_agent:object[]=[] //ex=[{ id:number,name:string,type:string,status:string,entrepreneurs:string,coalition :string,beneficiaries:string,score:string}]
     prosses_incentive:object[]=[] //ex=[{ id:number,name:string,type:string,status:string,economic :string,disincentives:string,institutional :string,score:string}]
     prosses_norms:object[]=[] //ex=[{ id:number,name:string,type:string,status:string,awareness:string,behavior:string,norms:string,score:string}]
     process_score:object[]=[] //ex=[{ id:number,name:string,type:string,status:string,tech:string,agent:string,incentive:string,norms:string,prosess:string}]
 
 
     ghg_scale:object[]=[]    //ex=[{ id:number,name:string,type:string,status:string,international:string,national:string,subnational:string,score:string}]
     ghg_sustaind:object[]=[] //ex=[{ id:number,name:string,type:string,status:string,long:string,medium :string,short:string,score:string}]
     ghg_scale_sustaind_comparison:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,scale:string,sustained:string,score:string}]
 
 
     allsdg:{sdg_name:string,sdg_scale:object[],sdg_sustaind:object[]}[]=[];
     sdg_scale:object[]=[]  //ex=[{ id:number,name:string,type:string,status:string,international:string,national:string,subnational:string,score:string}]
     sdg_sustaind:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,long:string,medium :string,short:string,score:string}]
     sdg_scale_sustaind_comparison:object[][]=[]//ex=[{ id:number,name:string,type:string,status:string,scale:string,sustained:string,score:string}]
 
     adaptation_scale:object[]=[]  //ex=[{ id:number,name:string,type:string,status:string,international:string,national:string,subnational:string,score:string}]
     adaptation_sustaind:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,long:string,medium :string,short:string,score:string}]
     adaptation_scale_sustaind_comparison:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,scale:string,sustained:string,score:string}]
 
     sacle_comparison:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,ghg:string,sdg :string,adaptation :string,score:string}]
     sustaind_comparison:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,ghg:string,sdg :string,adaptation :string,score:string}]
     outcome_level:object[]=[]//ex=[{ id:number,name:string,type:string,status:string,scale:string,sustained :string,score:string}]
     
 
 
 }
 export class ComparisonReportReportContentThree {
     aggregation:{total:number,data:object[]}={total:0,data:[]}  //data=[{ id:number,name:string,type:string,status:string,mitigation :string}]
 }
 export class ComparisonReportReportContentFour {
  alignment_table:{sdg_names:string[],data:object[]}= {sdg_names:[],data:[]} //ex={sdg_names:string[],data[{ id:number,name:string,type:string,status:string,sgc:[]}]}
  alignment_heat_map:{sdg_names:string[],data:object[]}= {sdg_names:[],data:[]}
 }
 