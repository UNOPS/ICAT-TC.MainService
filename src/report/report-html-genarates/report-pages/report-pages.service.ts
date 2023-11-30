import { Injectable } from '@nestjs/common';
import { TotalInvestment } from 'src/investor-tool/entities/total-investment.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import {
  ComparisonReportReportContentFour,
  ComparisonReportReportContentOne,
  ComparisonReportReportContentThree,
  ComparisonReportReportContentTwo,
  ComparisonReportReportTableOfContent,
  ReportCarbonMarketDtoContentFive,
  ReportCarbonMarketDtoContentFour,
  ReportCarbonMarketDtoContentOne,
  ReportCarbonMarketDtoContentThree,
  ReportCarbonMarketDtoContentTwo,
  ReportCarbonMarketDtoCoverPage,
  ReportCarbonMarketDtoTableOfContent,
  ReportContentOne,
  ReportContentTwo,
  ReportCoverPage,
  ReportTableOfContent,
} from 'src/report/dto/report.dto';

@Injectable()
export class ReportPagesService {
  constructor() { }
xData = [
    {label: 'Major', value: 3},
    {label: 'Moderate', value: 2},
    {label: 'Minor', value: 1},
    {label: 'None', value: 0},
    {label: 'Minor Negative', value: -1},
    {label: 'Moderate Negative', value: -2},
    {label: 'Major Negative', value: -3}
  ]

