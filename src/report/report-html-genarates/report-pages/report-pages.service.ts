import { Injectable } from '@nestjs/common';
import {
  ComparisonReportReportContentFour,
  ComparisonReportReportContentOne,
  ComparisonReportReportContentThree,
  ComparisonReportReportContentTwo,
  ComparisonReportReportTableOfContent,
  ReportContentOne,
  ReportContentTwo,
  ReportCoverPage,
  ReportTableOfContent,
} from 'src/report/dto/report.dto';

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
    let pageNumber = 1;

    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Single Intervention Information ....................................................................................................................................................................</div><div ><bdi>.............2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the policy or action .................................................................................................................................................................</div><div ><bdi>.................2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2	Understanding the transformational vision of the intervention and its context ..................................................................................................................</div><div ><bdi>.............3</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3	Assessment information ........................................................................................................................................................................</div><div ><bdi>.............4</bdi></div> </div>
  

    <div class="table-of-content-header-item"><div >2. Impact Assessment .................................................................................................................................................................</div><div ><bdi>.....5</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Process characteristics assessment  ................................................................................................................................</div><div ><bdi>.................5</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes characteristics assessment ....................................................................................................................................................</div><div ><bdi>.....6</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.3	Process categories assessment ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.4	Outcomes categories assessment  ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>
  </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    return page_one;
  }

  contentOne(
    header: string,
    footer: string,
    contentOne: ReportContentOne,
  ): string {
    let pageNumber = 2;
    const policyOrActionsDetails = contentOne.policyOrActionsDetails;

    // <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1 Single Intervention Information</div>
 
 <div  class="main_header_sub text-start">1.1 Describe the policy or action </div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${policyOrActionsDetails
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
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    const understanPolicyOrActions = contentOne.understanPolicyOrActions;
    const barriers = contentOne.barriers;
    const page_2 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
   <div  class="main_header_sub text-start">1.2	Understanding the context of policy or action </div> 
      
        
        <div class="report-table-sm">
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
     
    <div class="report-table-sm">
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

  
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_3 = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">

  <div  class="main_header_sub text-start">1.3	Assessment information</div> 

  <div class="report-table-sm">
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Information</th>
        <th scope="col">Description </th>
      
      </tr>
    </thead>
    <tbody class="table-active">
    <tr><td>
    Assesment type
    </td><td> 
    ${contentOne.assessmetType ? contentOne.assessmetType : 'N/A'}
    </td></tr>
    <tr><td>
    Geographical area covered
    </td><td> 
    ${contentOne.geograpycalCover ? contentOne.geograpycalCover : 'N/A'}
    </td></tr>
    <tr><td>
    Sectors covered 
    </td><td> 
    ${contentOne.sectorCoverd ? contentOne.sectorCoverd : 'N/A'}
    </td></tr>
    <tr><td>
    Opportunities for stakeholders to participate in the assessment
    </td><td> 
    ${contentOne.opportunities ? contentOne.opportunities : 'N/A'}
    </td></tr>
    <tr><td>
    Principles on which the assessment is based
    </td><td> 
    ${contentOne.principles ? contentOne.principles : 'N/A'}
    </td></tr>
    
    </tbody>
  </table>
</div>




  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    const catagory_out = contentOne.outcomecharacteristics;

    const page_4 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
  
   <div  class="main_header_sub text-start">1.4	Choosing transformational change characteristics to assess </div> 
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
      <th scope="col">Description - specific to a policy or action </th>
      <th scope="col">Relevant/ Possibly relevant/ Not relevant</th>
    </tr>
  </thead>
  <tbody class="table-active">
  ${catagory_out
    .map((a: { rows: number; name: string; characteristics: any[] }) =>
      a.characteristics
        .map((b, index) => {
          if (!index) {
            return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.comment ? b.comment : '-'}</td>
      <td>${b.relevance ? b.relevance : '-'}</td>
     </tr>`;
          } else {
            return `<tr>
            <td>${b.name ? b.name : '-'}</td>
            <td>${b.comment ? b.comment : '-'}</td>
            <td>${b.relevance ? b.relevance : '-'}</td>
            </tr>`;
          }
        })
        .join(''),
    )
    .join('')}
  

  </tbody>
</table>
</div>
    </div>
    
    ${footer.replace('#pageNumber#', pageNumber.toString())}
    
     </div>`;

    const catagory_process = contentOne.prossescharacteristics;
    const page_5 = `  <div id="page_9" class="page text-center" >
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
       <th scope="col">Process Characteristic</th>
       <th scope="col">Description - specific to a policy or action </th>
       <th scope="col">Relevant/ Possibly relevant/ Not relevant</th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${catagory_process
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.comment ? b.comment : '-'}</td>
       <td>${b.relevance ? b.relevance : '-'}</td>
      </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
             <td>${b.comment ? b.comment : '-'}</td>
             <td>${b.relevance ? b.relevance : '-'}</td>
             </tr>`;
           }
         })
         .join(''),
     )
     .join('')}
   
 
   </tbody>
 </table>
 </div>
     </div>
     
     ${footer.replace('#pageNumber#', pageNumber.toString())}
     
      </div>`;
    return page_1 + page_2 + page_3;
  }

  contentTwo(
    header: string,
    footer: string,
    contentTwo: ReportContentTwo,
  ): string {
    let pageNumber = 5;
    const prossesAssesmentStartingSituation =
      contentTwo.prossesAssesmentStartingSituation;

    const page_1 = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">2.	IMPACT ASSESSMENT</div>
  <div  class="main_header_sub text-start">2.1	Process characteristics assessment   </div> 



<div class="report-table-sm">
<figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
<table class="table  table-bordered border-dark">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Process Characteristic</th>
      <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
      <th scope="col">Likelihood score  </th>
      <th scope="col">Rationale justifying the score  </th>
      <th scope="col">Supporting Documents Supplied </th>
    </tr>
  </thead>
  <tbody class="table-active">
  ${prossesAssesmentStartingSituation
    .map((a: { rows: number; name: string; characteristics: any[] }) =>
      a.characteristics
        .map((b, index) => {
          if (!index) {
            return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.relavance ? b.relavance : '-'}</td>
      <td>${b.likelihoodscore ? b.likelihoodscore : '-'}</td>
      <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
      <td>${
        b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
      }</td>
    
     </tr>`;
          } else {
            return `<tr>
            <td>${b.name ? b.name : '-'}</td>
      <td>${b.relavance ? b.relavance : '-'}</td>
      <td>${b.likelihoodscore ? b.likelihoodscore : '-'}</td>
      <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
      <td>${
        b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
      }</td>
            </tr>`;
          }
        })
        .join(''),
    )
    .join('')}
  

  </tbody>


  </tbody>
