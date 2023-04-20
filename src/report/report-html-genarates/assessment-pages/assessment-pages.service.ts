import { Injectable } from '@nestjs/common';

@Injectable()
export class AssessmentPagesService {
  constructor() {}

  coverPage(): string {
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
   <div class="row ">
       <div class="col h2 d-flex justify-content-center">
         REPORT TITLE
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
         Logo
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
         Document Prepared By (individual or entity)
       </div>
   </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Contact Information 
     </div>
 </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Report Date
     </div>
 </div>
 </div>
 <div class="  d-flex justify-content-center" style="height: 100px;margin-top: 200px;margin-bottom: 0px;" >
       <img  style="padding: 0px;" src="http://localhost:7080/report/cover/icatlogo.jpg" > 
 </div>
    </div>`;

    return cover;
  }

  tableOfContent(header: string, footer: string): string {
    let pageNumber = 5;

    const page_one = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
    <div class="table-of-content ">
    <div  class="table-of-content-main-headers text-start">Table of Contents</div>
    <div class="table-of-content-header-item"><div >List of Tables ................................................................................................................................................................</div><div ><bdi>.................7</bdi></div> </div>
    <div class="table-of-content-header-item"><div >1.	OVERVIEW OF THE METHODOLOGY  ....................................................................................................................................................................</div><div ><bdi>.............10</bdi></div> </div>
    <div class="table-of-content-header-item"><div >2.	DEFINING THE ASSESSMENT (PART I & II).................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-header-item"><div >3.	IMPACT ASSESSMENT (PART III).................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-header-item"><div >4.	MONITORING AND REPORTING (PART IV).................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-header-item"><div >5.  DECISION-MAKING AND USING RESULTS (PART V).................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>

      
    </div>
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    return page_one;
  }
}
