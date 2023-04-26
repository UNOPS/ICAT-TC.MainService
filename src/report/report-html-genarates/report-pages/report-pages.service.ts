import { Injectable } from '@nestjs/common';
import { ReportContentOne, ReportContentTwo, ReportCoverPage, ReportTableOfContent } from 'src/report/dto/report.dto';

@Injectable()
export class ReportPagesService {
  constructor() {}

  coverPage(coverPage: ReportCoverPage): string {
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
   <div class="row ">
       <div class="col h2 d-flex justify-content-center">
         ${coverPage.generateReportName}
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
         Logo
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
         Document Prepared By ${coverPage.document_prepared_by}
       </div>
   </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Contact Information 
     </div>
 </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
       Report Date:${coverPage.reportDate}
     </div>
 </div>
 </div>
 <div class="  d-flex justify-content-center" style="height: 100px;margin-top: 200px;margin-bottom: 0px;" >
       <img  style="padding: 0px;" src="${coverPage.companyLogoLink}" > 
 </div>
    </div>`;

    return cover;
  }

  tableOfContent(
    header: string,
    footer: string,
    tableOfContent: ReportTableOfContent,
  ): string {
    let pageNumber = 5;

    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	DEFINING THE ASSESSMENT (PART I & II) ....................................................................................................................................................................</div><div ><bdi>.............10</bdi></div> </div>
  
    
    <div class="table-of-content-sub-header-item"><div >1.1	General information about the assessment ................................................................................................................................</div><div ><bdi>.................11</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2	Describe the policy or action  ..................................................................................................................................................</div><div ><bdi>.............11</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3	Understanding the context of policy or action  ..................................................................................................................................................</div><div ><bdi>.............11</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.4	Choosing transformational change characteristics to assess ....................................................................................................................................................</div><div ><bdi>.....12</bdi></div> </div>
  

    <div class="table-of-content-header-item"><div >2.	IMPACT ASSESSMENT (PART III).................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Assessment of the starting situation  ................................................................................................................................</div><div ><bdi>.................13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Ex-ante assessment....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.3	Ex-post assessment....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.4	Monitoring (Part IV)....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.5	Decision making and using results (Part V) ....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>

  </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    return page_one;
  }

  contentOne(header: string, footer: string, contentOne: ReportContentOne): string {
    let pageNumber = 5;
    const policyOrActions = [
      {
        information: 'data 1',
        description: 'description 1',
      },
      {
        information: 'data 2',
        description: 'description 2',
      },
      {
        information: 'data 3',
        description: 'description 3',
      },
      {
        information: 'data 4',
        description: 'description 4',
      },
    ];

    const page_one = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">1 INTRODUCTION</div>
  <div  class="main_header_sub text-start">1.1	General information about the assessment</div> 
  <div class="list">  
  <ul>
  <li><blockquote class="blockquote  ">
    <p class="mb-0 lh-base">Provides a good understanding on impacts on climate change;</p>
  </blockquote></li>
  <li><blockquote class="blockquote  ">
    <p class="mb-0 lh-base">Develops key performance indicators for emission and energy management;</p>
  </blockquote></li>
  <li><blockquote class="blockquote  ">
    <p class="mb-0 lh-base">Maintains a higher rank among other competitive industries showing its commitment towards sustainable business;</p>
  </blockquote></li>
  <li><blockquote class="blockquote  ">
    <p class="mb-0 lh-base">Meets stakeholders demand to address the imperative corporate responsibility of environmental conservation; and</p>
  </blockquote></li>
  <li><blockquote class="blockquote  ">
    <p class="mb-0 lh-base">Develops Carbon management plan to make real emission reduction through supply chain and production.</p>
  </blockquote></li>  
</ul>
</div>
       <div class="report-table-sm">
       <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>
       <table class="table  table-bordered border-dark">
         <thead class="table-primary  border-dark">
           <tr>
             <th scope="col">Information</th>
             <th scope="col">Description</th>
             
           </tr>
         </thead>
         <tbody class="table-active ">
         ${policyOrActions
           .map(
             (a: { information: string; description: string }) =>
               '<tr><td>' +
               a.information +
               '</td><td>' +
               a.description +
               '</td></tr>',
           )
           .join('')}
         </tbody>
       </table>
     </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', pageNumber.toString())}
  
   </div>`;
    const understanPolicyOrActions = [
      {
        Time_periods: 'Long-term (≥15 years)',
        description: 'description 1',
      },
      {
        Time_periods: 'Medium-term (≥5 years and greater than 15 years)',
        description: 'description 2',
      },
      {
        Time_periods: 'Short-term (greater than 5 years)',
        description: 'description 3',
      },
    ];
    const barriers = [
      {
        barrier: 'test barrier',
        explanation: 'test explanation',
        characteristics_affected: 'test characteristics_affected',
        barrier_directly_targeted: 'test barrier_directly_targeted',
      },
      {
        barrier: 'test barrier',
        explanation: 'test explanation',
        characteristics_affected: 'test characteristics_affected',
        barrier_directly_targeted: 'test barrier_directly_targeted',
      },
      {
        barrier: 'test barrier',
        explanation: 'test explanation',
        characteristics_affected: 'test characteristics_affected',
        barrier_directly_targeted: 'test barrier_directly_targeted',
      },
    ];
    const page_two = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
   <div  class="main_header_sub text-start">1.3	Understanding the context of policy or action </div> 
          <blockquote class=" paragraph blockquote text-start ">
            <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
             Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
              took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
              </p>
          </blockquote>
        
        <div class="report-table-sm">
        <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Barriers</th>
              <th scope="col">Explanation</th>
              <th scope="col">Characteristics affected</th>
              <th scope="col">Barrier directly targeted by the policy or action</th>
            </tr>
          </thead>
          <tbody class="table-active">
          ${barriers
            .map(
              (a: {
                barrier: string;
                explanation: string;
                characteristics_affected: string;
                barrier_directly_targeted: string;
              }) =>
                '<tr><td>' +
                a.barrier +
                '</td><td>' +
                a.explanation +
                '</td><td>' +
                a.characteristics_affected +
                '</td><td>' +
                a.barrier_directly_targeted +
                '</td></tr>',
            )
            .join('')}
          </tbody>
        </table>
      </div>
      <blockquote class=" paragraph blockquote text-start ">
      <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
       Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
        </p>
    </blockquote>
    <div class="report-table-sm">
    <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Time periods</th>
          <th scope="col">Description of the vision for desired societal, environmental and technical changes</th>
          
        </tr>
      </thead>
      <tbody class="table-active">
      ${understanPolicyOrActions
        .map(
          (a: { Time_periods: string; description: string }) =>
            '<tr><td>' +
            a.Time_periods +
            '</td><td>' +
            a.description +
            '</td></tr>',
        )
        .join('')}
      </tbody>
    </table>
  </div>

  <div  class="main_header_sub text-start">1.4	Choosing transformational change characteristics to assess </div> 
  <blockquote class=" paragraph blockquote text-start ">
            <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
             Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
              took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
              </p>
          </blockquote>
   </div>
   
   ${footer.replace('#pageNumber#', pageNumber.toString())}
   
    </div>`;
    return page_one + page_two;
  }

  contentTwo(header: string, footer: string, contentTwo: ReportContentTwo): string {
    let pageNumber = 5;
    const assessment = [];

    const page_1 = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">2.	IMPACT ASSESSMENT (PART III)</div>
  <div  class="main_header_sub text-start">2.1	Assessment of the starting situation </div> 
  <blockquote class=" paragraph blockquote text-start ">
  <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
   Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
    took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
    </p>
</blockquote>


<div class="report-table-sm">
<figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
<table class="table  table-bordered border-dark">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Process Characteristic</th>
      <th scope="col">Indicators</th>
    </tr>
  </thead>
  <tbody class="table-active">
   <tr>
    <td rowspan="3" >Technology</td>
    <td>Research and development</td>
    <td>test indicators</td>
   
    
  </tr>
  <tr>
  <td>Adoption</td>
  <td>test indicators</td>
  </tr>
   <tr>
  <td>Scale up</td>
  <td>test indicators</td>
  </tr>


  <tr>

  <td rowspan="3" >Agents  </td>
  <td>Entrepreneurs</td>
  <td>test indicators</td>
 </tr>
<tr>
<td>Coalition of advocates </td>
<td>test indicators</td>
</tr>
 <tr>
<td>Beneficiaries</td>
<td>test indicators</td>
</tr>
<tr>

<td rowspan="3" >Incentives </td>
<td>Economic and non-economic incentives</td>
<td>test indicators</td>
</tr>
<tr>
<td>Disincentives</td>
<td>test indicators</td>
</tr>
<tr>
<td>Institutions and regulations</td>
<td>test indicators</td>
</tr>
<tr>

<td rowspan="3" >Norms </td>
<td>Awareness</td>
<td>test indicators</td>
</tr>
<tr>
<td>Behaviour</td>
<td>test indicators</td>
</tr>
<tr>
<td>Social norms</td>
<td>test indicators</td>
</tr>


  </tbody>
</table>
</div>
<blockquote class=" paragraph blockquote text-start ">
<p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
 Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
  took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
  </p>
</blockquote>


  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;
    const page_2 = `  <div id="page_5" class="page text-center" >
   ${header}
   <div class="content">
  
    
   <blockquote class=" paragraph blockquote text-start ">
   <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
     took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
     </p>
 </blockquote>
 
 
 <div class="report-table-sm">
 <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome Characteristic</th>
       <th scope="col">Indicators </th>
     </tr>
   </thead>
   <tbody class="table-active">
    <tr>
     <td rowspan="3" >Scale of outcome - GHGs </td>
     <td>Macro level</td>
     <td>test indicators</td>
    
     
   </tr>
   <tr>
   <td>Medium level</td>
   <td>test indicators</td>
   </tr>
    <tr>
   <td>Micro level</td>
   <td>test indicators</td>
   </tr>
 
 
   <tr>
 
   <td rowspan="3" >Scale of outcome – sustainable development  </td>
   <td>Macro level</td>
   <td>test indicators</td>
  </tr>
 <tr>
 <td>Medium level </td>
 <td>test indicators</td>
 </tr>
  <tr>
 <td>Micro level</td>
 <td>test indicators</td>
 </tr>
 <tr>
 
 <td rowspan="3" >Outcome sustained over time - GHGs </td>
 <td>Macro level</td>
 <td>test score</td>
 </tr>
 <tr>
 <td>Medium level </td>
 <td>test indicators</td>
 </tr>
  <tr>
 <td>Micro level</td>
 <td>test indicators</td>
 </tr>
 <tr>
 
 <td rowspan="3" >Outcome sustained over time – sustainable development </td>
 <td>Macro level</td>
 <td>test indicators</td>
 </tr>
 <tr>
 <td>Medium level </td>
 <td>test indicators</td>
 </tr>
  <tr>
 <td>Micro level</td>
 <td>test indicators</td>
 </tr>
 
 
   </tbody>
 </table>
 </div>

 
 
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    const page_3 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
    <div  class="main_header_sub text-start">2.2	Ex-ante assessment </div> 
    <blockquote class=" paragraph blockquote text-start ">
    <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
      took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
      </p>
  </blockquote>
  
  
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Process Characteristic</th>
        <th scope="col">Score</th>
        <th scope="col">Rationale justifying the score </th>
        <th scope="col">Indicator value at starting situation</th>
        <th scope="col">Indicator value for expected transformation </th>
      </tr>
    </thead>
    <tbody class="table-active">
     <tr>
      <td rowspan="3" >Technology</td>
      <td>Research and development</td>
      <td>test value</td>
      <td>test value</td>
      <td>test value</td>
      <td>test value</td>
      
     
      
    </tr>
    <tr>
    <td>Adoption</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    </tr>
     <tr>
    <td>Scale up</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    </tr>
  
  
    <tr>
  
    <td rowspan="3" >Agents  </td>
    <td>Entrepreneurs</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
   </tr>
  <tr>
  <td>Coalition of advocates </td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
   <tr>
  <td>Beneficiaries</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  
  <td rowspan="3" >Incentives </td>
  <td>Economic and non-economic incentives</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Disincentives</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Institutions and regulations</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  
  <td rowspan="3" >Norms </td>
  <td>Awareness</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Behaviour</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Social norms</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  
  
    </tbody>
  </table>
  </div>
 
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;
    const page_4 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
   
  
    <blockquote class=" paragraph blockquote text-start ">
    <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
      took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
      </p>
  </blockquote>
  
  
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Score</th>
        <th scope="col">Rationale justifying the score </th>
        <th scope="col">Indicator value at starting situation </th>
        <th scope="col">Indicator value for expected transformation  </th>
      </tr>
    </thead>
    <tbody class="table-active">
     <tr>
      <td rowspan="3" >Scale of outcome - GHGs </td>
      <td>Macro level</td>
      <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
     
      
    </tr>
    <tr>
    <td>Adoption</td>
    <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
    </tr>
     <tr>
    <td>Scale up</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    </tr>
  
  
    <tr>
  
    <td rowspan="3" >Agents  </td>
    <td>Entrepreneurs</td>
    <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
   </tr>
  <tr>
  <td>Coalition of advocates </td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
   <tr>
  <td>Beneficiaries</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  
  <td rowspan="3" >Incentives </td>
  <td>Economic and non-economic incentives</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Disincentives</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Institutions and regulations</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  
  <td rowspan="3" >Norms </td>
  <td>Awareness</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Behaviour</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  <tr>
  <td>Social norms</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  </tr>
  
  
    </tbody>
  </table>
  </div>
 
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;
    const page_5 = `  <div id="page_5" class="page text-center" >
     ${header}
     <div class="content">
    
   
     <blockquote class=" paragraph blockquote text-start ">
     <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
       took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
       </p>
   </blockquote>
   
   
   <div class="report-table-sm">
   <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Score</th>
         <th scope="col">Rationale for scoring </th>
         <th scope="col">Relative importance of category including rationale</th>
         
       </tr>
     </thead>
     <tbody class="table-active">
      <tr>
       <td   >Technology</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td> 
     </tr>
     <tr>
     <td   >Agents</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td> 
   </tr>
   <tr>
   <td   >Incentives</td>
<td>test value</td>
<td>test value</td>
<td>test value</td> 
 </tr>
 <tr>
 <td   >Norms </td>
<td>test value</td>
<td>test value</td>
<td>test value</td> 
</tr>
    
   
     </tbody>
   </table>
   </div>
  
   
   
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;
    const page_6 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
    
      <blockquote class=" paragraph blockquote text-start ">
      <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
       Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
        </p>
    </blockquote>
    
    
    <div class="report-table-sm">
    <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
      <tr>
      <th scope="col">Category</th>
      <th scope="col">Score</th>
      <th scope="col">Rationale for scoring </th>
      
      
    </tr>
  </thead>
  <tbody class="table-active">
   <tr>
    <td   >Scale of outcome-GHGs</td>
<td>test value</td>
<td>test value</td>
 
  </tr>
  <tr>
  <td   >Scale of outcome – sustainable development</td>
<td>test value</td>
<td>test value</td>
 
</tr>
<tr>
<td   >Outcome sustained over time – GHGs</td>
<td>test value</td>
<td>test value</td>
 
</tr>
<tr>
<td   >Outcome sustainable over time – sustainable development </td>
<td>test value</td>
<td>test value</td>
 
</tr>
 
    
      </tbody>
    </table>
    </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;

    const page_7 = `  <div id="page_5" class="page text-center" >
       ${header}
       <div class="content">
       <div  class="main_header_sub text-start">2.3	Ex-post assessment </div> 
       <blockquote class=" paragraph blockquote text-start ">
       <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
         took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
         </p>
     </blockquote>
     
     
     <div class="report-table-sm">
     <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Process Characteristic</th>
           <th scope="col">Score</th>
           <th scope="col">Rationale justifying the score </th>
           <th scope="col">Indicator value at starting situation</th>
           <th scope="col">Indicator value observed </th>
         </tr>
       </thead>
       <tbody class="table-active">
        <tr>
         <td rowspan="3" >Technology</td>
         <td>Research and development</td>
         <td>test value</td>
         <td>test value</td>
         <td>test value</td>
         <td>test value</td>
         
        
         
       </tr>
       <tr>
       <td>Adoption</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
        <tr>
       <td>Scale up</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
     
     
       <tr>
     
       <td rowspan="3" >Agents  </td>
       <td>Entrepreneurs</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
      </tr>
     <tr>
     <td>Coalition of advocates </td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
      <tr>
     <td>Beneficiaries</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Incentives </td>
     <td>Economic and non-economic incentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Disincentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Institutions and regulations</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Norms </td>
     <td>Awareness</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Behaviour</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Social norms</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     
     
       </tbody>
     </table>
     </div>
    
     
     
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    const page_8 = `  <div id="page_5" class="page text-center" >
       ${header}
       <div class="content">
      
     
       <blockquote class=" paragraph blockquote text-start ">
       <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
         took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
         </p>
     </blockquote>
     
     
     <div class="report-table-sm">
     <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Outcome Characteristic</th>
           <th scope="col">Score</th>
           <th scope="col">Rationale justifying the score </th>
           <th scope="col">Indicator value at starting situation </th>
           <th scope="col">Indicator value observed </th>
         </tr>
       </thead>
       <tbody class="table-active">
        <tr>
         <td rowspan="3" >Scale of outcome - GHGs </td>
         <td>Macro level</td>
         <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
        
         
       </tr>
       <tr>
       <td>Adoption</td>
       <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
       </tr>
        <tr>
       <td>Scale up</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
     
     
       <tr>
     
       <td rowspan="3" >Agents  </td>
       <td>Entrepreneurs</td>
       <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
      </tr>
     <tr>
     <td>Coalition of advocates </td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
      <tr>
     <td>Beneficiaries</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Incentives </td>
     <td>Economic and non-economic incentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Disincentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Institutions and regulations</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     
     <td rowspan="3" >Norms </td>
     <td>Awareness</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Behaviour</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Social norms</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     
     
       </tbody>
     </table>
     </div>
    
     
     
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    const page_9 = `  <div id="page_5" class="page text-center" >
        ${header}
        <div class="content">
       
      
        <blockquote class=" paragraph blockquote text-start ">
        <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
          took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
          </p>
      </blockquote>
      
      
      <div class="report-table-sm">
      <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Score</th>
            <th scope="col">Rationale for scoring </th>
            <th scope="col">Relative importance of category including rationale</th>
            
          </tr>
        </thead>
        <tbody class="table-active">
         <tr>
          <td   >Technology</td>
      <td>test value</td>
      <td>test value</td>
      <td>test value</td> 
        </tr>
        <tr>
        <td   >Agents</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td> 
      </tr>
      <tr>
      <td   >Incentives</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td> 
    </tr>
    <tr>
    <td   >Norms </td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td> 
   </tr>
       
      
        </tbody>
      </table>
      </div>
     
      
      
        </div>
        
        ${footer.replace('#pageNumber#', (pageNumber++).toString())}
        
         </div>`;

    const page_10 = `  <div id="page_5" class="page text-center" >
         ${header}
         <div class="content">
        
       
         <blockquote class=" paragraph blockquote text-start ">
         <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
           took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
           </p>
       </blockquote>
       
       
       <div class="report-table-sm">
       <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
       <table class="table  table-bordered border-dark">
         <thead class="table-primary  border-dark">
         <tr>
         <th scope="col">Category</th>
         <th scope="col">Score</th>
         <th scope="col">Rationale for scoring </th>
         
         
       </tr>
     </thead>
     <tbody class="table-active">
      <tr>
       <td   >Scale of outcome-GHGs</td>
   <td>test value</td>
   <td>test value</td>
    
     </tr>
     <tr>
     <td   >Scale of outcome – sustainable development</td>
   <td>test value</td>
   <td>test value</td>
    
   </tr>
   <tr>
   <td   >Outcome sustained over time – GHGs</td>
   <td>test value</td>
   <td>test value</td>
    
   </tr>
   <tr>
   <td   >Outcome sustainable over time – sustainable development </td>
   <td>test value</td>
   <td>test value</td>
    
   </tr>
    
       
         </tbody>
       </table>
       </div>
      
       
       
         </div>
         
         ${footer.replace('#pageNumber#', (pageNumber++).toString())}
         
          </div>`;

    const page_11 = `  <div id="page_5" class="page text-center" >
         ${header}
         <div class="content">
         <div  class="main_header_sub text-start">2.4	Monitoring (Part IV)</div> 
       
         <blockquote class=" paragraph blockquote text-start ">
         <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
           took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
           </p>
       </blockquote>
       
       
       <div class="report-table-sm">
       <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
       <table class="table  table-bordered border-dark">
         <thead class="table-primary  border-dark">
         <tr>
         <th scope="col">Indicator</th>
         <th scope="col">Type of data (quantitative/ qualitative)</th>
         <th scope="col">Monitoring frequency and date of collection</th>
         <th scope="col">Data source/ collection method </th>
         <th scope="col">Responsible entity </th>
         <th scope="col">Observed data (unit)</th>
         
         
       </tr>
     </thead>
     <tbody class="table-active">
      <tr>
      <td>test value</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td>
   <td>test value</td>
    
     </tr>
     <tr>
     <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
  <td>test value</td>
   
    </tr>
    <tr>
    <td>test value</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td>
 <td>test value</td>
  
   </tr>
   <tr>
   <td>test value</td>
<td>test value</td>
<td>test value</td>
<td>test value</td>
<td>test value</td>
<td>test value</td>
 
  </tr>
    
    
       
         </tbody>
       </table>
       </div>
      
       <div  class="main_header_sub text-start">2.5	Decision making and using results (Part V) </div> 
       
         <blockquote class=" paragraph blockquote text-start ">
         <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
           took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
           </p>
       </blockquote>  
       
         </div>
         
         ${footer.replace('#pageNumber#', (pageNumber++).toString())}
         
          </div>`;

    return (
      page_1 +
      page_2 +
      page_3 +
      page_4 +
      page_5 +
      page_6 +
      page_7 +
      page_8 +
      page_9 +
      page_10 +
      page_11
    );
  }
}
