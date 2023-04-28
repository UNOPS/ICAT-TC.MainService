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
    objectives:string[]=[];
    intendedAudience:string[]=[];
    opportunities:string[]=[];
    assessmetType:string="";
    assessmentBoundary:string[]=[];
    policyOrActionsDetails:object[]=[];
    contextOfPolicy :object[]=[];
    prossescharacteristics:object[]=[];
    outcomecharacteristics:object[]=[]

}
export class ReportContentTwo {

}