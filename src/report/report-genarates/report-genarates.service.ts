import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportGenaratesService {


constructor(){}

    async reportGenarate(name:string,file:any):Promise<any>{
    const html_to_pdf = require('html-pdf-node');
    let fileName = name;
    let options = {
      format: 'A4',
      margin: { top: '50px', bottom: '50px', left: '0px', right: '0px' },
       path:  process.env.TEMP_FILE_SAVE_URL + fileName,
   
      printBackground: true,
      landscape:true
    };

    
    const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath:'/usr/bin/chromium-browser',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(file.content, { waitUntil: 'domcontentloaded' });
  await page.emulateMediaType('print');


  const PDF = await page.pdf(options);
  await browser.close();

  return PDF
}

async comparisonReportGenarate(name:string,file:any):Promise<any>{

  let fileName = name;
  let options = {
    format: 'A4',
    margin: { top: '50px', bottom: '50px', left: '0px', right: '0px' },
     path: process.env.TEMP_FILE_SAVE_URL + fileName,
  
    printBackground: true,
    landscape:true
  };

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath:'/usr/bin/chromium-browser',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(file.content, { waitUntil: 'domcontentloaded' });
  await page.emulateMediaType('print');


  const PDF = await page.pdf(options);
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