</table>
</div>



  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    const scale_ghg = contentTwo.scale_ghg;
    const sustained_ghg = contentTwo.sustained_ghg;
    const page_2 = `  <div id="page_5" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header_sub text-start">2.2	Outcomes characteristics assessment  </div> 
    

 
 
 <div class="report-table-sm">
 <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome Characteristic</th>
       <th scope="col">Is the characteristic within the assessment boundaries?  </th>
       <th scope="col">Score  </th>
       <th scope="col">Rationale justifying the score </th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${scale_ghg
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
      
    
     </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
             <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
             <td>${b.score ? b.score : '-'}</td>
             <td>${b.ustifying ? b.ustifying : '-'}</td>
            </tr>`;
           }
         })
         .join(''),
     )
     .join('')}
 
 
   </tbody>
 </table>
 </div>
 <div class="report-table-sm">
 <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome Characteristic</th>
       <th scope="col">Is the characteristic within the assessment boundaries?  </th>
       <th scope="col">Score  </th>
       <th scope="col">Rationale justifying the score </th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${sustained_ghg
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
      
    
     </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
             <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
             <td>${b.score ? b.score : '-'}</td>
             <td>${b.ustifying ? b.ustifying : '-'}</td>
            </tr>`;
           }
         })
         .join(''),
     )
     .join('')}
 
 
   </tbody>
 </table>
 </div>
 
 
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const scale_adaptation = contentTwo.scale_adaptation;
    const sustained_adaptation = contentTwo.sustained_adaptation;

    const page_3 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
 
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?  </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score </th>
      </tr>
    </thead>
    <tbody class="table-active">
    ${scale_adaptation
      .map((a: { rows: number; name: string; characteristics: any[] }) =>
        a.characteristics
          .map((b, index) => {
            if (!index) {
              return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
       <td>${b.score ? b.score : '-'}</td>
       <td>${b.ustifying ? b.ustifying : '-'}</td>
       
     
      </tr>`;
            } else {
              return `<tr>
              <td>${b.name ? b.name : '-'}</td>
              <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
              <td>${b.score ? b.score : '-'}</td>
              <td>${b.ustifying ? b.ustifying : '-'}</td>
             </tr>`;
            }
          })
          .join(''),
      )
      .join('')}
  
  
    </tbody>
  </table>
  </div>
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?  </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score </th>
      </tr>
    </thead>
    <tbody class="table-active">
    ${sustained_adaptation
      .map((a: { rows: number; name: string; characteristics: any[] }) =>
        a.characteristics
          .map((b, index) => {
            if (!index) {
              return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
       <td>${b.score ? b.score : '-'}</td>
       <td>${b.ustifying ? b.ustifying : '-'}</td>
       
     
      </tr>`;
            } else {
              return `<tr>
              <td>${b.name ? b.name : '-'}</td>
              <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
              <td>${b.score ? b.score : '-'}</td>
              <td>${b.ustifying ? b.ustifying : '-'}</td>
             </tr>`;
            }
          })
          .join(''),
      )
      .join('')}
  
  
    </tbody>
  </table>
  </div>
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;
    
    const scale_sd = contentTwo.scale_sd;
    
    const page_4 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
   
  
  
  <div class="report-table-sm">
  <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
      <tr>
      <th scope="col">Category</th>
      <th scope="col">Sustainable Development Goal</th>
      <th scope="col">Could the intervention have an impact on this particular SDG?</th>
      <th scope="col">Outcome Characteristic</th>
      <th scope="col">Is the characteristic within the assessment boundaries?</th>
      <th scope="col">Score  </th>
      <th scope="col">Rationale justifying the score</th>
      </tr>
    </thead>
    <tbody class="table-active">
    
    ${scale_sd.sdg
      .map(
        (
          a: {
            rows: number;
            name: string;
            impact: string;
            characteristics: any[];
          },
          index,
        ) => {
          if (!index) {
            return a.characteristics
              .map((b, index) => {
                if (!index) {
                  return `<tr>
      <td rowspan="${scale_sd.rows}" >${scale_sd.name}</td>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td rowspan="${a.rows}" >${a.impact}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
    
     </tr>`;
                } else {
                  return `<tr>
            <td>${b.name ? b.name : '-'}</td>
    <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
    <td>${b.score ? b.score : '-'}</td>
    <td>${b.ustifying ? b.ustifying : '-'}</td>
            </tr>`;
                }
              })
              .join('');
          } else {
            return a.characteristics
              .map((b, index) => {
                if (!index) {
                  return `<tr>
<td rowspan="${a.rows}" >${a.name}</td>
<td rowspan="${a.rows}" >${a.impact}</td>
<td>${b.name ? b.name : '-'}</td>
<td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
<td>${b.score ? b.score : '-'}</td>
<td>${b.ustifying ? b.ustifying : '-'}</td>

</tr>`;
                } else {
                  return `<tr>
   <td>${b.name ? b.name : '-'}</td>
<td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
<td>${b.score ? b.score : '-'}</td>
<td>${b.ustifying ? b.ustifying : '-'}</td>
   </tr>`;
                }
              })
              .join('');
          }
        },
      )
      .join('')}
  
  
    </tbody>
  </table>
  </div>
 
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    const sustained_sd = contentTwo.sustained_sd;

    const page_5 = `  <div id="page_5" class="page text-center" >
    ${header}
    <div class="content">
   
  
   
  
  
    <div class="report-table-sm">
    <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
        <th scope="col">Category</th>
        <th scope="col">Sustainable Development Goal</th>
        <th scope="col">Could the intervention have an impact on this particular SDG?</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?</th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score</th>
        </tr>
      </thead>
      <tbody class="table-active">
      
      ${sustained_sd.sdg
        .map(
          (
            a: {
              rows: number;
              name: string;
              impact: string;
              characteristics: any[];
            },
            index,
          ) => {
            if (!index) {
              return a.characteristics
                .map((b, index) => {
                  if (!index) {
                    return `<tr>
        <td rowspan="${sustained_sd.rows}" >${sustained_sd.name}</td>
        <td rowspan="${a.rows}" >${a.name}</td>
        <td rowspan="${a.rows}" >${a.impact}</td>
        <td>${b.name ? b.name : '-'}</td>
        <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
        <td>${b.score ? b.score : '-'}</td>
        <td>${b.ustifying ? b.ustifying : '-'}</td>
      
       </tr>`;
                  } else {
                    return `<tr>
              <td>${b.name ? b.name : '-'}</td>
      <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
      <td>${b.score ? b.score : '-'}</td>
      <td>${b.ustifying ? b.ustifying : '-'}</td>
              </tr>`;
                  }
                })
                .join('');
            } else {
              return a.characteristics
                .map((b, index) => {
                  if (!index) {
                    return `<tr>
  <td rowspan="${a.rows}" >${a.name}</td>
  <td rowspan="${a.rows}" >${a.impact}</td>
  <td>${b.name ? b.name : '-'}</td>
  <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
  <td>${b.score ? b.score : '-'}</td>
  <td>${b.ustifying ? b.ustifying : '-'}</td>
  
  </tr>`;
                  } else {
                    return `<tr>
     <td>${b.name ? b.name : '-'}</td>
  <td>${b.withinboundaries ? b.withinboundaries : '-'}</td>
  <td>${b.score ? b.score : '-'}</td>
  <td>${b.ustifying ? b.ustifying : '-'}</td>
     </tr>`;
                  }
                })
                .join('');
            }
          },
        )
        .join('')}
    
    
      </tbody>
    </table>
    </div>
 
  
  
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;


    let process_categories_assessment=contentTwo.process_categories_assessment;
    let outcomes_categories_assessment=contentTwo.outcomes_categories_assessment;
    
    const page_6 = `  <div id="page_5" class="page text-center" >
     ${header}
     <div class="content">
     <div  class="main_header_sub text-start">2.3	 Process categories assessment   </div> 
   
   
   <div class="report-table-sm">
   <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Category	Aggrgated Score</th>
      
         
       </tr>
     </thead>
     <tbody class="table-active">
     ${process_categories_assessment
       .map(
         (a: {
          category: any;
          category_score: any;
           
         }) => {
           return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${a.category_score.value ? a.category_score.value : '-'}</td>
             
              </tr>`;
         },
       )
       .join('')}
    
   
     </tbody>
   </table>
   </div>
  
   <div  class="main_header_sub text-start">2.4	Outcomes categories assessment </div> 

   <div class="report-table-sm">
   <figcaption class="figure-caption-table figure-caption text-start">table 2</figcaption>
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Category	Aggrgated Score</th>
      
         
       </tr>
     </thead>
     <tbody class="table-active">
     ${outcomes_categories_assessment
       .map(
        (a: {
          category: any;
          category_score: any;
           
         }) => {
           return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${a.category_score.value ? a.category_score.value : '-'}</td>
             
              </tr>`;
         },
       )
       .join('')}
    
   
     </tbody>
   </table>
   </div>
   
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;

    const outcomeDescribeResult = contentTwo.outcomeDescribeResult;
    const page_7 = `  <div id="page_5" class="page text-center" >
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
  ${outcomeDescribeResult
    .map(
      (a: {
        relative_importance: any;
        score: any;
        justifying_score: any;
        name: string;
      }) => {
        return `<tr>
            <td>${a.name ? a.name : '-'}</td>
            <td>${a.score ? a.score : '-'}</td>
           <td>${a.justifying_score ? a.justifying_score : '-'}</td>
          
            </tr>`;
      },
    )
    .join('')}
 
    
      </tbody>
    </table>
    </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;

    const page_8= `  <div id="page_5" class="page text-center" >
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
     <td>Behavior</td>
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
     <td>Behavior</td>
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

    const page_11 = `  <div id="page_5" class="page text-center" >
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

    const page_12 = `  <div id="page_5" class="page text-center" >
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
      page_1 + page_2 + page_3+
      page_4 +
      page_5 +
      page_6 
      // page_7 +
      // page_8 +
      // page_9 +
      // page_10 +
      // page_11
    );
  }




  comparisonCoverPage(coverPage: ReportCoverPage): string {
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


  comparisonTableOfContent(
    header: string,
    footer: string,
    tableOfContent: ComparisonReportReportTableOfContent,
  ): string {
    let pageNumber = 5;

    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Single Intervention Information ....................................................................................................................................................................</div><div ><bdi>.............10</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the policy or action ................................................................................................................................</div><div ><bdi>.................11</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2	Understanding the transformational vision of the intervention and its context ..................................................................................................................................................</div><div ><bdi>.............11</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3	Assessment information ..................................................................................................................................................</div><div ><bdi>.............11</bdi></div> </div>
  

    <div class="table-of-content-header-item"><div >2. Impact Assessment .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Process characteristics assessment  ................................................................................................................................</div><div ><bdi>.................13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes characteristics assessment ....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.3	Process categories assessment ....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.4	Outcomes categories assessment  ....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
  </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    return page_one;
  }

  comparisonContentOne(
    header: string,
    footer: string,
    contentOne: ComparisonReportReportContentOne,
  ): string {
return ''
  }
  comparisonContentTwo(
    header: string,
    footer: string,
    contentOne: ComparisonReportReportContentTwo,
  ): string {
    return ''
  }
  comparisonContentThree(
    header: string,
    footer: string,
    contentOne: ComparisonReportReportContentThree,
  ): string {
    return ''
  }
  comparisonContentFour(
    header: string,
    footer: string,
    contentOne: ComparisonReportReportContentFour,
  ): string {
    return ''
  }
}
