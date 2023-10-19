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
       path: '/home/ubuntu/code/Main/main/public/' + fileName,
      //path:  './public/' + fileName,
      printBackground: true
    };
    return await html_to_pdf.generatePdf(file, options);
}

async comparisonReportGenarate(name:string,file:any):Promise<any>{

  let fileName = name;
  let options = {
    format: 'A4',
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
     path: '/home/ubuntu/code/Main/main/public/' + fileName,
    // path:  './public/' + fileName,
    printBackground: true
  };


  // const html_to_pdf = require('html-pdf-node');
 
  // return await html_to_pdf.generatePdf(file, options);

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setContent(file.content, { waitUntil: 'domcontentloaded' });
  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');
  // Download the PDF


  const PDF = await page.pdf(options);
  // Close the browser instance
  await browser.close();

  return PDF
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