  yData = [
    {label: 'Very likely', value: 4},
    {label: 'Likely', value: 3},
    {label: 'Possible', value: 2},
    {label: 'Unlikely', value: 1},
    {label: 'Very Unlikely', value: 0}
  ]
  fileServerURL = 'https://icat-tc-tool.climatesi.com/web-api/uploads/'
  coverPage(coverPage: ReportCoverPage): string {
    // console.log("coverpage tool",coverPage.tool)
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
  

    
          ${coverPage.tool=='Investment'?' <div class="row "><div class="col h2 d-flex justify-content-center">TRANSFORMATIONAL CHANGE  </div></div><div class="row "><div class="col h2 d-flex justify-content-center">ASSESSMENT REPORT  </div></div><div class="row "><div class="col h2 d-flex justify-content-center">INVESTMENT & PRIVATE SECTOR TOOL  </div></div>   ':' <div class="row "><div class="col h2 d-flex justify-content-center">TRANSFORMATIONAL CHANGE ASSESSMENT REPORT GENERAL INTERVENTIONS TOOL   </div></div>'}

   <div class="row ">
   <div class="col h4 d-flex justify-content-center">
      
   </div>
</div>
<div class="row ">
<div class="col h4 d-flex justify-content-center">
  
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
    tool:string,
  ): string {
    let pageNumber = 1;
//  console.log("tableOfContent",tool)
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
    ${tool=='Investment'?'<div class="table-of-content-sub-header-item"><div >2.5	Transformational impact matrix  ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>':''}
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
              <th scope="col" colspan="3">Description</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${policyOrActionsDetails
        .map(
          (a: { information: string; description: any; isInvestment: boolean }) => {
            if (a.isInvestment == undefined) {
              // console.log("Investment instrument(s) used",a.isInvestment)
              return '<tr><td>' +
                a.information +
                '</td><td colspan="3">' +
                a.description +
                '</td></tr>'
            }
            else if (a.isInvestment && (a.information == 'Total investment (in USD)')) {
              // console.log("Total investment (in USD)",a.isInvestment)
              return '<tr><td>' +
                a.information +
                '</td><td colspan="3">' +
                a.description +
                '</td></tr>'
            } else if (a.isInvestment && (a.information == 'Investment instrument(s) used')) {
              // console.log("Investment instrument(s) used",a.description.map(inv=>'<td>'+inv.instrument_name+'</td>').join(''))
              return '<tr><td>' +
                a.information +
                '</td>' +
                a.description.map(inv => '<td>' + inv.instrument_name + '</td>').join('') +
                '</tr>'
            }
            else if (a.isInvestment && (a.information == 'Proportion of total investment')) {
              // console.log("Proportion of total investment",a.description.map(inv => '<td>' + inv.propotion + '</td>').join('') )
              return '<tr><td>' +
                a.information +
                '</td>' +
                a.description.map(inv => '<td>' + inv.propotion + '</td>').join('') +
                '</tr>'
            }
          }
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
   
   <div  class="main_header_sub text-start">1.2	Understanding the transformational vision of the intervention and its context  </div> 
      
      <div class="report-table-sm">
      <p>The transformational vision describes how an intervention seeks to change a system towards zero-carbon, resilient and sustainable practices.</p>
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Description of the vision for desired societal, environmental and technical changes</th>
              <th scope="col"></th>
              
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
        <div class="report-table-sm">
        <p>Barriers are obstacles that hindered the transformation of a system or lead to undesired effects of the interventions.</p>
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

  
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_3 = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">

  <div  class="main_header_sub text-start">1.3	Assessment information</div> 

  <div class="report-table-sm">
  <p>It describes the scope of the assessment in terms of the geographical, temporal and sectoral coverage of the policy.</p>
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
    const prossesAssesmentStartingSituation1 =
      contentTwo.prossesAssesmentStartingSituation1;
      const prossesAssesmentStartingSituation2 =
      contentTwo.prossesAssesmentStartingSituation2;
    const page_1 = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">2.	IMPACT ASSESSMENT</div>
  <div  class="main_header_sub text-start">2.1	Process characteristics assessment   </div> 



<div class="report-table-sm">
<p>
  Process characteristics refer to the main drivers of system change based on the existing literature: technology, agents, incentives, and norms. Each of them contains three characteristics. The table below indicates whether each characteristic is relevant or not relevant for the assessment, based on the barriers identified in previously (is the characteristic affected by any of the barriers?) and whether the characteristic is impacted by the intervention being assessed or not. If a characteristic is relevant, the likelihood score indicates the likelihood of the intervention having an impact on this characteristic. The table presents any justification which supports the score and refers to documents which may back this justification.
</p>
<table class="table  table-bordered border-dark">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Process Characteristic</th>
      <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
      <th scope="col">Guiding Question </th>
      <th scope="col">Likelihood score  </th>
      <th scope="col">Rationale justifying the score  </th>
      <th scope="col">Supporting Documents Supplied </th>
    </tr>
  </thead>
  <tbody class="table-active">
  ${prossesAssesmentStartingSituation1
    .map((a: { rows: number; name: string; characteristics: any[] }) =>
      a.characteristics
        .map((b, index) => {
          if (!index) {
            return `<tr>
      <td rowspan="${a.rows}" >${a.name}</td>
      <td>${b.name ? b.name : '-'}</td>
      <td>${b.relavance ? b.relavance : '-'}</td>
      <td>${b.question ? b.question : '-'}</td>
      <td>${b.likelihoodscore}</td>
      <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
      <td>${b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
                  }</td>
    
     </tr>`;
              } else {
                return `<tr>
            <td>${b.name ? b.name : '-'}</td>
      <td>${b.relavance ? b.relavance : '-'}</td>
      <td>${b.question ? b.question : '-'}</td>
      <td>${b.likelihoodscore}</td>
      <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
      <td>${b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
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

   const page_1_1 = `  <div id="page_5" class="page text-center" >
   ${header}

   <div class="content">
   <div class="report-table-sm">
   <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Process Characteristic</th>
       <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
       <th scope="col">Guiding Question </th>
       <th scope="col">Likelihood score  </th>
       <th scope="col">Rationale justifying the score  </th>
       <th scope="col">Supporting Documents Supplied </th>
     </tr>
   </thead>
   <tbody class="table-active">
   ${prossesAssesmentStartingSituation2
     .map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
         .map((b, index) => {
           if (!index) {
             return `<tr>
       <td rowspan="${a.rows}" >${a.name}</td>
       <td>${b.name ? b.name : '-'}</td>
       <td>${b.relavance ? b.relavance : '-'}</td>
       <td>${b.question ? b.question : '-'}</td>
       <td>${b.likelihoodscore}</td>
       <td>${b.rationalejustifying ? b.rationalejustifying : '-'}</td>
       <td>${
         b.Supportingsdocumentssupplied ? b.Supportingsdocumentssupplied : '-'
       }</td>
     
      </tr>`;
           } else {
             return `<tr>
             <td>${b.name ? b.name : '-'}</td>
       <td>${b.relavance ? b.relavance : '-'}</td>
       <td>${b.question ? b.question : '-'}</td>
       <td>${b.likelihoodscore}</td>
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
<p>
Outcome characteristics refer to the scale and sustained nature of outcomes resulting from a policy. Outcomes are measured in terms of GHG emissions reductions, climate adaptation impacts and selected sustainable development impacts across environmental, social and economic dimensions (e.g. air quality, health, jobs, gender equality, energy security). Users assess both the scale  and the sustained nature of selected impacts of the policy on GHGs, Adaptation and sustainable development. 
</p>
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

    let process_categories_assessment =
      contentTwo.process_categories_assessment;
    let outcomes_categories_assessment =
      contentTwo.outcomes_categories_assessment;

    const page_6 = `  <div id="page_5" class="page text-center" >
     ${header}
     <div class="content">
     <div  class="main_header_sub text-start">2.3	 Process categories assessment   </div> 
   
   
   <div class="report-table-sm">
  
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Aggrgated Score</th>
      
         
       </tr>
     </thead>
     <tbody class="table-active">
     ${process_categories_assessment
        .map((a: { category: any; category_score: any }) => {
          return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${a.category_score.value != null &&
              a.category_score.value != undefined
              ? a.category_score.value
              : '-'
            }</td>
             
              </tr>`;
        })
        .join('')}
        <tr>
          <td class="bold-table-row">Process score</td>
          <td class="bold-table-row">${contentTwo.processScore!==null ? contentTwo.processScore : '-'}</td>
        </tr>
       
   
     </tbody>
   </table>
   </div>
  
   <div  class="main_header_sub text-start">2.4	Outcomes categories assessment </div> 

   <div class="report-table-sm">
  
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Aggrgated Score</th>
      
         
       </tr>
     </thead>
     <tbody class="table-active">
     ${outcomes_categories_assessment
        .map((a: { category: any; category_score: any }) => {
          return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${a.category_score.value != null &&
              a.category_score.value != undefined
              ? a.category_score.value
              : '-'
            }</td>
             
              </tr>`;
        })
        .join('')}
         <tr>
          <td class="bold-table-row">Outcomes score </td>
          <td class="bold-table-row">${contentTwo.outcomeScore!==null?contentTwo.outcomeScore:'-'}</td>
        </tr>
    
   
     </tbody>
   </table>
   </div>
    
   
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;
      const page_6_1 = `  <div id="page_6_1" class="page text-center" >
      ${header}
      <div class="content">
      <div  class="main_header_sub text-start">2.5	Transformational impact matrix </div> 
      <div class="report-table-sm">
      <table id="heatmap" class="heatmap" style="text-align: center;">
         <tbody>
        <tr>
            <td></td>
            <td colspan="8">​​Outcome: Extent and sustained nature of transformation</td>
        </tr>
        <tr>
            <td class="vertical-text-chrome"  rowspan="6">Process: Likelihood of transformation</td>
            <td></td>
           
            ${this.xData
              .map((x) => {
                return `
                 <td  >${x.label}</td> `;
              })
              .join('')}
        </tr>

        ${this.yData
          .map((y) => {
            return `
             <tr > 
              <td >${y.label}</td> 
              
              ${this.generateHeatMapforinvestment(y.value,contentTwo)}
            </tr> `;
          })
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

    const page_8 = `  <div id="page_5" class="page text-center" >
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

    
    if(contentTwo.tool=='Investment'){
  
      return (
        page_1 +page_1_1 + page_2 + page_3 + page_4 + page_5 + page_6 +page_6_1
      );
    }
    else{
      return (
        page_1 +page_1_1 + page_2 + page_3 + page_4 + page_5 + page_6
      );
    }
     
  }

  coverCarbonMarketPage(coverPage: ReportCarbonMarketDtoCoverPage): string {
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
   <div class="row ">
       <div  class="col h2 d-flex justify-content-center">
         ${coverPage.generateReportName}
       </div>
   </div>
   <div class="row ">
   <div class="col h4 d-flex justify-content-center">
      
   </div>
</div>
<div class="row ">
<div class="col h4 d-flex justify-content-center">
  
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

  CarbonMarketTableOfContent(
    header: string,
    footer: string,
    tableOfContent: ReportCarbonMarketDtoTableOfContent,
  ): string {
    let pageNumber = 1;

    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Single Intervention Information ....................................................................................................................................................................</div><div ><bdi>.............2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the policy or action .................................................................................................................................................................</div><div ><bdi>.................2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2 Understanding the characteristics of the proposed carbon market activity .................................................................................................................................................................</div><div ><bdi>.................2</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3 Understanding the transformational vision of the intervention and its context ..................................................................................................................</div><div ><bdi>.............3</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.4	Assessment information ........................................................................................................................................................................</div><div ><bdi>.............4</bdi></div> </div>
  

  <div class="table-of-content-header-item"><div >2.  Environmental and social integrity assessment....................................................................................................................................................................</div><div ><bdi>.............2</bdi></div> </div>
  <div class="table-of-content-sub-header-item"><div >2.1	Preconditions assessment .................................................................................................................................................................</div><div ><bdi>.................2</bdi></div> </div>
  <div><div class="sub-sub table-of-content-sub-header-item"> <div >2.1.1 Safeguards on environmental integrity ........................................................................................................................................................................</div><div ><bdi>.....13</bdi></div></div></div>
  <div><div class="sub-sub table-of-content-sub-header-item"> <div >2.1.2 Prevention on GHG emissions lock-in	 ........................................................................................................................................................................</div><div ><bdi>.....13</bdi></div></div></div>
  <div><div class="sub-sub table-of-content-sub-header-item"> <div >2.1.3 Prevention/avoidance of negative environmental and social impacts ........................................................................................................................................................................</div><div ><bdi>.....13</bdi></div></div></div>

  <div class="table-of-content-sub-header-item"><div >2.2 Outcomes of the preconditions assessment .................................................................................................................................................................</div><div ><bdi>.................2</bdi></div> </div>


    <div class="table-of-content-header-item"><div >3. Impact Assessment .................................................................................................................................................................</div><div ><bdi>.....5</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >3.1	Process characteristics assessment  ................................................................................................................................</div><div ><bdi>.................5</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >3.2	Outcomes characteristics assessment ....................................................................................................................................................</div><div ><bdi>.....6</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >3.3	Process categories assessment ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >3.4	Outcomes categories assessment  ....................................................................................................................................................</div><div ><bdi>.....10</bdi></div> </div>
 
    <div class="table-of-content-header-item"><div >4. Tranformational Impact Matrix .................................................................................................................................................................</div><div ><bdi>.....5</bdi></div> </div>
    <div class="table-of-content-header-item"><div >5. Annex: Supporting Justification .................................................................................................................................................................</div><div ><bdi>.....5</bdi></div> </div>

 
 
    </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;

    return page_one;
  }
  CarbonMarketcontentOne(header: string,
    footer: string,
   content: ReportCarbonMarketDtoContentOne,): string {
    let pageNumber = 2;
    const policyOrActionsDetails = content.policyOrActionsDetails;

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

    const characteristics = content.characteristics;
    const transformational = content.transformational;
    // <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>

    const page_2 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
  
 
 <div  class="main_header_sub text-start">1.2 Understanding the characteristics of the proposed carbon market activity  </div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${characteristics
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
 
    
 
      <div  class="main_header_sub text-start">1.3 Understanding the transformational vision of the intervention and its context </div> 

     
             <div class="report-table-sm">
            
             <table class="table  table-bordered border-dark">
               <thead class="table-primary  border-dark">
                 <tr>
                   <th scope="col">Information</th>
                   <th scope="col">Description</th>
                   
                 </tr>
               </thead>
               <tbody class="table-active ">
               ${transformational
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
   
    const barriers = content.barriers;
    // <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>

    const page_3 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">

   
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


 
 <div  class="main_header_sub text-start">1.4 Assessment information  </div> 


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
  ${content.assessmetType ? content.assessmetType : 'N/A'}
  </td></tr>
  <tr><td>
  Geographical area covered
  </td><td> 
  ${content.geograpycalCover ? content.geograpycalCover : 'N/A'}
  </td></tr>
  <tr><td>
  Sectors covered 
  </td><td> 
  ${content.sectorCoverd ? content.sectorCoverd : 'N/A'}
  </td></tr>
  <!--<tr><td>
  Opportunities for stakeholders to participate in the assessment
  </td><td> 
  ${content.opportunities ? content.opportunities : 'N/A'}
  </td></tr> -->

  
  </tbody>
</table>
</div>
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    return page_1+page_2+page_3;
  }
  CarbonMarketcontentTwo(header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentTwo,): string {
      let pageNumber = 3;
     let safeguards=content.safeguards
    //  console.log("safeguards",safeguards)
    const page_1 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    <div  class="main_header text-start">2 ENVIRONMENTAL AND SOCIAL INTEGRITY ASSESSMENT </div>
    <blockquote class=" paragraph blockquote text-start ">
    <p >These questions help the project and programme developer to assess whether the proposed carbon market intervention meets the environmental and social integrity criteria which are preconditions for delivering transformational change. They can be considered preconditions to enable transformational impacts of carbon market interventions, and thus need to be fulfilled before transformational change criteria can be assessed. The environmental and social integrity preconditions will need to be met to receive a positive score on the transformative impact assessment. The integrity assessment comprises three criteria: Safeguards on environmental integrity, prevention of GHG emissions lock-in and prevention/avoidance of negative environmental and social impacts.   </p>
   </blockquote> 
  <div  class="main_header_sub text-start">2.1 	Preconditions assessment </div> 
  <div  class="main_header_sub_sub text-start">2.1.1 Safeguards on environmental integrity </div>
         <div class="report-table-sm">
        
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
             <tr>
               <th scope="col">Question </th>
               <th scope="col">Answer </th>
               <th scope="col">Justification </th>
               <th scope="col">Supporting information uploaded </th>
               
             </tr>
           </thead>
           <tbody class="table-active ">
           ${safeguards
             .map(
               (a: {
                 document: string; question:any,answer:string,comment :string,
}) =>
                 '<tr><td>' +
                 a.question.label +
                 '</td><td>' +
                 a.answer +
                 '</td><td>' +
                 ((a.comment==null||a.comment==undefined)?'-':a.comment) +
                 '</td><td>' +
                 ((a.document==null|| a.document==undefined)?'No':'Yes') +
                 '</td></tr>',
             )
             .join('')}
           </tbody>
         </table>
       </div>
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    //  const page_1_2 =safeguards.length<2?'': `  <div id="page_9" class="page text-center" >
    //  ${header}
    //  <div class="content">
    
    //       <div class="report-table-sm">
         
    //       <table class="table  table-bordered border-dark">
    //         <thead class="table-primary  border-dark">
    //           <tr>
    //           <th scope="col">Question </th>
    //            <th scope="col">Answer </th>
    //            <th scope="col">Justification </th>
    //            <th scope="col">Supporting information uploaded </th>
                
    //           </tr>
    //         </thead>
    //         <tbody class="table-active ">
    //         ${safeguards
    //           .map(
    //             (a: {
    //               document: string;comment: string; question:string,answer:string
    //               }) =>
    //               '<tr><td>' +
    //               a.question +
    //               '</td><td>' +
    //               a.answer +
    //               '</td><td>' +
    //               a.comment +
    //               '</td><td>' +
    //               a.document +
    //               '</td></tr>',
    //           )
    //           .join('')}
    //         </tbody>
    //       </table>
    //     </div>
   
     
    //  </div>
     
    //  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
    //   </div>`;


      let prevention_ghg_emissions=content.prevention_ghg_emissions
      let prevention_negative_environmental=content.prevention_negative_environmental
      const page_2 = `  <div id="page_9" class="page text-center" >
      ${header}
      <div class="content">
    
    <div  class="main_header_sub_sub text-start">2.1.2 Prevention on GHG emissions lock-in   </div>
           <div class="report-table-sm">
          
           <table class="table  table-bordered border-dark">
             <thead class="table-primary  border-dark">
               <tr>
               <th scope="col">Question </th>
               <th scope="col">Answer </th>
               <th scope="col">Justification </th>
               <th scope="col">Supporting information uploaded </th>
                 
               </tr>
             </thead>
             <tbody class="table-active ">
             ${prevention_ghg_emissions
               .map(
                 (a: {
                   comment: string,document: string, question:any, answer:string,
                   
}) =>
                   '<tr><td>' +
                   a.question.label +
                   '</td><td>' +
                   a.answer +
                   '</td><td>' +
                   ((a.comment==null||a.comment==undefined)?'-':a.comment) +
                   '</td><td>' +
                   ((a.document==null|| a.document==undefined)?'No':'Yes') +
                   '</td></tr>',
               )
               .join('')}
             </tbody>
           </table>
         </div>

         <div  class="main_header_sub_sub text-start">2.1.3 Prevention/avoidance of negative environmental and social impacts    </div>
         <div class="report-table-sm">
        
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
             <tr>
             <th scope="col">Question </th>
             <th scope="col">Answer </th>
             <th scope="col">Justification </th>
             <th scope="col">Supporting information uploaded </th>
               
             </tr>
           </thead>
           <tbody class="table-active ">
           ${prevention_negative_environmental
             .map(
               (a: { question:any,answer:string,comment :string,document :string }) =>
                 '<tr><td>' +
                 a.question.label +
                 '</td><td>' +
                 a.answer +
                 '</td><td>' +
                 ((a.comment==null||a.comment==undefined)?'-':a.comment) +
                 '</td><td>' +
                 ((a.document==null|| a.document==undefined)?'No':'Yes') +
                 '</td></tr>',
             )
             .join('')}
           </tbody>
         </table>
       </div>
    
      
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;
       let outcomes=content.outcomes;
       const page_3 = `  <div id="page_9" class="page text-center" >
       ${header}
       <div class="content">
       <div  class="main_header_sub text-start">2.2 Outcomes of the preconditions assessment  </div> 
   
            <div class="report-table-sm">
           
            <table class="table  table-bordered border-dark">
              <thead class="table-primary  border-dark">
                <tr>
                <th scope="col">Precondition  </th>
                <th scope="col">Outcome   </th>
                <th scope="col">Evidence Provided?  </th>
                
                  
                </tr>
              </thead>
              <tbody class="table-active ">
              ${outcomes
                .map(
                  (a: { short_label:any,isPassing:boolean,hasEvidence:string  }) =>
                    '<tr><td>' +
                    a.short_label +
                    '</td><td>' +
                    ((a.isPassing) ? 'Yes' : 'No') +
                    '</td><td>' +
                    (a.hasEvidence) +
                    '</td></tr>',
                )
                .join('')}
              </tbody>
            </table>
          </div>
 
       
     
       
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    // return page_1+page_1_2+page_2+page_3;
    return page_1+page_2+page_3;
  }
  CarbonMarketcontentThree(header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentThree,): string {

      let pageNumber = 4;
     let prossesAssesmentStartingSituation=content.prossesAssesmentStartingSituation
    const page_1 = prossesAssesmentStartingSituation.length==0?'':`  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    <div  class="main_header text-start">3  IMPACT ASSESSMENT  </div>
  
  <div  class="main_header_sub text-start">3.1 Process characteristics assessment  </div> 

   <div class="report-table-sm">
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Process Characteristic</th>
         <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
         <th scope="col">Guiding Question </th>
         <th scope="col">Likelihood score  </th>
         <th scope="col">Rationale justifying the score  </th>
         <th scope="col">Supporting Documents Supplied </th>
       </tr>
     </thead>
     <tbody class="table-active">
     ${prossesAssesmentStartingSituation[0]
      .map((a: { rows: number; name: string; characteristics: any[] }) =>
        a.characteristics
          .map((b, index) => {
            const questionsLength = b.raw_questions.length;
    
            if (!index) {
              return `<tr>
                <td rowspan="${a.rows}" >${a.name}</td>
                <td rowspan="${questionsLength}">${b.name}</td>
                <td rowspan="${questionsLength}">${b.relevance ? b.relevance : '-'}</td>
                <td>${(questionsLength > 0 && b.raw_questions[0].question!=null &&  b.raw_questions[0].question!= undefined)? b.raw_questions[0].question : '-'}</td>
                <td>${(questionsLength > 0 && b.raw_questions[0].score!=null &&  b.raw_questions[0].score!= undefined)? (b.raw_questions[0].score+'-'+b.raw_questions[0].label) : '-'}</td>
                <td>${questionsLength > 0 && b.raw_questions[0].justification!=null && b.raw_questions[0].justification!=undefined? b.raw_questions[0].justification : '-'}</td>
                <td>${questionsLength > 0 && b.raw_questions[0].document == null ? 'No' : 'Yes'}</td>
              </tr>`;
            } else {
              return b.raw_questions
                .map((question, questionIndex) => `
                  <tr>
                    <td>${b.name}</td>
                    <td>${b.relevance ? b.relevance : '-'}</td>
                    <td>${questionsLength > questionIndex && (question.question!=null && question.question!=undefined)? question.question : '-'}</td>
                    <td>${questionsLength > questionIndex && (question.score!=null && question.score!=undefined)? (question.score+'-'+question.label ): '-'}</td>
                    <td>${questionsLength > questionIndex && question.justification!=null && question.justification!=undefined? question.justification : '-'}</td>
                    <td>${questionsLength > questionIndex && question.document == null ? 'No' : 'Yes'}</td>
                  </tr>
                `)
                .join('');
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
     const page_1_1 =prossesAssesmentStartingSituation.length<2?'': `  <div id="page_9" class="page text-center" >
     ${header}
     <div class="content">
    
    <div class="report-table-sm">
    
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Process Characteristic</th>
          <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
          <th scope="col">Guiding Question </th>
          <th scope="col">Likelihood score  </th>
          <th scope="col">Rationale justifying the score  </th>
          <th scope="col">Supporting Documents Supplied </th>
        </tr>
      </thead>
      <tbody class="table-active">
      ${prossesAssesmentStartingSituation[1]
        .map((a: { rows: number; name: string; characteristics: any[] }) =>
          a.characteristics
            .map((b, index) => {
              const questionsLength = b.raw_questions.length;
      
              if (!index) {
                return `<tr>
                  <td rowspan="${a.rows}" >${a.name}</td>
                  <td rowspan="${questionsLength}">${b.name}</td>
                  <td rowspan="${questionsLength}">${b.relevance ? b.relevance : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].question!=null &&  b.raw_questions[0].question!= undefined)? b.raw_questions[0].question : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].score!=null &&  b.raw_questions[0].score!= undefined)? (b.raw_questions[0].score+'-'+b.raw_questions[0].label) : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].justification!=null && b.raw_questions[0].justification!=undefined? b.raw_questions[0].justification : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].document == null ? 'No' : 'Yes'}</td>
                </tr>`;
              } else {
                return b.raw_questions
                  .map((question, questionIndex) => `
                    <tr>
                      <td>${b.name}</td>
                      <td>${b.relevance ? b.relevance : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.question!=null && question.question!=undefined)? question.question : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.score!=null && question.score!=undefined)? (question.score+'-'+question.label ): '-'}</td>
                      <td>${questionsLength > questionIndex && question.justification!=null && question.justification!=undefined? question.justification : '-'}</td>
                      <td>${questionsLength > questionIndex && question.document == null ? 'No' : 'Yes'}</td>
                    </tr>
                  `)
                  .join('');
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
      const page_1_2 =prossesAssesmentStartingSituation.length<2?'': `  <div id="page_9" class="page text-center" >
      ${header}
      <div class="content">
     
     <div class="report-table-sm">
     
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Process Characteristic</th>
           <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
           <th scope="col">Guiding Question </th>
           <th scope="col">Likelihood score  </th>
           <th scope="col">Rationale justifying the score  </th>
           <th scope="col">Supporting Documents Supplied </th>
         </tr>
       </thead>
       <tbody class="table-active">
       ${prossesAssesmentStartingSituation[2]
        .map((a: { rows: number; name: string; characteristics: any[] }) =>
          a.characteristics
            .map((b, index) => {
              const questionsLength = b.raw_questions.length;
      
              if (!index) {
                // console.log("not index.........",b,index)
                return `<tr>
                  <td rowspan="${a.rows}" >${a.name}</td>
                  <td>${b.name}</td>
                  <td>${b.relevance ? b.relevance : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].question!=null &&  b.raw_questions[0].question!= undefined)? b.raw_questions[0].question : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].score!=null &&  b.raw_questions[0].score!= undefined)? (b.raw_questions[0].score+'-'+b.raw_questions[0].label) : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].justification!=null && b.raw_questions[0].justification!=undefined? b.raw_questions[0].justification : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].document == null ? 'No' : 'Yes'}</td>
                </tr>
                <tr>
                  <td>${b.name}</td>
                  <td>${b.relevance ? b.relevance : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[1].question!=null &&  b.raw_questions[1].question!= undefined)? b.raw_questions[1].question : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[1].score!=null &&  b.raw_questions[1].score!= undefined)? (b.raw_questions[1].score+'-'+b.raw_questions[1].label) : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[1].justification!=null && b.raw_questions[1].justification!=undefined? b.raw_questions[1].justification : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[1].document == null ? 'No' : 'Yes'}</td>
                </tr>
                <tr>
                  <td>${b.name}</td>
                  <td>${b.relevance ? b.relevance : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[2].question!=null &&  b.raw_questions[2].question!= undefined)? b.raw_questions[2].question : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[2].score!=null &&  b.raw_questions[2].score!= undefined)? (b.raw_questions[2].score+'-'+b.raw_questions[2].label) : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[2].justification!=null && b.raw_questions[2].justification!=undefined? b.raw_questions[2].justification : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[2].document == null ? 'No' : 'Yes'}</td>
                </tr>
               `;
              } else {
                // console.log("index.........",b,index)
                return b.raw_questions
                  .map((question, questionIndex) => `
                    <tr>
                      <td>${b.name}</td>
                      <td>${b.relevance ? b.relevance : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.question!=null && question.question!=undefined)? question.question : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.score!=null && question.score!=undefined)? (question.score+'-'+question.label ): '-'}</td>
                      <td>${questionsLength > questionIndex && question.justification!=null && question.justification!=undefined? question.justification : '-'}</td>
                      <td>${questionsLength > questionIndex && question.document == null ? 'No' : 'Yes'}</td>
                    </tr>
                  `)
                  .join('');
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

       const page_1_3 =prossesAssesmentStartingSituation.length<2?'': `  <div id="page_9" class="page text-center" >
     ${header}
     <div class="content">
    
    <div class="report-table-sm">
    
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Process Characteristic</th>
          <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
          <th scope="col">Guiding Question </th>
          <th scope="col">Likelihood score  </th>
          <th scope="col">Rationale justifying the score  </th>
          <th scope="col">Supporting Documents Supplied </th>
        </tr>
      </thead>
      <tbody class="table-active">
      ${prossesAssesmentStartingSituation[3]
        .map((a: { rows: number; name: string; characteristics: any[] }) =>
          a.characteristics
            .map((b, index) => {
              const questionsLength = b.raw_questions.length;
      
              if (!index) {
              
                return `<tr>
                  <td rowspan="${a.rows}" >${a.name}</td>
                  <td rowspan="${questionsLength}">${b.name}</td>
                  <td rowspan="${questionsLength}">${b.relevance ? b.relevance : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].question!=null &&  b.raw_questions[0].question!= undefined)? b.raw_questions[0].question : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].score!=null &&  b.raw_questions[0].score!= undefined)? (b.raw_questions[0].score+'-'+b.raw_questions[0].label) : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].justification!=null && b.raw_questions[0].justification!=undefined? b.raw_questions[0].justification : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].document == null ? 'No' : 'Yes'}</td>
                </tr>`;
              } else {
                return b.raw_questions
                  .map((question, questionIndex) => `
                    <tr>
                      <td>${b.name}</td>
                      <td>${b.relevance ? b.relevance : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.question!=null && question.question!=undefined)? question.question : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.score!=null && question.score!=undefined)? (question.score+'-'+question.label ): '-'}</td>
                      <td>${questionsLength > questionIndex && question.justification!=null && question.justification!=undefined? question.justification : '-'}</td>
                      <td>${questionsLength > questionIndex && question.document == null ? 'No' : 'Yes'}</td>
                    </tr>
                  `)
                  .join('');
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
      const page_1_4 =prossesAssesmentStartingSituation.length<2?'': `  <div id="page_9" class="page text-center" >
     ${header}
     <div class="content">
    
    <div class="report-table-sm">
    
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Process Characteristic</th>
          <th scope="col">Relevant/ Possibly relevant/ Not relevant </th>
          <th scope="col">Guiding Question </th>
          <th scope="col">Likelihood score  </th>
          <th scope="col">Rationale justifying the score  </th>
          <th scope="col">Supporting Documents Supplied </th>
        </tr>
      </thead>
      <tbody class="table-active">
      ${prossesAssesmentStartingSituation[4]
        .map((a: { rows: number; name: string; characteristics: any[] }) =>
          a.characteristics
            .map((b, index) => {
              const questionsLength = b.raw_questions.length;
      
              if (!index) {
                return `<tr>
                  <td rowspan="${a.rows}" >${a.name}</td>
                  <td rowspan="${questionsLength}">${b.name}</td>
                  <td rowspan="${questionsLength}">${b.relevance ? b.relevance : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].question!=null &&  b.raw_questions[0].question!= undefined)? b.raw_questions[0].question : '-'}</td>
                  <td>${(questionsLength > 0 && b.raw_questions[0].score!=null &&  b.raw_questions[0].score!= undefined)? (b.raw_questions[0].score+'-'+b.raw_questions[0].label) : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].justification!=null && b.raw_questions[0].justification!=undefined? b.raw_questions[0].justification : '-'}</td>
                  <td>${questionsLength > 0 && b.raw_questions[0].document == null ? 'No' : 'Yes'}</td>
                </tr>`;
              } else {
                return b.raw_questions
                  .map((question, questionIndex) => `
                    <tr>
                      <td>${b.name}</td>
                      <td>${b.relevance ? b.relevance : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.question!=null && question.question!=undefined)? question.question : '-'}</td>
                      <td>${questionsLength > questionIndex && (question.score!=null && question.score!=undefined)? (question.score+'-'+question.label ): '-'}</td>
                      <td>${questionsLength > questionIndex && question.justification!=null && question.justification!=undefined? question.justification : '-'}</td>
                      <td>${questionsLength > questionIndex && question.document == null ? 'No' : 'Yes'}</td>
                    </tr>
                  `)
                  .join('');
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


      const scale_ghg = content.scale_ghg;
      const sustained_ghg = content.sustained_ghg;
      const page_2 = `  <div id="page_5" class="page text-center" >
     ${header}
     <div class="content">
     <div  class="main_header_sub text-start">3.2	Outcomes characteristics assessment  </div> 
      
  
   
   
   <div class="report-table-sm">

   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Outcome Characteristic</th>
        
         <th scope="col">Starting situation   </th>
         <th scope="col">Expected impact   </th>
         <th scope="col">Score  </th>
         <th scope="col">Rationale justifying the score </th>
         <th scope="col">Documentation uploaded?   </th>
       </tr>
     </thead>
     <tbody class="table-active">
     ${scale_ghg
          .map((a: any,index) =>{
            // console.log(index)
            if (!index) {
              return `<tr>
                <td rowspan="${scale_ghg.length}" >Scale of outcome - GHGs</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.starting_situation  ? a.starting_situation : '-'}</td>
                <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.justification ? a.justification : '-'}</td>
                <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
            </tr>`;
            }
            else {
              return `<tr>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.starting_situation  ? a.starting_situation : '-'}</td>
                <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.justification ? a.justification : '-'}</td>
                <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
              </tr>`;
            }
          }).join('')
            
          }
   
   
     </tbody>
   </table>
   </div>
   <div class="report-table-sm">
    <p>Question - Is the intervention’s GHG outcome sustained over time, i.e. the mitigation continues to accrue beyond the crediting period? Note: this is different from permanence of the achieved mitigation</p>
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Outcome Characteristic</th>
         <th scope="col">Score </th>
         <th scope="col">Rationale justifying the score </th>
         <th scope="col">Documentation uploaded? </th>
       </tr>
     </thead>
     <tbody class="table-active">
     ${sustained_ghg
          .map((a: any,index) =>{
            // console.log(index)
            if (!index) {
              return `<tr>
                <td rowspan="${sustained_ghg.length}" >Outcome sustained over time - GHGs</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.justification ? a.justification : '-'}</td>
                <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
            </tr>`;
            }
            else {
              // console.log("obj",a)
              return `<tr>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.justification ? a.justification : '-'}</td>
                <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
              </tr>`;
            }
          }).join('')
            
          }
   
   
     </tbody>
   </table>
   </div>
   
   
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;
      const scale_adaptation = content.scale_adaptation;
      const sustained_adaptation = content.sustained_adaptation;
  
      const page_3 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
   
    <div class="report-table-sm">
  
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Outcome Characteristic</th>
          
          <th scope="col">Starting situation   </th>
          <th scope="col">Expected impact   </th>
          <th scope="col">Score  </th>
          <th scope="col">Rationale justifying the score </th>
          <th scope="col">Documentation uploaded?   </th>
        </tr>
      </thead>
      <tbody class="table-active">
      ${scale_adaptation
        .map((a: any,index) =>{
          // console.log(index)
          if (!index) {
            return `<tr>
              <td rowspan="${scale_adaptation.length}" >Scale of outcome – Adaptation cobenefits</td>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.starting_situation  ? a.starting_situation : '-'}</td>
              <td>${a.expected_impact ? a.expected_impact : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.justification ? a.justification : '-'}</td>
              <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
          </tr>`;
          }
          else {
            // console.log("obj",a)
            return `<tr>
            <td>${a.characteristic ? a.characteristic : '-'}</td>
            <td>${a.starting_situation  ? a.starting_situation : '-'}</td>
            <td>${a.expected_impact ? a.expected_impact : '-'}</td>
            <td>${a.outcome_score ? a.outcome_score : '-'}</td>
            <td>${a.justification ? a.justification : '-'}</td>
            <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
            </tr>`;
          }
        }).join('')
          
        }
    
      </tbody>
    </table>
    </div>
    <div class="report-table-sm">
  <p>Question - Is the intervention’s contribution to the adaptation co-benefit sustained in nature?</p>
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Outcome Characteristic</th>
          <th scope="col">Score</th>
          <th scope="col">Rationale justifying the score </th>
          <th scope="col">Documentation uploaded? </th>
        </tr>
      </thead>
      <tbody class="table-active">
      ${sustained_adaptation
        .map((a: any,index) =>{
          // console.log(index)
          if (!index) {
            return `<tr>
              <td rowspan="${sustained_adaptation.length}" >Outcome sustained over time – Adaptation cobenefits</td>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.justification ? a.justification : '-'}</td>
              <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
          </tr>`;
          }
          else {
            // console.log("obj",a)
            return `<tr>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.justification ? a.justification : '-'}</td>
              <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
            </tr>`;
          }
        }).join('')
          
        }
    
      </tbody>
    </table>
    </div>
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;
  
      const scale_sd = content.scale_sd;
  
      const page_4 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
    
    
    <div class="report-table-sm">
  
    <table class="table  table-bordered border-dark">
      <thead class="table-primary  border-dark">
        <tr>
        <th scope="col">Category</th>
        <th scope="col">SDG</th>
        <th scope="col">Outcome Characteristic</th>
        <th scope="col">Starting situation   </th>
        <th scope="col">Expected impact   </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score</th>
        <th scope="col">Justification uploaded   </th>
        </tr>
      </thead>
      <tbody class="table-active">
      
          ${scale_sd
            .map((a: any,index) =>{
              
              if (!index) {
                // console.log(a.characteristic,"==========",index)
                return `<tr>
                  <td rowspan="${scale_sd.length}">Scale of outcome - sustainable development </td>
                  <td>${a.SDG ? a.SDG : '-'}</td>
                  <td>${a.characteristic ? a.characteristic : '-'}</td>
                  <td>${a.starting_situation ? a.starting_situation : '-'}</td>
                  <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                  <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                  <td>${a.justification ? a.justification : '-'}</td>
                  <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
              </tr>`;
              }
              else {
                // console.log("obj",a)
                return `<tr>
                <td>${a.SDG ? a.SDG : '-'}</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.starting_situation ? a.starting_situation : '-'}</td>
                <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.justification ? a.justification : '-'}</td>
                <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
                </tr>`;
              }
            }).join('')
              
            }
    
    
      </tbody>
    </table>
    </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;
  
      const sustained_sd = content.sustained_sd;
  
      const page_5 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
    
     
    
    
      <div class="report-table-sm">
      <p>Question - Is the activity’s contribution to the selected SDG sustained in nature?</p>
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
          <tr>
          <th scope="col">Category</th>
          <th scope="col">SDG</th>
          <th scope="col">Outcome Characteristic</th>
          <th scope="col">Likelihood Score   </th>
          <th scope="col">Rationale justifying the score </th>
          <th scope="col">Justification uploaded </th>
          </tr>
        </thead>
        <tbody class="table-active">
        ${sustained_sd
          .map((a: any,index) =>{
            
            if (!index) {
              // console.log(a.characteristic,"==========",index)
              return `<tr>
                <td rowspan="${sustained_sd.length}">Outcome sustained over time – sustainable development</td>
                <td>${a.SDG ? a.SDG : '-'}</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.justification ? a.justification : '-'}</td>
                <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
            </tr>`;
            }
            else {
              // console.log("obj",a)
              return `<tr>
              <td>${a.SDG ? a.SDG : '-'}</td>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.justification ? a.justification : '-'}</td>
              <td>${a.document==null||a.document==undefined ? 'No':'Yes'}</td>
              </tr>`;
            }
          }).join('')
            
          }
        
      
      
        </tbody>
      </table>
      </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;
  
      let process_categories_assessment =
      content.process_categories_assessment;
      let outcomes_categories_assessment =
      content.outcomes_categories_assessment;
  
      const page_6 = `  <div id="page_5" class="page text-center" >
       ${header}
       <div class="content">
       <div  class="main_header_sub text-start">2.3	 Process categories assessment   </div> 
     
     
     <div class="report-table-sm">
    
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Aggrgated Score</th>
        
           
         </tr>
       </thead>
       <tbody class="table-active">
       ${process_categories_assessment
          .map((a: { name: string; cat_score: number }) => {
            return `<tr>
             <td>${a.name ? a.name : '-'}</td>
             <td>${a.cat_score != null &&
                a.cat_score != undefined
                ? a.cat_score
                : '-'
              }</td>
               
                </tr>`;
          })
          .join('')}
          <tr>
            <td class="bold-table-row">Process score</td>
            <td class="bold-table-row">${content.processScore!==null ? content.processScore : '-'}</td>
          </tr>
         
     
       </tbody>
     </table>
     </div>
    
     <div  class="main_header_sub text-start">2.4	Outcomes categories assessment </div> 
  
     <div class="report-table-sm">
    
     <table class="table  table-bordered border-dark">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Aggrgated Score</th>
        
           
         </tr>
       </thead>
       <tbody class="table-active">
       <tr>
         <td >Scale of outcome – GHGs</td>
         <td >${content.outcomes_categories_assessment.scale_ghg_score!==null ? content.outcomes_categories_assessment.scale_ghg_score : '-'}</td>
       </tr>
       <tr>
         <td >Scale of outcome – sustainable development </td>
         <td >${content.outcomes_categories_assessment.scale_sdg_score!==null ? content.outcomes_categories_assessment.scale_sdg_score : '-'}</td>
       </tr>
       <tr>
         <td >Scale of outcome – Adaptation co-benefits </td>
         <td >${content.outcomes_categories_assessment.scale_adaptation_score!==null ? content.outcomes_categories_assessment.scale_adaptation_score : '-'}</td>
       </tr>
       <tr>
         <td >Outcome sustained over time – GHGs </td>
         <td >${content.outcomes_categories_assessment.sustained_ghg_score!==null ? content.outcomes_categories_assessment.sustained_ghg_score : '-'}</td>
       </tr>
       <tr>
         <td >Outcome sustainable over time – sustainable development</td>
         <td >${content.outcomes_categories_assessment.sustained_sdg_score!==null ? content.outcomes_categories_assessment.sustained_sdg_score : '-'}</td>
       </tr>
       <tr>
         <td >Outcome sustainable over time – adaptation co-benefits </td>
         <td >${content.outcomes_categories_assessment.sustained_adaptation_score!==null ? content.outcomes_categories_assessment.sustained_adaptation_score : '-'}</td>
       </tr>
       <tr>
         <td class="bold-table-row"> Outcomes score </td>
         <td class="bold-table-row">${content.outcomeScore!==null ? content.outcomeScore : '-'}</td>
       </tr>
      
  
    </tbody>
     </table>
     </div>
      
     
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
        if(prossesAssesmentStartingSituation.length==0){
          return page_1
        }
        else{
          return page_1+page_1_1+page_1_2+page_1_3+page_1_4+page_2+page_4+page_5+page_3+page_6;
        }

    
  }
  CarbonMarketcontentFour(header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentFour,): string {
      let pageNumber = 5;
      const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
      <div  class="main_header text-start">4  TRANFORMATIONAL IMPACT MATRIX   </div>
    
      <div class="report-table-sm">
      <table id="heatmap" class="heatmap" style="text-align: center;">
         <tbody>
        <tr>
            <td></td>
            <td colspan="8">​​Outcome: Extent and sustained nature of transformation</td>
        </tr>
        <tr>
            <td class="vertical-text-chrome"  rowspan="6">Process: Likelihood of transformation</td>
            <td></td>
           
            ${this.xData
              .map((x) => {
                return `
                 <td  >${x.label}</td> `;
              })
              .join('')}
        </tr>

        ${this.yData
          .map((y) => {
            return `
             <tr > 
              <td >${y.label}</td> 
              
              ${this.generateHeatMapforinvestment(y.value,content)}
            </tr> `;
          })
          .join('')}
        
       
        </tbody>
      </table>
      </div>
     
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;


    return page_1;
  }
  CarbonMarketcontentFive(header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentFive,): string {
      let pageNumber = 5;
      let annex= content.annex;
      const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
      <div  class="main_header text-start">5  ANNEX: SUPPORTING JUSTIFICATION    </div>
    
      <div class="report-table-sm">
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Characteristic</th>
         <th scope="col">Category</th>
         <th scope="col">File </th>
      
       </tr>
     </thead>
     <tbody class="table-active">
     ${annex
       .map(
         (a: {
           characteristic: Characteristics;
           uploadedDocumentPath: string;
         }) =>
           '<tr><td>' +
           ((a.characteristic?.category)?a.characteristic.category.name:'-') +
           '</td><td>' +
           ((a.characteristic)?a.characteristic.name:'-') +
           '</td><td>' + '<a href="'+ this.fileServerURL+a.uploadedDocumentPath +'">'+a.uploadedDocumentPath+'</a>'+
           '</td></tr>',
       )
       .join('')}
     </tbody>
   </table>
 </div>
     
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;
    return page_1;
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
    TRANSFORMATIONAL CHANGE 
    </div>                
  </div>
  <div class="row ">
  <div class="col h2 d-flex justify-content-center">
  ASSESSMENT REPORT 
  </div>                
</div>
<div class="row ">
<div class="col h2 d-flex justify-content-center">
PORTFOLIO TOOL
</div>                
</div>
 
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
       </div>
   </div>
   <div class="row ">
       <div class="col h4 d-flex justify-content-center">
       </div>
   </div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
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
  <div class="table-of-content-header-item"><div >1.	Portfolio of Interventions Information ....................................................................................................................................................................</div><div ><bdi>.............10</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the portfolio ................................................................................................................................</div><div ><bdi>.................11</bdi></div> </div>
  
    <div class="table-of-content-header-item"><div >2. Impacts comparison .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Processes impacts comparison  ................................................................................................................................</div><div ><bdi>.................13</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes impacts comparison ....................................................................................................................................................</div><div ><bdi>.....14</bdi></div> </div>
    <div class="table-of-content-header-item"><div >3. Aggregation .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>
    <div class="table-of-content-header-item"><div >4. SDG Alignment .................................................................................................................................................................</div><div ><bdi>.....13</bdi></div> </div>

   
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
    let pageNumber = 2;
    const portfolio_details = contentOne.portfolio_details;
    const intervation_details = contentOne.intervation_details;

    // <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1.	PORTFOLIO OF INTERVENTIONS INFORMATION </div>
 
 <div  class="main_header_sub text-start">1.1	Describe the portfolio </div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${portfolio_details
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

      <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Intervention ID</th>
              <th scope="col">Intervention name</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${intervation_details
        .map(
          (a: { id: string; name: string }) =>
            '<tr><td>' + a.id + '</td><td>' + a.name + '</td></tr>',
        )
        .join('')}
          </tbody>
        </table>
      </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    return page_1;
  }
  comparisonContentTwo(
    header: string,
    footer: string,
    content: ComparisonReportReportContentTwo,
  ): string {
    let pageNumber = 2;
    const prosses_tech = content.prosses_tech;
    const prosses_agent = content.prosses_agent;
    const prosses_incentive = content.prosses_incentive;
    const prosses_norms = content.prosses_norms;
    const process_score = content.process_score;
    const page_1 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">2.	IMPACTS COMPARISON </div>
 
 <div  class="main_header_sub text-start">2.1	Processes impacts comparison</div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
          <th colspan="4" scope="col">TECHNOLOGY</th>
          
        </tr>
            <tr>
              <th scope="col">Id	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool Applied	</th>
              <th scope="col">Status</th>
              <th scope="col">Research and development</th>
              <th scope="col">Adoption</th>
              <th scope="col">Scale up</th>
              <th scope="col">Category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${prosses_tech
        .map(
          (a: {
            category_score: string;
            SCALE_UP: string;
            ADOPTION: string;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a['R_&_D'] ? a['R_&_D'] : '-') +
            '</td><td>' +
            (a.ADOPTION ? a.ADOPTION : '-') +
            '</td><td>' +
            (a.SCALE_UP ? a.SCALE_UP : '-') +
            '</td><td>' +
            (a.category_score != undefined || a.category_score != null ? a.category_score : '-') +
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
        <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
        <th colspan="4" scope="col">AGENTS</th>
        
      </tr>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool Applied	</th>
            <th scope="col">Status</th>
            <th scope="col">Entrepreneurs</th>
            <th scope="col">Coalition of advocates</th>
            <th scope="col">Beneficiaries</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${prosses_agent
        .map(
          (a: {
            category_score: string;
            ENTREPRENEURS: string;
            COALITION_OF_ADVOCATES: string;
            BENIFICIARIES: string;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.ENTREPRENEURS ? a.ENTREPRENEURS : '-') +
            '</td><td>' +
            (a.COALITION_OF_ADVOCATES ? a.COALITION_OF_ADVOCATES : '-') +
            '</td><td>' +
            (a.BENIFICIARIES ? a.BENIFICIARIES : '-') +
            '</td><td>' +
            (a.category_score != undefined || a.category_score != null ? a.category_score : '-') +
            '</td></tr>',
        )
        .join('')}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    const page_2 = `  <div  class="page text-center" >
    ${header}
    <div class="content">
    
         <div class="report-table-sm">
        
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
           <tr>
           <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
           <th colspan="4" scope="col">INCENTIVES</th>
           
         </tr>
             <tr>
               <th scope="col">Id	</th>
               <th scope="col">Intervention name	</th>
               <th scope="col">Tool Applied	</th>
               <th scope="col">Status</th>
               <th scope="col">Economic and non-economic</th>
               <th scope="col">Disincentives</th>
               <th scope="col">Institutional and regulatory	</th>
               <th scope="col">Category score</th>
               
             </tr>
           </thead>
           <tbody class="table-active ">
           ${prosses_incentive
        .map(
          (a: {
            category_score: string;
            ECONOMIC_NON_ECONOMIC: string;
            DISINCENTIVES: string;
            INSTITUTIONAL_AND_REGULATORY: string;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.ECONOMIC_NON_ECONOMIC ? a.ECONOMIC_NON_ECONOMIC : '-') +
            '</td><td>' +
            (a.DISINCENTIVES ? a.DISINCENTIVES : '-') +
            '</td><td>' +
            (a.INSTITUTIONAL_AND_REGULATORY ? a.INSTITUTIONAL_AND_REGULATORY : '-') +
            '</td><td>' +
            (a.category_score != undefined || a.category_score != null ? a.category_score : '-') +
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
         <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
         <th colspan="4" scope="col">CATEGORY - NORMS AND BEHAVIORAL CHANGE</th>
         
       </tr>
           <tr>
             <th scope="col">Id	</th>
             <th scope="col">Intervention name	</th>
             <th scope="col">Tool Applied	</th>
             <th scope="col">Status</th>
             <th scope="col">Awareness</th>
             <th scope="col">Behavior</th>
             <th scope="col">Social norms</th>
             <th scope="col">Category score</th>
             
           </tr>
         </thead>
         <tbody class="table-active ">
         ${prosses_norms
        .map(
          (a: {
            id: number;
            name: string;
            tool: string;
            status: string;
            AWARENESS: string;
            BEHAVIOUR: string;
            SOCIAL_NORMS: string;
            category_score: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.AWARENESS ? a.AWARENESS : '-') +
            '</td><td>' +
            (a.BEHAVIOUR ? a.BEHAVIOUR : '-') +
            '</td><td>' +
            (a.SOCIAL_NORMS ? a.SOCIAL_NORMS : '-') +
            '</td><td>' +
            (a.category_score != undefined || a.category_score != null ? a.category_score : '-') +
            '</td></tr>',
        )
        .join('')}
         </tbody>
       </table>
     </div>
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    const page_3 = `  <div class="page text-center" >
     ${header}
     <div class="content">
     
          <div class="report-table-sm">
         
          <table class="table  table-bordered border-dark">
            <thead class="table-primary  border-dark">
            <tr>
            <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
            <th colspan="4" scope="col">AGGREGATED CATERGORY SCORE</th>
            <th style=" font-size:12px"  scope="col">PROCESSES SCORE</th>
            
          </tr>
              <tr>
                <th scope="col">Id	</th>
                <th scope="col">Intervention name	</th>
                <th scope="col">Tool Applied	</th>
                <th scope="col">Status</th>
                <th style=" font-size:12px" scope="col">Technology score</th>
                <th style=" font-size:12px" scope="col">Agents </th>
                <th style=" font-size:12px" scope="col">Incentives</th>
                <th style=" font-size:12px" scope="col">Norms and behavioral change</th>
                <th style=" font-size:12px"scope="col">All</th>
                
              </tr>
            </thead>
            <tbody class="table-active ">
            ${process_score
        .map(
          (a: {
            id: number;
            name: string;
            tool: string;
            status: string;
            Technology: string;
            Agents: string;
            Incentives: string;
            norms: string;
            category_score: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.Technology !=undefined || a.Technology != null? a.Technology : '-') +
            '</td><td>' +
            (a.Agents !=undefined || a.Agents !=null ? a.Agents : '-') +
            '</td><td>' +
            (a.Incentives !=undefined || a.Incentives !=null ? a.Incentives : '-') +
            '</td><td>' +
            (a['Norms and behavioral change'] != undefined ||  a['Norms and behavioral change'] !=null ? a['Norms and behavioral change'] : '-') +
            '</td><td>' +
            (a.category_score != undefined || a.category_score != null ? a.category_score : '-') +
            '</td></tr>',
        )
        .join('')}
            </tbody>
          </table>
        </div>
  
   
     
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;

    const ghg_scale = content.ghg_scale;
    const ghg_sustaind = content.ghg_sustaind;
    const ghg_scale_sustaind_comparison = content.ghg_scale_sustaind_comparison;

    const allsdg = content.allsdg;
    // const sdg_scale = content.sdg_scale;
    // const sdg_sustaind = content.sdg_sustaind;
    const sdg_scale_sustaind_comparison = content.sdg_scale_sustaind_comparison;

    const adaptation_scale = content.adaptation_scale;
    const adaptation_sustaind = content.adaptation_sustaind;
    const adaptation_scale_sustaind_comparison =
      content.adaptation_scale_sustaind_comparison;

    const sacle_comparison = content.sacle_comparison;
    const sustaind_comparison = content.sustaind_comparison;
    const outcome_level = content.outcome_level;

    const page_4 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
   
 
 <div  class="main_header_sub text-start">2.2	Outcomes impacts comparison</div> 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">SCALE COMPARISON	</th>
          <th colspan="4" scope="col">OUTCOMES</th>
          
        </tr>
        <tr>
        <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
        <th colspan="4" scope="col">GHG</th>
        
      </tr>
            <tr>
              <th scope="col">Id	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool Applied	</th>
              <th scope="col">Status</th>
              <th scope="col">International</th>
              <th scope="col">National/ sectorial	</th>
              <th scope="col">Subnational/ subsectorial	 up</th>
              <th scope="col">Category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${ghg_scale
        .map(
          (a: {
            international: any;
            national: any;
            subnational: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.international.name ? a.international.name : '-') +
            '</td><td>' +
            (a.national.name ? a.national.name : '-') +
            '</td><td>' +
            (a.subnational.name ? a.subnational.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
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
        <th colspan="4" scope="col">SUSTAINED IN TIME COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
        <tr>
        <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
        <th colspan="4" scope="col">GHG</th>
        
      </tr>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool Applied	</th>
            <th scope="col">Status</th>
            <th scope="col">Long term</th>
            <th scope="col">Medium term</th>
            <th scope="col">Short term</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${ghg_sustaind
        .map(
          (a: {
            long_term: any;
            medium_term: any;
            short_term: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.long_term.name ? a.long_term.name : '-') +
            '</td><td>' +
            (a.medium_term.name ? a.medium_term.name : '-') +
            '</td><td>' +
            (a.short_term.name ? a.short_term.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
            '</td></tr>',
        )
        .join('')}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_5 = `  <div class="page text-center" >
   ${header}
   <div class="content">
   
 
 
    

      <div class="report-table-sm">
       
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">SCALE COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">ADAPTATION</th>
      
    </tr>
          <tr>
            <th scope="col">Id	</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool Applied	</th>
            <th scope="col">Status</th>
            <th scope="col">international</th>
            <th scope="col">national/ sectorial	</th>
            <th scope="col">Subnational/ subsectorial	 up</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${adaptation_scale
        .map(
          (a: {
            international: any;
            national: any;
            subnational: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.international.name ? a.international.name : '-') +
            '</td><td>' +
            (a.national.name ? a.national.name : '-') +
            '</td><td>' +
            (a.subnational.name ? a.subnational.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
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
      <th colspan="4" scope="col">SUSTAINED IN TIME COMPARISON	</th>
      <th colspan="4" scope="col">OUTCOMES</th>
      
    </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">ADAPTATION</th>
      
    </tr>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Intervention name	</th>
          <th scope="col">Tool Applied	</th>
          <th scope="col">Status</th>
          <th scope="col">Long term</th>
          <th scope="col">Medium term</th>
          <th scope="col">Short term</th>
          <th scope="col">Category score</th>
          
        </tr>
      </thead>
      <tbody class="table-active ">
      ${adaptation_sustaind
        .map(
          (a: {
            long_term: any;
            medium_term: any;
            short_term: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
            long: string;
            medium: string;
            short: string;
            score: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.long_term.name ? a.long_term.name : '-') +
            '</td><td>' +
            (a.medium_term.name ? a.medium_term.name : '-') +
            '</td><td>' +
            (a.short_term.name ? a.short_term.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
            '</td></tr>',
        )
        .join('')}
      </tbody>
    </table>
  </div>
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;


    const sdg_pages = allsdg
      .map(
        (a: {
          sdg_name: string;
          sdg_scale: object[];
          sdg_sustaind: object[];
          sdg_scale_sustaind_comparison: object[];
        }) => `<div  class="page text-center" >
      ${header}
      <div class="content">
      <div class="report-table-sm">
         
      <table class="table  table-bordered border-dark">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">SCALE COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">SDG- ${a.sdg_name} </th>
      
    </tr>
          <tr>
            <th scope="col">Id	</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool Applied	</th>
            <th scope="col">Status</th>
            <th scope="col">International</th>
            <th scope="col">National/ sectorial	</th>
            <th scope="col">Subnational/ subsectorial	 up</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${a.sdg_scale
            .map(
              (a: {
                international: any;
                national: any;
                subnational: any;
                category_score: any;
                id: number;
                name: string;
                tool: string;
                status: string;
              }) =>
                '<tr><td>' +
                (a.id ? a.id : '-') +
                '</td><td>' +
                (a.name ? a.name : '-') +
                '</td><td>' +
                (a.tool ? a.tool : '-') +
                '</td><td>' +
                (a.status ? a.status : '-') +
                '</td><td>' +
                (a.international.name ? a.international.name : '-') +
                '</td><td>' +
                (a.national.name ? a.national.name : '-') +
                '</td><td>' +
                (a.subnational.name ? a.subnational.name : '-') +
                '</td><td>' +
                (a.category_score.name ? a.category_score.name : '-') +
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
      <th colspan="4" scope="col">SUSTAINED IN TIME COMPARISON	</th>
      <th colspan="4" scope="col">OUTCOMES</th>
      
    </tr>
      <tr>
      <th colspan="4" scope="col">INTERVENTION INFORMATION</th>
      <th colspan="4" scope="col">SDG- ${a.sdg_name} </th>
      
    </tr>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Intervention name	</th>
          <th scope="col">Tool Applied	</th>
          <th scope="col">Status</th>
          <th scope="col">Long term</th>
          <th scope="col">medium term</th>
          <th scope="col">Short term</th>
          <th scope="col">Category score</th>
          
        </tr>
      </thead>
      <tbody class="table-active ">
      ${a.sdg_sustaind
            .map(
              (a: {
                long_term: any;
                medium_term: any;
                short_term: any;
                category_score: any;
                id: number;
                name: string;
                tool: string;
                status: string;
              }) =>

                '<tr><td>' +
                (a.id ? a.id : '-') +
                '</td><td>' +
                (a.name ? a.name : '-') +
                '</td><td>' +
                (a.tool ? a.tool : '-') +
                '</td><td>' +
                (a.status ? a.status : '-') +
                '</td><td>' +
                (a.long_term.name ? a.long_term.name : '-') +
                '</td><td>' +
                (a.medium_term.name ? a.medium_term.name : '-') +
                '</td><td>' +
                (a.short_term.name ? a.short_term.name : '-') +
                '</td><td>' +
                (a.category_score.name ? a.category_score.name : '-') +
                '</td></tr>'


            )
            .join('')}
      </tbody>
    </table>
  </div>
   
  
    
      
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`,
      )
      .join('');

    const page_7 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
   
   <div class="report-table-sm">
       
   <table class="table  table-bordered border-dark">
     <thead class="table-primary  border-dark">
     <tr>
     <th colspan="4" scope="col">SCALE & SUSTAINED IN TIME COMPARISON	</th>
     <th colspan="3" scope="col">GHG OUTCOMES</th>
     
   </tr>
   <tr>
   <th colspan="7" scope="col">INTERVENTION INFORMATION</th>
   
   
 </tr>
       <tr>
         <th scope="col">Id	</th>
         <th scope="col">Intervention name	</th>
         <th scope="col">Tool Applied	</th>
         <th scope="col">Status</th>
         <th scope="col">Scale category score</th>
         <th scope="col">Sustained category score		</th>
         <th scope="col">Category score</th>
         
       </tr>
     </thead>
     <tbody  class="table-active ">
     ${ghg_scale_sustaind_comparison
        .map(
          (a: {
            scale_score: any;
            sustained_score: any;

            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.scale_score.name ? a.scale_score.name : '-') +
            '</td><td>' +
            (a.sustained_score.name ? a.sustained_score.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
            '</td></tr>'
        )
        .join('')}
     </tbody>
   </table>
 </div>

 <div class="report-table-sm">
       
 <table class="table  table-bordered border-dark">
   <thead class="table-primary  border-dark">
   <tr>
   <th colspan="4" scope="col">SCALE & SUSTAINED IN TIME COMPARISON	</th>
   <th colspan="3" scope="col">ADAPTATION OUTCOMES</th>
   
 </tr>
 <tr>
 <th colspan="7" scope="col">INTERVENTION INFORMATION</th>
 
 
</tr>
     <tr>
       <th scope="col">Id	</th>
       <th scope="col">Intervention name	</th>
       <th scope="col">Tool Applied	</th>
       <th scope="col">Status</th>
       <th scope="col">Scale category score</th>
       <th scope="col">Sustained category score		</th>
       <th scope="col">Category score</th>
       
     </tr>
   </thead>
   <tbody class="table-active ">
   ${adaptation_scale_sustaind_comparison
        .map(
          (a: {
            scale_score: any;
            sustained_score: any;

            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.scale_score.name ? a.scale_score.name : '-') +
            '</td><td>' +
            (a.sustained_score.name ? a.sustained_score.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
            '</td></tr>',
        )
        .join('')}
   </tbody>
 </table>
</div>    

    
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}   
   
    </div>`;

    const sdg_scale_sustaind_comparison_all = sdg_scale_sustaind_comparison
      .map(
        (b) => `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    
  
 
  <div class="report-table-sm">
       
  <table class="table  table-bordered border-dark">
    <thead class="table-primary  border-dark">
    <tr>
    <th colspan="4" scope="col">SCALE & SUSTAINED IN TIME COMPARISON	</th>
    <th colspan="3" scope="col">${b.sdg_name}</th>
    
  </tr>
  <tr>
  <th colspan="7" scope="col">INTERVENTION INFORMATION</th>
  
  
  </tr>
      <tr>
        <th scope="col">Id	</th>
        <th scope="col">Intervention name	</th>
        <th scope="col">Tool Applied	</th>
        <th scope="col">Status</th>
        <th scope="col">Scale category score</th>
        <th scope="col">Sustained category score		</th>
        <th scope="col">Category score</th>
        
      </tr>
    </thead>
    <tbody class="table-active ">
    ${b.data
            .map(
              (a: {
                scale_score: any;
                sustained_score: any;
                category_score: any;
                id: number;
                name: string;
                tool: string;
                status: string;
              }) =>
                '<tr><td>' +
                (a.id ? a.id : '-') +
                '</td><td>' +
                (a.name ? a.name : '-') +
                '</td><td>' +
                (a.tool ? a.tool : '-') +
                '</td><td>' +
                (a.status ? a.status : '-') +
                '</td><td>' +
                (a.scale_score.name ? a.scale_score.name : '-') +
                '</td><td>' +
                (a.sustained_score.name ? a.sustained_score.name : '-') +
                '</td><td>' +
                (a.category_score.name ? a.category_score.name : '-') +
                '</td></tr>',
            )
            .join('')}
    </tbody>
  </table>
  </div>
 
    
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`,
      )
      .join('');

    const page_9 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
  
 

        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">SCALE COMPARISON	</th>
          <th colspan="4" scope="col"> OUTCOMES</th>
          
        </tr>
        <tr>
        <th colspan="8" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">Id	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool Applied	</th>
              <th scope="col">Status</th>
              <th scope="col">GHG</th>
              <th scope="col">SDG </th>
              <th scope="col">Adaptation </th>
              <th scope="col">Category score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${sacle_comparison
        .map(
          (a: {
            ghg_score: any;
            adaptation_score: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.ghg_score.name ? a.ghg_score.name : '-') +
            '</td><td>' +
            '</td><td>' +
            (a.adaptation_score.name ? a.adaptation_score.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
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
        <th colspan="4" scope="col">SUSTAINED  COMPARISON	</th>
        <th colspan="4" scope="col">OUTCOMES</th>
        
      </tr>
      <tr>
      <th colspan="8" scope="col">INTERVENTION INFORMATION</th>
      
      
    </tr>
          <tr>
            <th scope="col">Id	</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool Applied	</th>
            <th scope="col">Status</th>
            <th scope="col">GHG</th>
            <th scope="col">SDG </th>
            <th scope="col">Adaptation </th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="table-active ">
        ${sustaind_comparison
        .map(
          (a: {
            ghg_score: any;
            adaptation_score: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.ghg_score.name ? a.ghg_score.name : '-') +
            '</td><td>' +
            '</td><td>' +
            (a.adaptation_score.name ? a.adaptation_score.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : '-') +
            '</td></tr>',
        )
        .join('')}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_10 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
   
 

        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">OUTCOME LEVEL COMPARISON	</th>
          <th colspan="4" scope="col"> OUTCOMES</th>
          
        </tr>
        <tr>
        <th colspan="8" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">Id	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool Applied	</th>
              <th scope="col">Status</th>
              <th scope="col">Scale </th>
              <th scope="col">Sustained  </th>
             
              <th scope="col">Outcome score</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${outcome_level
        .map(
          (a: {
            scale_cat_score: any;
            sustained_cat_score: any;
            category_score: any;
            id: number;
            name: string;
            tool: string;
            status: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            (a.scale_cat_score.name ? a.scale_cat_score.name : '-') +
            '</td><td>' +
            (a.sustained_cat_score.name ? a.sustained_cat_score.name : '-') +
            '</td><td>' +
            (a.category_score.name ? a.category_score.name : a.category_score) +
            '</td></tr>',
        )
        .join('')}
          </tbody>
        </table>
      </div>

     
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    return (
      page_1 +
      page_2 +
      page_3 +
      page_4 +
      page_5 +
      sdg_pages +
      page_7 +
      sdg_scale_sustaind_comparison_all +
      page_10
      // page_9 +
    );
    // return page_1 +page_2+page_3+page_4+page_5+sdg_pages+page_7+page_9+page_10;
  }
  comparisonContentThree(
    header: string,
    footer: string,
    content: ComparisonReportReportContentThree,
  ): string {
    const aggregation = content.aggregation;
    let pageNumber = 2;

    const page_1 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">3.	AGGREGATION </div>
 
 
        <div class="report-table-sm">
       
        <table class="table  table-bordered border-dark">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="5" scope="col">AGGREGATION</th>
          
          
        </tr>
        <tr>
        <th colspan="5" scope="col">INTERVENTION INFORMATION</th>
        
        
      </tr>
            <tr>
              <th scope="col">Id	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool Applied	</th>
              <th scope="col">Status</th>
              
              <th scope="col">Expected GHG reductions over intervention lifetime (Mt CO<sub>2</sub>-eq)</th>
              
            </tr>
          </thead>
          <tbody class="table-active ">
          ${aggregation.data
        .map(
          (a: {
            id: number;
            name: string;
            tool: string;
            status: string;
            mitigation: string;
          }) =>
            '<tr><td>' +
            (a.id ? a.id : '-') +
            '</td><td>' +
            (a.name ? a.name : '-') +
            '</td><td>' +
            (a.tool ? a.tool : '-') +
            '</td><td>' +
            (a.status ? a.status : '-') +
            '</td><td>' +
            a.mitigation +
            '</td></tr>'
        )
        .join('')}
            <tr><td colspan="4" > Total
            </td><td> ${aggregation.total}
                </td></tr>
          </tbody>
        </table>
      </div>

      
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    return page_1;
  }
  comparisonContentFour(
    header: string,
    footer: string,
    content: ComparisonReportReportContentFour,
  ): string {
    const alignment_table = content.alignment_table;
    const alignment_heat_map = content.alignment_heat_map;
    let pageNumber = 2;

    const page_1 = `  <div  class="page text-center" >
   ${header}
    <div class="content">
      <div  class="main_header text-start">4.	SDG ALIGNMENT </div>

      <div class="report-all-table-sm-rotate">

        <div class="report-table-sm-rotate">
        <br><br>
        <lablel text-align: left;>The following table shows the result obtained by the intervention for each SDG and how this compares to the priority given to each SDG in the country of implementation. </lablel>

        <br><br>
          <table class="table  table-bordered border-dark">
            <thead class="table-primary  border-dark">
              <tr>
                <th colspan="4" scope="col">ALIGNMENT</th>
                <th colspan="${alignment_table.sdg_count
      }">SUSTAINABLE DEVELOPMENT</th>
              </tr>
              <tr>
                ${alignment_table.col_set_1
        .map(
          (a) =>
            '<th scope="col" colspan="' +
            a.colspan +
            '">' +
            a.label +
            '</th>',
        )
        .join('')}
              </tr>
              <tr>
                ${alignment_table.col_set_2
        .map((a) => '<th scope="col">' + a.label + '</th>')
        .join('')}
              </tr>
            </thead>
            <tbody class="table-active">
                  ${this.generateAlignmentBody(
          alignment_table.interventions,
          alignment_table.col_set_2,
        )}
            </tbody>
          </table>
        </div>
        <div class="report-table-sm-rotate">
          <table class="table  table-bordered border-dark">
            <thead class="table-primary  border-dark">
              <tr>
                <th colspan="4" scope="col">ALIGNMENT</th>
                <th colspan="${alignment_table.sdg_count
      }">SUSTAINABLE DEVELOPMENT</th>
              </tr>
              <tr>
                ${alignment_table.col_set_1
        .map(
          (a) =>
            '<th scope="col" colspan="' +
            a.colspan +
            '">' +
            a.label +
            '</th>',
        )
        .join('')}
              </tr>
              <tr>
                ${alignment_table.col_set_2
        .map((a) => '<th scope="col">' + a.label + '</th>')
        .join('')}
              </tr>
            </thead>
            <tbody class="table-active">
                  ${this.generateHeatMapBody(
          alignment_table.interventions,
          alignment_table.col_set_2,
        )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    </div>`;

    // console.log("page", page_1)
    // return page_2 + page_3;
    return page_1;
  }

  generateAlignmentBody(interventions: any[], cols: any[]) {
    let body = '';
    for (let int of interventions) {
      body = body + '<tr>';
      for (let col of cols) {
        body = body + '<td>' + this.getValue(int[col.code]) + '</td>';
      }
      body = body + '</tr>';
    }
    return body;
  }
  generateHeatMapBody(interventions: any[], cols: any[]) {
    let body = '';
    for (let int of interventions) {
      body = body + '<tr>';
      for (let col of cols) {
        body =
          body +
          '<td style="background-color:' +
          this.getBackgroundColor(int[col.code]) +
          ';">' +
          (int[col.code]?.name ? '' : this.getValue(int[col.code])) +
          '</td>';
      }

      body = body + '</tr>';
    }
    return body;
  }
  generateHeatMapforinvestment(y:number,contentTwo:ReportContentTwo|ReportCarbonMarketDtoContentFour) {
    let body = '';
    for (let x of this.xData) {
        body =
          body +
          '<td  class="charttd" style="background-color:' +
          this.getBackgroundColorInvestmentHeatmap(x.value, y) +
          '; color:' + ((this.getIntervention(x.value, y,contentTwo))?'blue':this.getBackgroundColorInvestmentHeatmap(x.value, y))+ ';">' +
          '<span class="'+ (this.getIntervention(x.value, y,contentTwo)? 'intervention':'')+'">1</span>'+
                        
          '</td>';
    }
    return body;
  }

  getValue(data: any) {
    if (data) {
      if (data.name) {
        return data.name;
      } else if (!data.name) {
        return data;
      }
    } else {
      return '-';
    }
  }

  getBackgroundColor(data: any): string {
    if (data) {
      if (data.name) {
        switch (data.value) {
          case -2:
            return '#f8696b';
          case -1:
            return '#fa9473';
          case 0:
            return '#fdbf7b';
          case 1:
            return '#ffeb84';
          case 2:
            return '#ccde82';
          case 3:
            return '#98ce7f';
          case 4:
            return '#63be7b';
          default:
            return 'white';
        }
      } else if (!data.name) {
        return 'white';
      } else return 'white';
    } else {
      return 'white';
    }
  }
  getBackgroundColorInvestmentHeatmap(x: number, y: number): string {
    if ((x <= -1) || (x === 1 && y === 0) || (x === 0 && y === 1) || (x === 0 && y === 0)) {
      return '#ec6665'
    } else {
      let value = x + y
      switch (value) {
        case -3:
          return '#ec6665';
        case -2:
          return '#ed816c';
        case -1:
          return '#f19f70';
        case 0:
          return '#f4b979';
        case 1:
          return '#f9d57f';
        case 2:
          return '#f98570';
        case 3:
          return '#fdbf7b';
        case 4:
          return '#fedc82';
        case 5:
          return '#a9d27f';
        case 6:
          return '#86c97d';
        case 7:
          return '#63be7b';
        default:
          return 'white';
      }
    }
  }
  getIntervention(x: number, y: number,contentTwo:ReportContentTwo|ReportCarbonMarketDtoContentFour) {
    // console.log(contentTwo.processScore,contentTwo.outcomeScore,x,y)
    return (contentTwo.processScore === y && contentTwo.outcomeScore === x);
  }
}
