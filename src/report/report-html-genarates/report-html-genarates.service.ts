import { Injectable } from '@nestjs/common';
import { ComparisonReportDto, ReportCarbonMarketDto, ReportDto } from '../dto/report.dto';
import { AssessmentDto } from '../dto/assessment.dto';
import { ReportPagesService } from './report-pages/report-pages.service';
import { AssessmentPagesService } from './assessment-pages/assessment-pages.service';

@Injectable()
export class ReportHtmlGenaratesService {
  constructor(
    private readonly reportPagesService: ReportPagesService,
    private readonly assessmentPagesService: AssessmentPagesService,
  ) {}

  async reportHtmlGenarate(repportDto: ReportDto): Promise<any> {
    const header = ` <div class="header">
    <div class="row ">
      
      <div class="col-4 align-self-center">
          <img height="50px" src="" >
      </div>
      <div class="col-8 align-self-end">
      ICAT TC Tool
      </div>
    </div>
    <div  class="row"></div>
  </div>`;

    const footer = ` <div  class="footer">
    <div class="row ">
        <div style="background-color: #082160;" class="col-4"></div>
        <div style="background-color: green;" class="col-4"></div>
        <div style="background-color: yellow;" class="col-4"></div>
    </div>
    <div class="row ">
        
        <div class="col-1 align-self-center">  <img height="50px" src="" ></div>
        <div class="col-9  align-self-start"></div>
        <div class="col-2 align-self-center"> </div>
    </div>
  </div>`;
    return {
      content: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <title>Bootstrap Example</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="${ process.env.MAIN_URL}/report/css/reportserverlandscapewithoutpage.css">
            </head>
  
  
            <body>
             ${this.reportPagesService.coverPage(repportDto.coverPage)}
             ${this.reportPagesService.tableOfContent('','',repportDto.tableOfContent,repportDto.contentTwo.tool)}
             ${this.reportPagesService.contentOne('','',repportDto.contentOne)}
             ${this.reportPagesService.contentTwo('','',repportDto.contentTwo)}
            </body></html>`,
    };
  }

  async reportCarbonMarketHtmlGenarate(repportDto: ReportCarbonMarketDto): Promise<any> {
    const header = ` <div class="header">
    <div class="row ">
      
      <div class="col-4 align-self-center">
          <img height="50px" src="" >
      </div>
      <div class="col-8 align-self-end">
      ICAT TC Tool
      </div>
    </div>
    <div  class="row"></div>
  </div>`;

    const footer = ` <div  class="footer">
    <div class="row ">
        <div style="background-color: #082160;" class="col-4"></div>
        <div style="background-color: green;" class="col-4"></div>
        <div style="background-color: yellow;" class="col-4"></div>
    </div>
    <div class="row ">
        
        <div class="col-1 align-self-center">  <img height="50px" src="" ></div>
        <div class="col-9  align-self-start"></div>
        <div class="col-2 align-self-center"></div>
    </div>
  </div>`;
    return {
      content: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <title>Bootstrap Example</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script> 
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="${ process.env.MAIN_URL}/report/css/reportserverlandscapewithoutpage.css">
            </head>
  
  
            <body>
             ${this.reportPagesService.coverCarbonMarketPage(repportDto.coverPage)}
             ${this.reportPagesService.CarbonMarketTableOfContent('','',repportDto.tableOfContent)}
             ${this.reportPagesService.CarbonMarketcontentOne('','',repportDto.contentOne)}
             ${this.reportPagesService.CarbonMarketcontentTwo('','',repportDto.contentTwo)}
             ${this.reportPagesService.CarbonMarketcontentThree('','',repportDto.contentThree)}
             ${this.reportPagesService.CarbonMarketcontentFour('','',repportDto.contentFour)}
             ${this.reportPagesService.CarbonMarketcontentFive('','',repportDto.contentFive)}
            </body></html>`,
    };
  }

  async comparisonReportHtmlGenarate(repportDto: ComparisonReportDto): Promise<any> {
    const header = ` <div class="header">
    <div class="row ">
      
      <div class="col-4 align-self-center">
          <img height="50px" src="" >
      </div>
      <div class="col-8 align-self-end">
      ICAT TC Tool
      </div>
    </div>
    <div  class="row"></div>
  </div>`;

    const footer = ` <div  class="footer">
    <div class="row ">
        <div style="background-color: #082160;" class="col-4"></div>
        <div style="background-color: green;" class="col-4"></div>
        <div style="background-color: yellow;" class="col-4"></div>
    </div>
    <div class="row ">
        
        <div class="col-1 align-self-center">  <img height="50px" src="" ></div>
        <div class="col-9  align-self-start"></div>
        <div class="col-2 align-self-center"></div>
    </div>
  </div>`;
let pageHeadersNumbers={}


let comparisonCoverPage=this.reportPagesService.comparisonCoverPage(repportDto.coverPage)
let comparisonTableOfContent=this.reportPagesService.comparisonTableOfContent('','',repportDto.tableOfContent)
let comparisonContentOne=this.reportPagesService.comparisonContentOne('','',repportDto.contentOne)
let comparisonContentTwo=this.reportPagesService.comparisonContentTwo('','',repportDto.contentTwo)
let comparisonContentThree=this.reportPagesService.comparisonContentThree('','',repportDto.contentThree)
let comparisonContentFour=this.reportPagesService.comparisonContentFour('','',repportDto.contentFour)


    return {
      content: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <title>Bootstrap Example</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="https://tc-main.climatesi.com/report/css/reportserverlandscapewithoutpage.css">
            </head>
  
  
            <body>
             ${comparisonCoverPage}
             ${comparisonTableOfContent}
             ${comparisonContentOne}
             ${comparisonContentTwo}
             ${comparisonContentThree}
             ${comparisonContentFour}
           
            </body></html>`,
    };


  }

  async assessmentHtmlGenarate(assessmentDto: AssessmentDto): Promise<any> {
    const header = ` <div class="header">
    <div class="row ">
    <div class="col-4 align-self-center">
    <img height="50px" src="" >
</div>
      <div class="col-8 align-self-end">
      January 2021
      </div>
     
    </div>
    <div  class="row"></div>
  </div>`;

    const footer = ` <div  class="footer">
    <div class="row ">
        <div style="background-color: #082160;" class="col-4"></div>
        <div style="background-color: green;" class="col-4"></div>
        <div style="background-color: yellow;" class="col-4"></div>
    </div>
    <div class="row ">
        <div class="col-2 align-self-center"> </div>
        <div class="col-9  align-self-start"></div>
        <div class="col-1 align-self-center">  <img height="50px" src="" ></div>
    </div>
  </div>`;
    return {
      content: `<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Bootstrap Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="${ process.env.MAIN_URL}/report/css/reportserver.css">
        </head>


        <body>
        ${this.assessmentPagesService.coverPage()}
        ${this.assessmentPagesService.tableOfContent(header,footer)}
        ${this.assessmentPagesService.contentOne(header,footer)}
        ${this.assessmentPagesService.contentTwo(header,footer)}
        ${this.assessmentPagesService.contentThree(header,footer)}
        ${this.assessmentPagesService.contentFour(header,footer)}
        ${this.assessmentPagesService.contentFive(header,footer)}
       
       
        </body></html>`,
    };
  }
}
