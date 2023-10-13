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
export class ComparisonReportReportContentOne {
 portfolio_details:object[]=[];   //ex=[{information:'',description:''}]
 intervation_details:object[]=[];//ex=[{id:'',name:''}]


}
export class ComparisonReportReportContentTwo {
    prosses_tech:object[]=[] //ex=[{id:'',name:'',type:'',status:'',randd:'',adoptation:'',scaleup:'',score:''}]
    prosses_agent:object[]=[] //ex=[{id:'',name:'',type:'',status:'',entrepreneurs:'',coalition :'',scaleup:'',score:''}]
    prosses_incentive:object[]=[] //ex=[{id:'',name:'',type:'',status:'',economic :'',disincentives:'',institutional :'',score:''}]
    prosses_norms:object[]=[] //ex=[{id:'',name:'',type:'',status:'',awareness:'',behavior:'',norms:'',score:''}]

}
export class ComparisonReportReportContentThree {}
export class ComparisonReportReportContentFour {}
