import { Injectable } from '@nestjs/common';
import { ComparisonReportDto, ReportDto } from '../dto/report.dto';
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
        <div class="col-2 align-self-center"> #pageNumber# | Page</div>
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
        <link rel="stylesheet" href="http://localhost:7080/report/css/reportserver.css">
            </head>
  
  
            <body>
             ${this.reportPagesService.coverPage(repportDto.coverPage)}
             ${this.reportPagesService.tableOfContent(header,footer,repportDto.tableOfContent)}
             ${this.reportPagesService.contentOne(header,footer,repportDto.contentOne)}
             ${this.reportPagesService.contentTwo(header,footer,repportDto.contentTwo)}
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
        <div class="col-2 align-self-center"> #pageNumber# | Page</div>
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
        <link rel="stylesheet" href="http://localhost:7080/report/css/reportserver.css">
            </head>
  
  
            <body>
             ${this.reportPagesService.comparisonCoverPage(repportDto.coverPage)}
             ${this.reportPagesService.comparisonTableOfContent(header,footer,repportDto.tableOfContent)}
             ${this.reportPagesService.comparisonContentOne(header,footer,repportDto.contentOne)}
             ${this.reportPagesService.comparisonContentTwo(header,footer,repportDto.contentTwo)}
             ${this.reportPagesService.comparisonContentThree(header,footer,repportDto.contentThree)}
             ${this.reportPagesService.comparisonContentFour(header,footer,repportDto.contentFour)}
           
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
        <div class="col-2 align-self-center"> #pageNumber# | Page</div>
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
    <link rel="stylesheet" href="http://localhost:7080/report/css/reportserver.css">
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
