import { ComparisonDto } from "src/portfolio/dto/comparison.dto";

export class ReportDto {
   reportName:string='';
   coverPage:ReportCoverPage=new ReportCoverPage()
   tableOfContent:ReportTableOfContent=new ReportTableOfContent()
   contentOne:ReportContentOne=new ReportContentOne()
   contentTwo:ReportContentTwo=new ReportContentTwo()
   contentThree:ReportContentThree=new ReportContentThree()

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
    tool:string=""
}

export class ReportTableOfContent {
    tool:string =""
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
    prossesAssesmentStartingSituation1:object[]=[];
    prossesAssesmentStartingSituation2:object[]=[];
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

    processScore: number;
    outcomeScore :number;
    tool:string;



}
export class ReportContentThree {
    
    processScore: number;
    outcomeScore :number;
 }

export class ReportCarbonMarketDto {
    reportName:string='';
    coverPage:ReportCarbonMarketDtoCoverPage=new ReportCarbonMarketDtoCoverPage()
    tableOfContent:ReportCarbonMarketDtoTableOfContent=new ReportCarbonMarketDtoTableOfContent()
    contentOne:ReportCarbonMarketDtoContentOne=new ReportCarbonMarketDtoContentOne()
    contentTwo:ReportCarbonMarketDtoContentTwo=new ReportCarbonMarketDtoContentTwo()
    contentThree:ReportCarbonMarketDtoContentThree=new ReportCarbonMarketDtoContentThree()
    contentFour:ReportCarbonMarketDtoContentFour=new ReportCarbonMarketDtoContentFour()
    contentFive:ReportCarbonMarketDtoContentFive=new ReportCarbonMarketDtoContentFive()
 
 }
 
 export class ReportCarbonMarketDtoCoverPage {
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
 export class ReportCarbonMarketDtoTableOfContent {}
 export class ReportCarbonMarketDtoContentOne {
    

   

    opportunities:string="";
    assessmetType:string="";
   
    sectorCoverd:string="";
    geograpycalCover:string="";
    
    assesment :object[]=[{information:'teat1',description:'test11'   },{information:'teat2',description:'test22'   }];
    barriers:object[]=[{  barrier: 'aaa',
        explanation: 'sss',
        characteristics_affected: 'ddd',
        barrier_directly_targeted: 'ccc',}];
    policyOrActionsDetails:object[]=[{information:'teat1',description:'test11'   },{information:'teat2',description:'test22'   }];
    characteristics :object[]=[{information:'teat1',description:'test11'   },{information:'teat2',description:'test22'   }];
    transformational :object[]=[{information:'teat1',description:'test11'   },{information:'teat2',description:'test22'   }];
    outcomecharacteristics:object[]=[]

 }
 export class ReportCarbonMarketDtoContentTwo {
    safeguards:object[] = [[{question:'test1',answer:'teat2',comment :'teat2',document :'teat3'  }]]
    prevention_ghg_emissions  :object[]=[{question:'test1',answer:'teat2',comment :'teat2',document :'teat3'  }]
    prevention_negative_environmental:object[] =[{question:'test1',answer:'teat2',comment :'teat2',document :'teat3'  }]
    outcomes:object[]=[{preocndition:'teat',outcome:'teats',evidence_provided:'test'   }]

}
 export class ReportCarbonMarketDtoContentThree {
    prossesAssesmentStartingSituation:{ rows: number; name: string; characteristics: any[] }[][]=[];
    outcomeAssesmentStartingSituation:object[]=[];

    //2.2
    scale_ghg:object[]=[];
    scale_sd:object[]=[];
    sustained_ghg:object[]=[];
    sustained_sd:object[]=[]
    scale_adaptation:object[]=[];
    sustained_adaptation:object[]=[];

    process_categories_assessment:object[]=[];
    outcomes_categories_assessment:any={};
    processScore: number;
    outcomeScore :number;

 }
 export class ReportCarbonMarketDtoContentFour {
    
    processScore: number;
    outcomeScore :number;
 }
 export class ReportCarbonMarketDtoContentFive {

    annex:object[]=[]

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
    tool:string = ""

}

export class ComparisonReportReportTableOfContent {}
export class ComparisonReportReportContentOne  {
 portfolio_details:object[]=[];  
 intervation_details:object[]=[];


}
export class ComparisonReportReportContentTwo {
    prosses_tech:object[]=[];
    prosses_agent:object[]=[]; 
    prosses_incentive:object[]=[] ;
    prosses_norms:object[]=[] ;
    process_score:object[]=[] ;


    ghg_scale:object[]=[]  ;
    ghg_sustaind:object[]=[] ;
    ghg_scale_sustaind_comparison:object[]=[];


    allsdg:{sdg_name:string,sdg_scale:object[],sdg_sustaind:object[]}[]=[];
    sdg_scale:object[]=[]  ;
    sdg_sustaind:object[]=[];
    sdg_scale_sustaind_comparison:{sdg_name:string,data:object[]}[]=[];

    adaptation_scale:object[]=[]  ;
    adaptation_sustaind:object[]=[];
    adaptation_scale_sustaind_comparison:object[]=[];

    sacle_comparison:object[]=[];
    sustaind_comparison:object[]=[];
    outcome_level:object[]=[];
    


}
export class ComparisonReportReportContentThree {
    aggregation:{total:number,data:object[]}={total:0,data:[]}  ;
}
export class ComparisonReportReportContentFour {;
 alignment_heat_map:{sdg_names:string[],data:object[]}= {sdg_names:[],data:[]}
 alignment_table:ComparisonDto;
}
