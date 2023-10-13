import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportGenaratesService {


constructor(){}

    async reportGenarate(name:string,file:any):Promise<any>{
    const html_to_pdf = require('html-pdf-node');
    let fileName = name;
    let options = {
      format: 'A4',
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      // path: '/home/ubuntu/code/Main/main/public/' + fileName,
      path:  './public/' + fileName,
      printBackground: true
    };
    return await html_to_pdf.generatePdf(file, options);
}

async comparisonReportGenarate(name:string,file:any):Promise<any>{
  const html_to_pdf = require('html-pdf-node');
  let fileName = name;
  let options = {
    format: 'A4',
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
    // path: '/home/ubuntu/code/Main/main/public/' + fileName,
    path:  './public/' + fileName,
    printBackground: true
  };
  return await html_to_pdf.generatePdf(file, options);
}

    async assessmentGenarate(name:string,file:any):Promise<any>{
    const html_to_pdf = require('html-pdf-node');
    let fileName = name;
    let options = {
      format: 'A4',
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      path: './public/' + fileName,
      printBackground: true
    };
    return await html_to_pdf.generatePdf(file, options);
}

}
