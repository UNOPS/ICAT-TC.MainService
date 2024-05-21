import { Injectable } from '@nestjs/common';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import {
  ComparisonReportReportContentFive,
  ComparisonReportReportContentFour,
  ComparisonReportReportContentOne,
  ComparisonReportReportContentSix,
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
  ReportContentThree,
  ReportContentTwo,
  ReportCoverPage,
  ReportTableOfContent,
} from 'src/report/dto/report.dto';

@Injectable()
export class ReportPagesService {
  constructor() {}
  xData = [
    { label: 'Major', value: 3 },
    { label: 'Moderate', value: 2 },
    { label: 'Minor', value: 1 },
    { label: 'None', value: 0 },
    { label: 'Minor Negative', value: -1 },
    { label: 'Moderate Negative', value: -2 },
    { label: 'Major Negative', value: -3 },
  ];

  yData = [
    { label: 'Very likely', value: 4 },
    { label: 'Likely', value: 3 },
    { label: 'Possible', value: 2 },
    { label: 'Unlikely', value: 1 },
    { label: 'Very Unlikely', value: 0 },
  ];
  fileServerURL = process.env.MAIN_URL+'/document/downloadDocumentsFromFileName/uploads/';
  coverPage(coverPage: ReportCoverPage): string {
    const cover = `<div id="cover">
    <div  style="height: 250px;">
    <!-- <div  class="row ">
       <div  class="col ">
       <img height="50px" src="./logo.png" >
       </div>                
   </div> -->
  

    
          ${
            coverPage.tool.trim() == "Investment tool"
              ? ' <div class="row "><div class="col h2 d-flex justify-content-center">TRANSFORMATIONAL CHANGE  </div></div><div class="row "><div class="col h2 d-flex justify-content-center">ASSESSMENT REPORT  </div></div><div class="row "><div class="col h2 d-flex justify-content-center">INVESTMENT TOOL  </div></div>   '
              : ' <div class="row "><div class="col h2 d-flex justify-content-center">TRANSFORMATIONAL CHANGE ASSESSMENT REPORT GENERAL INTERVENTIONS TOOL   </div></div>'
          }

   <div class="row ">
   <div class="col h4 d-flex justify-content-center">
      
   </div>
</div>
<div class="row ">
<div class="col h4 d-flex justify-content-center">
${coverPage.reportDate}
</div>
</div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
     
     </div>
 </div>
 </div>
 <div class="  d-flex justify-content-center" style="margin-top: 200px;margin-bottom: 0px;" >
       <img  style="padding: 0px;" src="${coverPage.companyLogoLink}" > 
 </div>
    </div>`;

    return cover;
  }

  tableOfContent(
    header: string,
    footer: string,
    tableOfContent: ReportTableOfContent,
    tool: string,
  ): string {
    let pageNumber = 1;
    const page_one = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content tableofcontentpage">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Single Intervention Information ....................................................................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Description of the intervention .................................................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2	Understanding the transformational vision of the intervention and its context ..................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3	Assessment information ........................................................................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
  

    <div class="table-of-content-header-item"><div >2. Impact Assessment .................................................................................................................................................................</div><div ><bdi>..............</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Process characteristics assessment  ................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes characteristics assessment ....................................................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.3	Process categories assessment ....................................................................................................................................................</div><div ><bdi>............</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.4	Outcome categories assessment  ....................................................................................................................................................</div><div ><bdi>..............</bdi></div> </div>
    <div class="table-of-content-header-item"><div >3.	Transformational impact matrix  .................................................................................................................................................................</div><div ><bdi>..............</bdi></div> </div>       
    
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

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1 Single Intervention Information</div>
 
 <div  class="main_header_sub text-start">1.1 Description  </div> 
        <div class="report-table-sm  ">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col" colspan="3">Description</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${policyOrActionsDetails&&policyOrActionsDetails.length>0?policyOrActionsDetails
            .map(
              (a: {
                information: string;
                description: any;
                isInvestment: boolean;
              }) => {
                if (a.isInvestment == undefined) {
                  return (
                    '<tr><td>' +
                    a.information +
                    '</td><td colspan="3">' +
                    a.description +
                    '</td></tr>'
                  );
                } else if (
                  a.isInvestment &&
                  a.information == 'Total investment (in USD)'
                ) {
                  return (
                    '<tr><td>' +
                    a.information +
                    '</td><td colspan="3">' +
                    a.description +
                    '</td></tr>'
                  );
                } else if (
                  a.isInvestment &&
                  a.information == 'Investment instrument(s) used'
                ) {
                  return (
                    '<tr><td>' +
                    a.information +
                    '</td>' +
                    a.description
                      .map((inv) => '<td>' + inv.instrument_name + '</td>')
                      .join('') +
                    '</tr>'
                  );
                } else if (
                  a.isInvestment &&
                  a.information == 'Proportion of total investment'
                ) {
                  return (
                    '<tr><td>' +
                    a.information +
                    '</td>' +
                    a.description
                      .map((inv) => '<td>' + inv.propotion + '</td>')
                      .join('') +
                    '</tr>'
                  );
                }
              },
            )
            .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
   
   <div  class="main_header_sub text-start">1.2	Understanding the intervention's transformational vision and context  </div> 
      
      <div class="report-table-sm  ">
      <p>The transformational vision describes how an intervention seeks to change a system towards zero-carbon, resilient and sustainable practices.</p>
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            
            <tr>
            <th scope="col">Information</th>
            <th scope="col">Description</th>
            
          </tr>
              
            </tr>
          </thead>
          <tbody class="test-tble">
          ${understanPolicyOrActions&&understanPolicyOrActions.length>0?understanPolicyOrActions
            .map(
              (a: { Time_periods: string; description: string }) =>
                '<tr><td>' +
                a.Time_periods +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>
        <div class="report-table-sm ">
        <p>Barriers are obstacles that hinder the transformation of a system or lead to undesired effects from the interventions.</p>
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Barriers</th>
              <th scope="col">Explanation</th>
              <th scope="col">Characteristics affected</th>
              <th scope="col">Barrier directly targeted by intervention</th>
            </tr>
          </thead>
          <tbody class="test-tble">
          ${barriers&&barriers.length>0?barriers
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
            .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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

  <div class="report-table-sm  ">
  <p>This information describes the scope of the assessment in terms of the geographical, temporal and sectoral coverage of the intervention.</p>
  <table class="table  test-table-one">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Information</th>
        <th scope="col">Description</th>
      
      </tr>
    </thead>
    <tbody class="test-tble">
    <tr><td>
    Assessment type
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

           <div class="report-table-sm  ">

<table class="table  test-table-one">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Outcome characteristic</th>
      <th scope="col">Description - specific to a policy or action </th>
      <th scope="col">Relevance</th>
    </tr>
  </thead>
  <tbody class="test-tble">
  ${catagory_out&&catagory_out.length>0?catagory_out
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
    .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
  

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
 
            <div class="report-table-sm  ">

 <table class="table  test-table-one">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Process characteristic</th>
       <th scope="col">Description - specific to a policy or action </th>
       <th scope="col">Relevance</th>
     </tr>
   </thead>
   <tbody class="test-tble">
   ${catagory_process&& catagory_process.length>0?catagory_process
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
     .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
   
 
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
  <div  class="main_header text-start">2.	Impact assessment</div>
  <div  class="main_header_sub text-start">2.1	Process characteristics assessment   </div> 



<div class="report-table-sm  ">
<p>
Process characteristics refer to the main drivers of system change based on the existing 
literature: technology, agents, incentives, and norms. Each of these drivers contain three characteristics.
 The table below indicates whether each characteristic is relevant or not relevant for the assessment, based
  on the barriers identified previously (i.e. is the characteristic affected by any of the barriers?) and
   whether the characteristic is impacted by the intervention being assessed or not. If a characteristic is
    relevant, the likelihood score indicates the likelihood of the intervention having an impact on this characteristic. The table presents any 
justification which supports the score and refers to documents which may back this justification.
</p>
<table class="table  test-table-one">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Process characteristic</th>
      <th scope="col">Relevance </th>
      <th scope="col">Guiding question </th>
      <th scope="col">Likelihood score  </th>
      <th scope="col">Rationale justifying the score  </th>
      <th scope="col">Supporting documents</th>
    </tr>
  </thead>
  <tbody class="test-tble">
  ${prossesAssesmentStartingSituation1&&prossesAssesmentStartingSituation1.length>0?prossesAssesmentStartingSituation1
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
    .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
  

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
   <div class="report-table-sm  ">
   <table class="table  test-table-one">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Process characteristic</th>
       <th scope="col">Relevance </th>
       <th scope="col">Guiding question </th>
       <th scope="col">Likelihood score  </th>
       <th scope="col">Rationale justifying the score  </th>
       <th scope="col">Supporting documents </th>
     </tr>
   </thead>
   <tbody class="test-tble">
   ${prossesAssesmentStartingSituation2&& prossesAssesmentStartingSituation2.length > 0? prossesAssesmentStartingSituation2
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
     .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
   
 
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
   <div  class="main_header_sub text-start">2.2	Outcome characteristics assessment</div> 
    

 
 
 <div class="report-table-sm  ">
<p>
Outcome characteristics refer to the scale and sustained nature of outcomes resulting from an intervention. Outcomes are measured in terms of GHG emissions reductions, climate adaptation impacts and selected sustainable development impacts across environmental, social and economic dimensions (e.g. air quality, health, jobs, gender equality, energy security). Users assess both the scale  and the sustained nature of selected impacts of the intervention on GHGs, climate adaptation and sustainable development. 
</p>
 <table class="table  test-table-one">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome characteristic</th>
       <th scope="col">Is the characteristic within the assessment boundaries?  </th>
       <th scope="col">Score  </th>
       <th scope="col">Rationale justifying the score </th>
     </tr>
   </thead>
   <tbody class="test-tble">
   ${scale_ghg&&scale_ghg.length>0?scale_ghg
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
     .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
 
 
   </tbody>
 </table>
 </div>
 <div class="report-table-sm  ">

 <table class="table  test-table-one">
   <thead class="table-primary  border-dark">
     <tr>
       <th scope="col">Category</th>
       <th scope="col">Outcome characteristic</th>
       <th scope="col">Is the characteristic within the assessment boundaries?  </th>
       <th scope="col">Score  </th>
       <th scope="col">Rationale justifying the score </th>
     </tr>
   </thead>
   <tbody class="test-tble">
   ${sustained_ghg&&sustained_ghg.length>0?sustained_ghg
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
     .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
 
 
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
 
  <div class="report-table-sm  ">

  <table class="table  test-table-one">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?  </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score </th>
      </tr>
    </thead>
    <tbody class="test-tble">
    ${scale_adaptation&&scale_adaptation.length>0?scale_adaptation
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
      .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
  
  
    </tbody>
  </table>
  </div>
  <div class="report-table-sm  ">

  <table class="table  test-table-one">
    <thead class="table-primary  border-dark">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Outcome characteristic</th>
        <th scope="col">Is the characteristic within the assessment boundaries?  </th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score </th>
      </tr>
    </thead>
    <tbody class="test-tble">
    ${sustained_adaptation&&sustained_adaptation.length>0?sustained_adaptation
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
      .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
  
  
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
   
  
  
  <div class="report-table-sm  ">

  <table class="table  test-table-one">
    <thead class="table-primary  border-dark">
      <tr>
      <th scope="col">Category</th>
      <th scope="col">Sustainable Development Goal</th>
     
      <th scope="col">Outcome characteristic</th>
      <th scope="col">Within the assessment boundaries?</th>
      <th scope="col">Score  </th>
      <th scope="col">Rationale justifying the score</th>
      </tr>
    </thead>
    <tbody class="test-tble">
    
    ${scale_sd.sdg&&scale_sd.sdg.length>0?scale_sd.sdg
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
      .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
  
  
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
   
  
   
  
  
    <div class="report-table-sm  ">
  
    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">
        <tr>
        <th scope="col">Category</th>
        <th scope="col">Sustainable Development Goal</th>
        
        <th scope="col">Outcome characteristic</th>
        <th scope="col">Within the assessment boundaries?</th>
        <th scope="col">Score  </th>
        <th scope="col">Rationale justifying the score</th>
        </tr>
      </thead>
      <tbody class="test-tble">
      
      ${sustained_sd.sdg&&sustained_sd.sdg.length>0?sustained_sd.sdg
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
        .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
    
    
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
     <div  class="main_header_sub text-start">2.3	 Aggregate process categories assessment   </div> 
     <blockquote class=" paragraph blockquote text-start ">
     <p > The following table aggregates the assessments across all process 
     characteristics and provides a likelihood score (i.e. “how likely is the 
      intervention to facilitate transformational change”) for each of the four 
      categories. Based on a weighted average of these category assessments, a final process score is assigned - on a scale from very 
     unlikely (0) to very likely (4) to enable transformational change.   </p>
    </blockquote> 
   
   <div class="report-table-sm  ">
  
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Aggregated score</th>
      
         
       </tr>
     </thead>
     <tbody class="test-tble">
     ${process_categories_assessment&&process_categories_assessment.length?process_categories_assessment
       .map((a: { category: any; category_score: any }) => {
         return `<tr>
           <td>${a.category ? a.category : '-'}</td>
           <td>${
             a.category_score.value != null &&
             a.category_score.value != undefined
               ? a.category_score.value
               : '-'
           }</td>
             
              </tr>`;
       })
       .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        <tr>
          <td class="bold-table-row">Process score</td>
          <td class="bold-table-row">${
            contentTwo.processScore !== null ? contentTwo.processScore : '-'
          }</td>
        </tr>
       
   
     </tbody>
   </table>
   </div>
  
   <div  class="main_header_sub text-start">2.4	Aggregate outcome categories assessment </div> 
   <blockquote class=" paragraph blockquote text-start ">
   <p >  The following table aggregates the assessments for all outcome 
   categories across all relevant levels and time scales. Impacts on GHG emission levels,
    the relevant Sustainable Development Goals and climate adaptation receive separate scores for 
    their estimated magnitude and persistence. Based on a weighted average, a final outcome score is 
    assigned - on a seven-step scale from major negative (-3) 
   to major positive (3) contributions towards transformation.   </p>
  </blockquote> 

   <div class="report-table-sm  ">
  
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Aggregated score</th>
      
         
       </tr>
     </thead>
     <tbody class="test-tble">
     ${outcomes_categories_assessment&&outcomes_categories_assessment.length>0?outcomes_categories_assessment
       .map((a: { category: any; category_score: any }) => {
         return `<tr>
           <td>${
             a.category
               ? a.category == 'GHG Scale of the Outcome'
                 ? 'Scale of outcome - GHGs'
                 : a.category == 'SDG Scale of the Outcome'
                 ? 'Scale of outcome - Sustainable development '
                 : a.category ==
                   'GHG Time frame over which the outcome is sustained'
                 ? 'Outcome sustained over time - GHGs '
                 : a.category ==
                   'SDG Time frame over which the outcome is sustained'
                 ? 'Outcome sustained over time - Sustainable dDevelopment '
                 : a.category =='Adaptation Scale of the Outcome'?'Scale of outcome - adaptation ':
                 a.category =='Adaptation Time frame over which the outcome is sustained'?'Outcome sustained over time - adaptation ':'-'
               : '-'
           }</td>
           <td>${
             a.category_score.value != null &&
             a.category_score.value != undefined
               ? a.category_score.value
               : '-'
           }</td>
             
              </tr>`;
       })
       .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
         <tr>
          <td class="bold-table-row">Outcomes score </td>
          <td class="bold-table-row">${
            contentTwo.outcomeScore !== null ? contentTwo.outcomeScore : '-'
          }</td>
        </tr>
    
   
     </tbody>
   </table>
   </div>
    
   
     </div>
     
     ${footer.replace('#pageNumber#', (pageNumber++).toString())}
     
      </div>`;

    
    const page_6_1 = `  <div id="page_6_1" class="page text-center" >
      ${header}
      <div class="content same-page">
      <div  class="main_header text-start">3	Transformational impact matrix   </div>
     

      <blockquote class=" paragraph blockquote text-start ">
      <p >  For an intervention to be transformational, it should both have a significant and
       lasting positive impact (Outcome) and address various components to facilitate systems change (Process). 
       Based on the scores for these two dimensions, the intervention is placed within the matrix – the green area suggesting that it 
       will contribute to transformational change. All interventions with negative outcomes cannot be considered transformational (red area) and 
       if the positive impact is small, it should be 
      accompanied by a strong focus on changing processes to achieve transformation.   </p>
     </blockquote> 
      <div class="report-table-sm same-page-table">
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
              
              ${this.generateHeatMapforinvestment(y.value, contentTwo)}
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
    
    
    <div class="report-table-sm  ">
  
    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">
      <tr>
      <th scope="col">Category</th>
      <th scope="col">Score</th>
      <th scope="col">Rationale for scoring </th>
      
      
    </tr>
  </thead>
  <tbody class="test-tble">
  ${outcomeDescribeResult&&outcomeDescribeResult.length>0?outcomeDescribeResult
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
    .join(''):'<tr><td colspan="3" style=" text-align: center;" ><p>No data found</p></td></tr>'}
 
    
      </tbody>
    </table>
    </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;

    
      return (
        page_1 +
        page_1_1 +
        page_2 +
        page_3 +
        page_4 +
        page_5 +
        page_6 +
        page_6_1
      );
    
  }
  contentThree(
    header: string,
    footer: string,
    content: ReportContentTwo,
  ): string {
    let pageNumber = 5;
    const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content same-page">
     
      <div  class="main_header text-start">4  Transformational impact matrix   </div>
    
      <div class="report-table-sm same-page-table">
      <table id="heatmap" class="heatmap" style="text-align: center;">
         <tbody>
        <tr>
            <td></td>
            <td colspan="8">Outcome: Extent and sustained nature of transformation</td>
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
              
              ${this.generateHeatMapforinvestment(y.value, content)}
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
${coverPage.reportDate}
</div>
</div>
   <div class="row ">
     <div class="col h4 d-flex justify-content-center">
     
     </div>
 </div>
 </div>
 <div class="  d-flex justify-content-center" style="margin-top: 200px;margin-bottom: 0px;" >
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
  <div class="content tableofcontentpage">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Single Intervention Information .................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>...................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.1	Describe the policy or action ..............................................................................................................................................................................................................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.2 Understanding the characteristics of the proposed carbon market activity ...........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.3 Understanding the transformational vision of the intervention and its context ...............................................................................................................................................................................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >1.4	Assessment information .....................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
  

  <div class="table-of-content-header-item"><div >2.  Environmental and social integrity assessment.................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>.............</bdi></div> </div>
  <div class="table-of-content-sub-header-item"><div >2.1	Preconditions assessment ..............................................................................................................................................................................................................................................................................................................................</div><div ><bdi>......................</bdi></div> </div>
  <div><div class="sub-sub table-of-content-sub-header-item"> <div >2.1.1 Safeguards for environmental integrity .....................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>................</bdi></div></div></div>
  <div><div class="sub-sub table-of-content-sub-header-item"> <div >2.1.2 Prevention of GHG emissions lock-in	 .....................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>...............</bdi></div></div></div>
  <div><div class="sub-sub table-of-content-sub-header-item"> <div >2.1.3 Prevention/avoidance of negative environmental and social impacts .....................................................................................................................................................................................................................................................................................................................................</div><div ><bdi>..................</bdi></div></div></div>

  <div class="table-of-content-sub-header-item"><div >2.2 Outcomes of the preconditions assessment ..............................................................................................................................................................................................................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>


   
 
    </div>

  
  </div>
  
  ${footer.replace('#pageNumber#', (pageNumber++).toString())}
  
   </div>`;
    const page_two = `  <div id="page_5" class="page text-center" >
   ${header}
   <div class="content tableofcontentpage">
   <div class="table-of-content ">

  
     <div class="table-of-content-header-item"><div >3. Impact Assessment ..............................................................................................................................................................................................................................................................................................................................</div><div ><bdi>...................</bdi></div> </div>
     <div class="table-of-content-sub-header-item"><div >3.1	Process characteristics assessment  .............................................................................................................................................................................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>
     <div class="table-of-content-sub-header-item"><div >3.2	Outcomes characteristics assessment .................................................................................................................................................................................................................................................................................................................</div><div ><bdi>......................</bdi></div> </div>
     <div class="table-of-content-sub-header-item"><div >3.3	Process categories assessment .................................................................................................................................................................................................................................................................................................................</div><div ><bdi>....................</bdi></div> </div>
     <div class="table-of-content-sub-header-item"><div >3.4	Outcomes categories assessment  .................................................................................................................................................................................................................................................................................................................</div><div ><bdi>......................</bdi></div> </div>
  
     <div class="table-of-content-header-item"><div >4. Transformational Impact Matrix ..............................................................................................................................................................................................................................................................................................................................</div><div ><bdi>....................</bdi></div> </div>
     <div class="table-of-content-header-item"><div >5. Annex: Supporting Justification ..............................................................................................................................................................................................................................................................................................................................</div><div ><bdi>...................</bdi></div> </div>
 
  
  
     </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    return page_one + page_two;
  }
  CarbonMarketcontentOne(
    header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentOne,
  ): string {
    let pageNumber = 2;
    const policyOrActionsDetails = content.policyOrActionsDetails;

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1 Single Intervention Information</div>
 
 <div  class="main_header_sub text-start">1.1 Describe the policy or action </div> 
        <div class="report-table-sm  ">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${policyOrActionsDetails&&policyOrActionsDetails.length>0?policyOrActionsDetails
            .map(
              (a: { information: string; description: string }) =>
                '<tr><td>' +
                a.information +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const characteristics = content.characteristics;
    const transformational = content.transformational;

    const page_2 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
  
 
 <div  class="main_header_sub text-start">1.2 Understanding the characteristics of the proposed carbon market activity  </div> 
        <div class="report-table-sm  ">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${characteristics&&characteristics.length>0?characteristics
            .map(
              (a: { information: string; description: string }) =>
                '<tr><td>' +
                a.information +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>
 
    
 
      <div  class="main_header_sub text-start">1.3 Understanding the transformational vision of the intervention and its context </div> 

     
             <div class="report-table-sm  ">
            
             <table class="table  test-table-one">
               <thead class="table-primary  border-dark">
                 <tr>
                   <th scope="col">Information</th>
                   <th scope="col">Description</th>
                   
                 </tr>
               </thead>
               <tbody class="test-tble ">
               ${transformational&&transformational.length>0?transformational
                 .map(
                   (a: { information: string; description: string }) =>
                     '<tr><td>' +
                     a.information +
                     '</td><td>' +
                     a.description +
                     '</td></tr>',
                 )
                 .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
               </tbody>
             </table>
           </div>
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const barriers = content.barriers;

    const page_3 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">

   
   <div class="report-table-sm  ">
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Barriers</th>
         <th scope="col">Explanation</th>
         <th scope="col">Characteristics affected</th>
         <th scope="col">Barrier directly targeted by the policy or action</th>
       </tr>
     </thead>
     <tbody class="test-tble">
     ${barriers&&barriers.length>0?barriers
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
       .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
     </tbody>
   </table>
 </div>


 
 <div  class="main_header_sub text-start">1.4 Assessment information  </div> 


<div class="report-table-sm  ">
<table class="table  test-table-one">
  <thead class="table-primary  border-dark">
    <tr>
      <th scope="col">Information</th>
      <th scope="col">Description</th>
    
    </tr>
  </thead>
  <tbody class="test-tble">
  <tr><td>
  Assessment type
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

    return page_1 + page_2 + page_3;
  }
  CarbonMarketcontentTwo(
    header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentTwo,
  ): string {
    let pageNumber = 3;
    let safeguards = content.safeguards;
    const page_1 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content ">
    <div  class="main_header text-start">2 Environmental and social integrity assessment </div>
    <blockquote class=" paragraph blockquote text-start ">
    <p >These questions help the project and programme developer to assess whether the proposed carbon market intervention meets the environmental and social integrity criteria which are preconditions for delivering transformational change. They can be considered preconditions to enable transformational impacts of carbon market interventions, and thus need to be fulfilled before transformational change criteria can be assessed. The environmental and social integrity preconditions will need to be met to receive a positive score on the transformative impact assessment. The integrity assessment comprises three criteria: safeguards on environmental integrity, prevention of GHG emissions lock-in and prevention/avoidance of negative environmental and social impacts.   </p>
   </blockquote> 
  <div  class="main_header_sub text-start">2.1 	Preconditions assessment </div> 
  <div  class="main_header_sub_sub text-start">2.1.1 Safeguards for environmental integrity </div>
         <div class="report-table-sm ">
        
         <table class="table  test-table-one">
           <thead class="table-primary  border-dark">
             <tr>
               <th scope="col">Question </th>
               <th scope="col">Answer </th>
               <th scope="col">Justification </th>
               <th scope="col">Supporting information uploaded </th>
               
             </tr>
           </thead>
           <tbody class="test-tble ">
           ${safeguards&&safeguards.length > 0? safeguards
             .map(
               (a: {
                 document: string;
                 question: any;
                 answer: string;
                 comment: string;
               }) =>
                 '<tr><td>' +
                 a.question.label +
                 '</td><td>' +
                 a.answer +
                 '</td><td>' +
                 (a.comment == null || a.comment == undefined
                   ? 'No justification was provided by the user'
                   : a.comment) +
                 '</td><td>' +
                 (a.document == null || a.document == undefined
                   ? 'No'
                   : 'Yes') +
                 '</td></tr>',
             )
             .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
           </tbody>
         </table>
       </div>
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    let prevention_ghg_emissions = content.prevention_ghg_emissions;
    let prevention_negative_environmental =
      content.prevention_negative_environmental;
    const page_2 = `  <div id="page_9" class="page text-center" >
      ${header}
      <div class="content">
    
    <div  class="main_header_sub_sub text-start">2.1.2 Prevention of GHG emissions lock-in   </div>
           <div class="report-table-sm ">
          
           <table class="table  test-table-one">
             <thead class="table-primary  border-dark">
               <tr>
               <th scope="col">Question </th>
               <th scope="col">Answer </th>
               <th scope="col">Justification </th>
               <th scope="col">Supporting information uploaded </th>
                 
               </tr>
             </thead>
             <tbody class="test-tble ">
             ${prevention_ghg_emissions&&prevention_ghg_emissions.length>0?prevention_ghg_emissions
               .map(
                 (a: {
                   comment: string;
                   document: string;
                   question: any;
                   answer: string;
                 }) =>
                   '<tr><td>' +
                   a.question.label +
                   '</td><td>' +
                   a.answer +
                   '</td><td>' +
                   (a.comment == null || a.comment == undefined
                     ? 'No justification was provided by the user'
                     : a.comment) +
                   '</td><td>' +
                   (a.document == null || a.document == undefined
                     ? 'No'
                     : 'Yes') +
                   '</td></tr>',
               )
               .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
             </tbody>
           </table>
         </div>

         <div  class="main_header_sub_sub text-start">2.1.3 Prevention/avoidance of negative environmental and social impacts    </div>
         <div class="report-table-sm ">
        
         <table class="table  test-table-one">
           <thead class="table-primary  border-dark">
             <tr>
             <th scope="col">Question </th>
             <th scope="col">Answer </th>
             <th scope="col">Justification </th>
             <th scope="col">Supporting information uploaded </th>
               
             </tr>
           </thead>
           <tbody class="test-tble ">
           ${prevention_negative_environmental&&prevention_negative_environmental.length>0?prevention_negative_environmental
             .map(
               (a: {
                 question: any;
                 answer: string;
                 comment: string;
                 document: string;
               }) =>
                 '<tr><td>' +
                 a.question.label +
                 '</td><td>' +
                 a.answer +
                 '</td><td>' +
                 (a.comment == null || a.comment == undefined
                   ? 'No justification was provided by the user'
                   : a.comment) +
                 '</td><td>' +
                 (a.document == null || a.document == undefined
                   ? 'No'
                   : 'Yes') +
                 '</td></tr>',
             )
             .join(''):'<tr><td colspan="4" style=" text-align: center;" ><p>No data found</p></td></tr>'}
           </tbody>
         </table>
       </div>
    
      
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;
    let outcomes = content.outcomes;
    const page_3 = `  <div id="page_9" class="page text-center" >
       ${header}
       <div class="content">
       <div  class="main_header_sub text-start">2.2 Outcomes of the preconditions assessment  </div> 
   
            <div class="report-table-sm ">
           
            <table class="table  test-table-one">
              <thead class="table-primary  border-dark ">
                <tr>
                <th scope="col">Precondition  </th>
                <th scope="col">Outcome   </th>
                <th scope="col">Evidence provided?  </th>
                
                  
                </tr>
              </thead>
              <tbody class="test-tble ">
              ${outcomes&&outcomes.length>0?outcomes
                .map(
                  (a: {
                    short_label: any;
                    isPassing: boolean;
                    hasEvidence: string;
                  }) =>
                    '<tr><td>' +
                    a.short_label +
                    '</td><td>' +
                    (a.isPassing ? 'Yes' : 'No') +
                    '</td><td>' +
                    a.hasEvidence +
                    '</td></tr>',
                )
                .join(''):'<tr><td colspan="3" style=" text-align: center;" ><p>No data found</p></td></tr>'}
              </tbody>
            </table>
          </div>
 
       
     
       
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    return page_1 + page_2 + page_3;
  }
  CarbonMarketcontentThree(
    header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentThree,
  ): string {
    let pageNumber = 4;
    let prossesAssesmentStartingSituation =
      content.prossesAssesmentStartingSituation;
    const page_1 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    <div  class="main_header text-start">3 Impact assessment  </div>
  
  <div  class="main_header_sub text-start">3.1 Process characteristics assessment  </div> 

   <div class="report-table-sm ">
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Process characteristic</th>
         <th scope="col">Relevance </th>
         <th scope="col">Guiding question </th>
         <th scope="col">Likelihood score  </th>
         <th scope="col">Rationale justifying the score  </th>
         <th scope="col">Supporting documents </th>
       </tr>
     </thead>
     <tbody class="test-tble">
     ${prossesAssesmentStartingSituation&&prossesAssesmentStartingSituation.length>0?prossesAssesmentStartingSituation.map(n=>
       n.map((a: { rows: number; name: string; characteristics: any[] }) =>
       a.characteristics
       .map((b, index) => {
         const questionsLength = b.raw_questions.length;
  
         if (!index) {
           return b.raw_questions.map((question, questionIndex) =>!questionIndex? `<tr>
           <td rowspan="${a.rows}" >${a.name}</td>
           <td rowspan="${questionsLength}">${b.name}</td>
           <td rowspan="${questionsLength}">${
           b.relevance ? b.relevance : '-'
         }</td>
           <td>${
             question.question != null &&
             question.question != undefined
               ? question.question
               : '-'
           }</td>
           <td>${
             questionsLength > 0 &&
             question.score != null &&
             question.score != undefined
               ? question.score +
                 '-' +
                 question.label
               : '-'
           }</td>
           <td>${
             questionsLength > 0 &&
             question.justification != null &&
             question.justification != undefined
               ? question.justification
               : 'No justification was provided by the user'
           }</td>
           <td>${
             questionsLength > 0 && question.document == null
               ? 'No'
               : 'Yes'
           }</td>
         </tr>`:`<tr>
         <td>${
           question.question != null &&
           question.question != undefined
             ? question.question
             : '-'
         }</td>
         <td>${
           questionsLength > 0 &&
           question.score != null &&
           question.score != undefined
             ? question.score +
               '-' +
               question.label
             : '-'
         }</td>
         <td>${
           questionsLength > 0 &&
           question.justification != null &&
           question.justification != undefined
             ? question.justification
             : 'No justification was provided by the user'
         }</td>
         <td>${
           questionsLength > 0 && question.document == null
             ? 'No'
             : 'Yes'
         }</td>
       </tr>` ).join('')
          
         } else {
           return b.raw_questions.map((question, questionIndex) =>!questionIndex? `<tr>
          
           <td rowspan="${questionsLength}">${b.name}</td>
           <td rowspan="${questionsLength}">${
           b.relevance ? b.relevance : '-'
         }</td>
           <td>${
             question.question != null &&
             question.question != undefined
               ? question.question
               : '-'
           }</td>
           <td>${
             questionsLength > 0 &&
             question.score != null &&
             question.score != undefined
               ? question.score +
                 '-' +
                 question.label
               : '-'
           }</td>
           <td>${
             questionsLength > 0 &&
             question.justification != null &&
             question.justification != undefined
               ? question.justification
               : 'No justification was provided by the user'
           }</td>
           <td>${
             questionsLength > 0 && question.document == null
               ? 'No'
               : 'Yes'
           }</td>
         </tr>`:`<tr>
         <td>${
           question.question != null &&
           question.question != undefined
             ? question.question
             : '-'
         }</td>
         <td>${
           questionsLength > 0 &&
           question.score != null &&
           question.score != undefined
             ? question.score +
               '-' +
               question.label
             : '-'
         }</td>
         <td>${
           questionsLength > 0 &&
           question.justification != null &&
           question.justification != undefined
             ? question.justification
             : 'No justification was provided by the user'
         }</td>
         <td>${
           questionsLength > 0 && question.document == null
             ? 'No'
             : 'Yes'
         }</td>
       </tr>` ).join('');
         }
       })
       .join('')
       )
       .join('')).join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
      
  
   
   
   <div class="report-table-sm  ">

   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Outcome characteristic</th>
        
         <th scope="col">Starting situation   </th>
         <th scope="col">Expected impact   </th>
         <th scope="col">Score  </th>
        
         <th scope="col">Rationale justifying the score </th>
         <th scope="col">Documentation uploaded?   </th>
       </tr>
     </thead>
     <tbody class="test-tble">
     ${scale_ghg&& scale_ghg.length > 0? scale_ghg
       .map((a: any, index) => {
         if (!index) {
           return `<tr>
                <td rowspan="${scale_ghg.length}" >Scale of outcome - GHGs</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.starting_situation ? a.starting_situation : '-'}</td>
                <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
          
                <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                <td>${
                  a.document == null || a.document == undefined ? 'No' : 'Yes'
                }</td>
            </tr>`;
         } else {
           return `<tr>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.starting_situation ? a.starting_situation : '-'}</td>
                <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
               
                <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                <td>${
                  a.document == null || a.document == undefined ? 'No' : 'Yes'
                }</td>
              </tr>`;
         }
       })
       .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
   
   
     </tbody>
   </table>
   </div>
   <div class="report-table-sm  ">
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Category</th>
         <th scope="col">Outcome characteristic</th>
         <th scope="col">Score </th>
         <th scope="col"> Score explanation  </th>
         <th scope="col">Rationale justifying the score </th>
         <th scope="col">Documentation uploaded? </th>
       </tr>
     </thead>
     <tbody class="test-tble">
     ${sustained_ghg&& sustained_ghg.length>0?sustained_ghg
       .map((a: any, index) => {
         if (!index) {
           return `<tr>
                <td rowspan="${
                  sustained_ghg.length
                }" >Outcome sustained over time - GHGs</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.outcome_score_explain ? a.outcome_score_explain : '-'}</td>
                <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                <td>${
                  a.document == null || a.document == undefined ? 'No' : 'Yes'
                }</td>
            </tr>`;
         } else {
           return `<tr>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.outcome_score_explain ? a.outcome_score_explain : '-'}</td>
                <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                <td>${
                  a.document == null || a.document == undefined ? 'No' : 'Yes'
                }</td>
              </tr>`;
         }
       })
       .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
   
   
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
   
    <div class="report-table-sm ">
  
    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Outcome characteristic</th>
          
          <th scope="col">Starting situation   </th>
          <th scope="col">Expected impact   </th>
          <th scope="col">Score  </th>
       
          <th scope="col">Rationale justifying the score </th>
          <th scope="col">Documentation uploaded?   </th>
        </tr>
      </thead>
      <tbody class="test-tble">
      ${scale_adaptation&&scale_adaptation.length>0 ?scale_adaptation
        .map((a: any, index) => {
          if (!index) {
            return `<tr>
              <td rowspan="${
                scale_adaptation.length
              }" >Scale of outcome - adaptation cobenefits</td>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.starting_situation ? a.starting_situation : '-'}</td>
              <td>${a.expected_impact ? a.expected_impact : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
            
              <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
              <td>${
                a.document == null || a.document == undefined ? 'No' : 'Yes'
              }</td>
          </tr>`;
          } else {
            return `<tr>
            <td>${a.characteristic ? a.characteristic : '-'}</td>
            <td>${a.starting_situation ? a.starting_situation : '-'}</td>
            <td>${a.expected_impact ? a.expected_impact : '-'}</td>
            <td>${a.outcome_score ? a.outcome_score : '-'}</td>
            
            <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
            <td>${
              a.document == null || a.document == undefined ? 'No' : 'Yes'
            }</td>
            </tr>`;
          }
        })
        .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
    
      </tbody>
    </table>
    </div>
    <div class="report-table-sm  ">

    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Outcome characteristic</th>
          <th scope="col">Score</th>
          <th scope="col"> Score explanation  </th>
          <th scope="col">Rationale justifying the score </th>
          <th scope="col">Documentation uploaded? </th>
        </tr>
      </thead>
      <tbody class="test-tble">
      ${sustained_adaptation&&sustained_adaptation.length>0?sustained_adaptation
        .map((a: any, index) => {
          if (!index) {
            return `<tr>
              <td rowspan="${
                sustained_adaptation.length
              }" >Outcome sustained over time - adaptation cobenefits</td>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.outcome_score_explain ? a.outcome_score_explain : '-'}</td>
              <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
              <td>${
                a.document == null || a.document == undefined ? 'No' : 'Yes'
              }</td>
          </tr>`;
          } else {
            return `<tr>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.outcome_score_explain ? a.outcome_score_explain : '-'}</td>
              <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
              <td>${
                a.document == null || a.document == undefined ? 'No' : 'Yes'
              }</td>
            </tr>`;
          }
        })
        .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
    
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
     
    
    
    <div class="report-table-sm  ">
  
    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">
        <tr>
        <th scope="col">Category</th>
        <th scope="col">SDG</th>
        <th scope="col">Outcome characteristic</th>
        <th scope="col">Starting situation   </th>
        <th scope="col">Expected impact   </th>
        <th scope="col">Score  </th>
       
        <th scope="col">Rationale justifying the score</th>
        <th scope="col">Justification uploaded   </th>
        </tr>
      </thead>
      <tbody class="test-tble">
      
          ${scale_sd&&scale_sd.length>0?scale_sd
            .map((a: any, index) => {
              if (!index) {
                return `<tr>
                  <td rowspan="${
                    scale_sd.length
                  }">Scale of outcome - sustainable development </td>
                  <td>${a.SDG ? a.SDG : '-'}</td>
                  <td>${a.characteristic ? a.characteristic : '-'}</td>
                  <td>${a.starting_situation ? a.starting_situation : '-'}</td>
                  <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                  <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                  
                  <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                  <td>${
                    a.document == null || a.document == undefined ? 'No' : 'Yes'
                  }</td>
              </tr>`;
              } else {
                return `<tr>
                <td>${a.SDG ? a.SDG : '-'}</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.starting_situation ? a.starting_situation : '-'}</td>
                <td>${a.expected_impact ? a.expected_impact : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                
                <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                <td>${
                  a.document == null || a.document == undefined ? 'No' : 'Yes'
                }</td>
                </tr>`;
              }
            })
            .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
    
    
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
     
    
     
    
    
      <div class="report-table-sm ">
    
      <table class="table  test-table-one">
        <thead class="table-primary  border-dark">
          <tr>
          <th scope="col">Category</th>
          <th scope="col">SDG</th>
          <th scope="col">Outcome characteristic</th>
          <th scope="col">Likelihood score   </th>
          <th scope="col">Likelihood score explanation  </th>
          <th scope="col">Rationale justifying the score </th>
          <th scope="col">Justification uploaded </th>
          </tr>
        </thead>
        <tbody class="test-tble">
        ${sustained_sd&&sustained_sd.length>0?sustained_sd
          .map((a: any, index) => {
            if (!index) {
              return `<tr>
                <td rowspan="${
                  sustained_sd.length
                }">Outcome sustained over time - sustainable development</td>
                <td>${a.SDG ? a.SDG : '-'}</td>
                <td>${a.characteristic ? a.characteristic : '-'}</td>
                <td>${a.outcome_score ? a.outcome_score : '-'}</td>
                <td>${a.outcome_score_explain ? a.outcome_score_explain : '-'}</td>
                <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
                <td>${
                  a.document == null || a.document == undefined ? 'No' : 'Yes'
                }</td>
            </tr>`;
            } else {
              return `<tr>
              <td>${a.SDG ? a.SDG : '-'}</td>
              <td>${a.characteristic ? a.characteristic : '-'}</td>
              <td>${a.outcome_score ? a.outcome_score : '-'}</td>
              <td>${a.outcome_score_explain ? a.outcome_score_explain : '-'}</td>
              <td>${a.justification ? a.justification : 'No justification was provided by the user'}</td>
              <td>${
                a.document == null || a.document == undefined ? 'No' : 'Yes'
              }</td>
              </tr>`;
            }
          })
          .join(''):'<tr><td colspan="6" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        
      
      
        </tbody>
      </table>
      </div>
   
    
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;

    let process_categories_assessment = content.process_categories_assessment;
    let outcomes_categories_assessment = content.outcomes_categories_assessment;

    const page_6 = `  <div id="page_5" class="page text-center" >
       ${header}
       <div class="content">
       <div  class="main_header_sub text-start">3.3	 Process categories assessment   </div> 
     
     
     <div class="report-table-sm  ">
    
     <table class="table  test-table-one">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Aggregated score</th>
        
           
         </tr>
       </thead>
       <tbody class="test-tble">
       ${process_categories_assessment&& process_categories_assessment.length > 0? process_categories_assessment
         .map((a: { name: string; cat_score: number }) => {
           return `<tr>
             <td>${a.name ? a.name : '-'}</td>
             <td>${
               a.cat_score != null && a.cat_score != undefined
                 ? a.cat_score
                 : '-'
             }</td>
               
                </tr>`;
         })
         .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          <tr>
            <td class="bold-table-row">Process score</td>
            <td class="bold-table-row">${
              content.processScore !== null ? content.processScore : '-'
            }</td>
          </tr>
         
     
       </tbody>
     </table>
     </div>
    
     <div  class="main_header_sub text-start">3.4	Outcomes categories assessment </div> 
  
     <div class="report-table-sm  ">
    
     <table class="table  test-table-one">
       <thead class="table-primary  border-dark">
         <tr>
           <th scope="col">Category</th>
           <th scope="col">Aggregated score</th>
        
           
         </tr>
       </thead>
       <tbody class="test-tble">
       <tr>
         <td >Scale of outcome - GHGs</td>
         <td >${
           content.outcomes_categories_assessment.scale_ghg_score!=null|| content.outcomes_categories_assessment.scale_ghg_score!=undefined
             ? content.outcomes_categories_assessment.scale_ghg_score
             : 'no data found'
         }</td>
       </tr>
       <tr>
         <td >Scale of outcome - sustainable development </td>
         <td >${
           content.outcomes_categories_assessment.scale_sdg_score !=null|| content.outcomes_categories_assessment.scale_sdg_score!=undefined
             ? content.outcomes_categories_assessment.scale_sdg_score
             : 'no data found'
         }</td>
       </tr>
       <tr>
         <td >Scale of outcome - adaptation co-benefits </td>
         <td >${
           content.outcomes_categories_assessment.scale_adaptation_score !=null|| content.outcomes_categories_assessment.scale_adaptation_score!=undefined
             ? content.outcomes_categories_assessment.scale_adaptation_score
             : 'no data found'
         }</td>
       </tr>
       <tr>
         <td >Outcome sustained over time - GHGs </td>
         <td >${
           content.outcomes_categories_assessment.sustained_ghg_score !=null|| content.outcomes_categories_assessment.sustained_ghg_score!=undefined
             ? content.outcomes_categories_assessment.sustained_ghg_score
             : 'no data found'
         }</td>
       </tr>
       <tr>
         <td >Outcome sustained over time - sustainable development</td>
         <td >${
           content.outcomes_categories_assessment.sustained_sdg_score !=null|| content.outcomes_categories_assessment.sustained_sdg_score!=undefined
             ? content.outcomes_categories_assessment.sustained_sdg_score
             : 'no data found'
         }</td>
       </tr>
       <tr>
         <td >Outcome sustained over time - adaptation co-benefits </td>
         <td >${
           content.outcomes_categories_assessment.sustained_adaptation_score !=null|| content.outcomes_categories_assessment.sustained_adaptation_score!=undefined
             ? content.outcomes_categories_assessment.sustained_adaptation_score
             : 'no data found'
         }</td>
       </tr>
       <tr>
         <td class="bold-table-row"> Outcomes score </td>
         <td class="bold-table-row">${
           content.outcomeScore!=null|| content.outcomeScore!=undefined  ? content.outcomeScore : 'no data found'
         }</td>
       </tr>
      
  
    </tbody>
     </table>
     </div>
      
     
       </div>
       
       ${footer.replace('#pageNumber#', (pageNumber++).toString())}
       
        </div>`;
    if (prossesAssesmentStartingSituation.length == 0) {
      return page_1 +
      page_2 +
      page_4 +
      page_5 +
      page_3 +
      page_6;
    } else {
      return (
        page_1 +
        page_2 +
        page_4 +
        page_5 +
        page_3 +
        page_6
      );
    }
  }
  CarbonMarketcontentFour(
    header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentFour,
  ): string {
    let pageNumber = 5;
    const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content same-page">
     
      <div  class="main_header text-start">4  Transformational impact matrix</div>
    
      <div class="report-table-sm same-page-table">
      <table id="heatmap" class="heatmap" style="text-align: center;">
         <tbody>
        <tr>
            <td></td>
            <td colspan="8">Outcome: Extent and sustained nature of transformation</td>
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
              
              ${this.generateHeatMapforinvestment(y.value, content)}
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
  CarbonMarketcontentFive(
    header: string,
    footer: string,
    content: ReportCarbonMarketDtoContentFive,
  ): string {
    let pageNumber = 5;
    let annex = content.annex;
    const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content">
     
      <div  class="main_header text-start">5  Annex: supporting justification    </div>
    
      <div class="report-table-sm  ">
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
       <tr>
         <th scope="col">Characteristic</th>
         <th scope="col">Category</th>
         <th scope="col">File </th>
      
       </tr>
     </thead>
     <tbody class="test-tble">
     ${annex&&annex.length > 0? annex
       .map(
         (a: {
           characteristic: Characteristics;
           uploadedDocumentPath: string;
         }) =>
           '<tr><td>' +
           (a.characteristic?.category ? a.characteristic.category.name : '-') +
           '</td><td>' +
           (a.characteristic ? a.characteristic.name : '-') +
           '</td><td>' +
           '<a href="' +
           this.fileServerURL +
           a.uploadedDocumentPath +
           '">' +
           a.uploadedDocumentPath +
           '</a>' +
           '</td></tr>',
       )
       .join(''):'<tr><td colspan="3" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
    TRANSFORMATIONAL CHANGE   ASSESSMENT REPORT 
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
       ${coverPage.reportDate}
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
 </div>
 <div class="  d-flex justify-content-center" style="margin-top: 200px;margin-bottom: 0px;" >
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
  <div class="content tableofcontentpage">
  <div class="table-of-content ">
  <div  class="table-of-content-main-headers text-start">Table of Contents</div>
  <div class="table-of-content-header-item"><div >1.	Portfolio of Interventions Information ....................................................................................................................................................................</div><div ><bdi>.................</bdi></div> </div>
  
    <div class="table-of-content-header-item"><div >2. Impacts comparison .................................................................................................................................................................</div><div ><bdi>................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.1	Processes impacts comparison  ................................................................................................................................</div><div ><bdi>....................</bdi></div> </div>
    <div class="table-of-content-sub-header-item"><div >2.2	Outcomes impacts comparison ....................................................................................................................................................</div><div ><bdi>........................</bdi></div> </div>
    <div class="table-of-content-header-item"><div >3. Aggregation .................................................................................................................................................................</div><div ><bdi>.....................</bdi></div> </div>
    <div class="table-of-content-header-item"><div >4. SDG Alignment .................................................................................................................................................................</div><div ><bdi>......................</bdi></div> </div>
    <div class="table-of-content-header-item"><div >5. Transformational impact matrix .................................................................................................................................................................</div><div ><bdi>......................</bdi></div> </div>
    <div class="table-of-content-header-item"><div >6. Sector coverage .................................................................................................................................................................</div><div ><bdi>......................</bdi></div> </div>
   
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

    const page_1 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   <div  class="main_header text-start">1.	Portfolio of interventions information </div>
   <blockquote class=" paragraph blockquote text-start ">
   <p >This section gives an overview of the portfolio as a whole and the intervention assessments that it is composed of.   </p>
  </blockquote> 
 
        <div class="report-table-sm  ">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Description</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${portfolio_details&&portfolio_details.length>0?portfolio_details
            .map(
              (a: { information: string; description: string }) =>
                '<tr><td>' +
                a.information +
                '</td><td>' +
                a.description +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm  ">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
            <tr>
              <th scope="col">Intervention ID</th>
              <th scope="col">Intervention name</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${intervation_details&&intervation_details.length>0?intervation_details
            .map(
              (a: { id: string; name: string }) =>
                '<tr><td>' + a.id + '</td><td>' + a.name + '</td></tr>',
            )
            .join(''):'<tr><td colspan="2" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
   <div  class="main_header text-start">2. Comparison of Impacts </div>
   <blockquote class=" paragraph blockquote text-start ">
   <p >
   This section shows how the assessed interventions within this portfolio compare
    regarding their transformational impact along the two dimensions 
   Outcome (extent and sustained nature of transformation) and Process (likelihood of transformation).
    </p>
  </blockquote> 
 <div  class="main_header_sub text-start">2.1	Comparison of Process Impacts</div> 

 <blockquote class=" paragraph blockquote text-start ">
 <p >
 The likelihood of the intervention’s contribution to transformational change is assessed across several characteristics within four main categories (Technology, Agents, Incentives, Norms). The scores range from very unlikely (0) to very likely (4) to enable transformational change.
  </p>
</blockquote> 
        <div class="report-table-sm same-page-table">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">Intervention information</th>
          <th colspan="4" scope="col">Technology</th>
          
        </tr>
            <tr>
              <th scope="col">ID	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool applied	</th>
              <th scope="col">Status</th>
              <th scope="col">Research and development</th>
              <th scope="col">Adoption</th>
              <th scope="col">Scale up</th>
              <th scope="col">Category score</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${prosses_tech&&prosses_tech.length>0?prosses_tech
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
                (a.category_score != undefined || a.category_score != null
                  ? a.category_score
                  : '-') +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm same-page-table">
       
      <table class="table  test-table-one">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">Intervention information</th>
        <th colspan="4" scope="col">Agents</th>
        
      </tr>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool applied	</th>
            <th scope="col">Status</th>
            <th scope="col">Entrepreneurs</th>
            <th scope="col">Coalition of advocates</th>
            <th scope="col">Beneficiaries</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="test-tble ">
        ${prosses_agent&&prosses_agent.length>0?prosses_agent
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
              (a.category_score != undefined || a.category_score != null
                ? a.category_score
                : '-') +
              '</td></tr>',
          )
          .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;
    const page_2 = `  <div  class="page text-center" >
    ${header}
    <div class="content">
    
         <div class="report-table-sm same-page-table">
        
         <table class="table  test-table-one">
           <thead class="table-primary  border-dark">
           <tr>
           <th colspan="4" scope="col">Intervention information</th>
           <th colspan="4" scope="col">Incentives</th>
           
         </tr>
             <tr>
               <th scope="col">ID	</th>
               <th scope="col">Intervention name	</th>
               <th scope="col">Tool applied	</th>
               <th scope="col">Status</th>
               <th scope="col">Economic and non-economic</th>
               <th scope="col">Disincentives</th>
               <th scope="col">Institutional and regulatory	</th>
               <th scope="col">Category score</th>
               
             </tr>
           </thead>
           <tbody class="test-tble ">
           ${prosses_incentive&&prosses_incentive.length>0?prosses_incentive
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
                 (a.INSTITUTIONAL_AND_REGULATORY
                   ? a.INSTITUTIONAL_AND_REGULATORY
                   : '-') +
                 '</td><td>' +
                 (a.category_score != undefined || a.category_score != null
                   ? a.category_score
                   : '-') +
                 '</td></tr>',
             )
             .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
           </tbody>
         </table>
       </div>
 
       <div class="report-table-sm same-page-table">
        
       <table class="table  test-table-one">
         <thead class="table-primary  border-dark">
         <tr>
         <th colspan="4" scope="col">Intervention information</th>
         <th colspan="4" scope="col">Category - norms and behavioral change</th>
         
       </tr>
           <tr>
             <th scope="col">ID	</th>
             <th scope="col">Intervention name	</th>
             <th scope="col">Tool applied	</th>
             <th scope="col">Status</th>
             <th scope="col">Awareness</th>
             <th scope="col">Behavior</th>
             <th scope="col">Social norms</th>
             <th scope="col">Category score</th>
             
           </tr>
         </thead>
         <tbody class="test-tble ">
         ${prosses_norms&&prosses_norms.length>0?prosses_norms
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
               (a.category_score != undefined || a.category_score != null
                 ? a.category_score
                 : '-') +
               '</td></tr>',
           )
           .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
         </tbody>
       </table>
     </div>
  
    
    </div>
    
    ${footer.replace('#pageNumber#', (pageNumber++).toString())}
    
     </div>`;

    const page_3 = `  <div class="page text-center" >
     ${header}
     <div class="content">
     
          <div class="report-table-sm same-page-table">
         
          <table class="table  test-table-one">
            <thead class="table-primary  border-dark">
            <tr>
            <th colspan="4" scope="col">Intervention information</th>
            <th colspan="4" scope="col">Aggregated catergory score</th>
            <th style=" font-size:12px"  scope="col">Processes score</th>
            
          </tr>
              <tr>
                <th scope="col">ID	</th>
                <th scope="col">Intervention name	</th>
                <th scope="col">Tool applied	</th>
                <th scope="col">Status</th>
                <th style=" font-size:12px" scope="col">Technology score</th>
                <th style=" font-size:12px" scope="col">Agents </th>
                <th style=" font-size:12px" scope="col">Incentives</th>
                <th style=" font-size:12px" scope="col">Norms and behavioral change</th>
                <th style=" font-size:12px"scope="col">All</th>
                
              </tr>
            </thead>
            <tbody class="test-tble ">
            ${process_score&&process_score.length>0?process_score
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
                  (a.Technology != undefined || a.Technology != null
                    ? a.Technology
                    : '-') +
                  '</td><td>' +
                  (a.Agents != undefined || a.Agents != null ? a.Agents : '-') +
                  '</td><td>' +
                  (a.Incentives != undefined || a.Incentives != null
                    ? a.Incentives
                    : '-') +
                  '</td><td>' +
                  (a['Norms and behavioral change'] != undefined ||
                  a['Norms and behavioral change'] != null
                    ? a['Norms and behavioral change']
                    : '-') +
                  '</td><td>' +
                  (a.category_score != undefined || a.category_score != null
                    ? a.category_score
                    : '-') +
                  '</td></tr>',
              )
              .join(''):'<tr><td colspan="9" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
   
 
 <div  class="main_header_sub text-start">2.2	Comparison of Outcome Impacts</div> 
 <blockquote class=" paragraph blockquote text-start ">
 <p >
 The interventions’ impacts on GHG emission levels, the relevant Sustainable Development Goals and climate adaptation receive separate scores for their estimated magnitude and persistence. Based on a weighted average, a final outcome score is assigned - on a seven-step scale from major negative (-3) to major positive (3) contributions towards transformation. 
 </p>
</blockquote> 
        <div class="report-table-sm same-page-table">
       
        <table class="table  test-table-one ">
          <thead class="table-primary  border-dark ">
          <tr>
          <th colspan="4" scope="col">Scale comparison	</th>
          <th colspan="4" scope="col">Outcomes</th>
          
        </tr>
        <tr>
        <th colspan="4" scope="col">Intervention information</th>
        <th colspan="4" scope="col">GHG</th>
        
      </tr>
            <tr>
              <th scope="col">ID	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool applied	</th>
              <th scope="col">Status</th>
              <th scope="col">International</th>
              <th scope="col">National/ sectoral	</th>
              <th scope="col">Subnational/ subsectoral</th>
              <th scope="col">Category score</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${ghg_scale&&ghg_scale.length>0?ghg_scale
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
            .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm same-page-table">
       
      <table class="table  test-table-one">
        <thead class="table-primary  border-dark">

        <tr>
        <th colspan="4" scope="col">Sustained in time comparison	</th>
        <th colspan="4" scope="col">Outcomes</th>
        
      </tr>
        <tr>
        <th colspan="4" scope="col">Intervention information</th>
        <th colspan="4" scope="col">GHG</th>
        
      </tr>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool applied	</th>
            <th scope="col">Status</th>
            <th scope="col">Long term</th>
            <th scope="col">Medium term</th>
            <th scope="col">Short term</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="test-tble ">
        ${ghg_sustaind&&ghg_sustaind.length>0?ghg_sustaind
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
          .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_5 = `  <div class="page text-center" >
   ${header}
   <div class="content">
   
 
 
    

      <div class="report-table-sm same-page-table">
       
      <table class="table  test-table-one">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">Scale comparison	</th>
        <th colspan="4" scope="col">Outcomes</th>
        
      </tr>
      <tr>
      <th colspan="4" scope="col">Intervention information</th>
      <th colspan="4" scope="col">Adaptation</th>
      
    </tr>
          <tr>
            <th scope="col">ID	</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool applied	</th>
            <th scope="col">Status</th>
            <th scope="col">international</th>
            <th scope="col">national/ sectoral	</th>
            <th scope="col">Subnational/ subsectoral</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="test-tble ">
        ${adaptation_scale&&adaptation_scale.length>0?adaptation_scale
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
          .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        </tbody>
      </table>
    </div>
    <div class="report-table-sm same-page-table">
       
    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">

      <tr>
      <th colspan="4" scope="col">Sustained in time comparison	</th>
      <th colspan="4" scope="col">Outcomes</th>
      
    </tr>
      <tr>
      <th colspan="4" scope="col">Intervention information</th>
      <th colspan="4" scope="col">Adaptation</th>
      
    </tr>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Intervention name	</th>
          <th scope="col">Tool applied	</th>
          <th scope="col">Status</th>
          <th scope="col">Long term</th>
          <th scope="col">Medium term</th>
          <th scope="col">Short term</th>
          <th scope="col">Category score</th>
          
        </tr>
      </thead>
      <tbody class="test-tble ">
      ${adaptation_sustaind&&adaptation_sustaind.length>0?adaptation_sustaind
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
        .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
      <div class="report-table-sm same-page-table">
         
      <table class="table  test-table-one">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">Scale comparison	</th>
        <th colspan="4" scope="col">Outcomes</th>
        
      </tr>
      <tr>
      <th colspan="4" scope="col">Intervention information</th>
      <th colspan="4" scope="col">${a.sdg_name} </th>
      
    </tr>
          <tr>
            <th scope="col">ID	</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool applied	</th>
            <th scope="col">Status</th>
            <th scope="col">International</th>
            <th scope="col">National/ sectoral	</th>
            <th scope="col">Subnational/ subsectoral</th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="test-tble ">
        ${a.sdg_scale&&a.sdg_scale.length>0?a.sdg_scale
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
          .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        </tbody>
      </table>
    </div>
    
  
    <div class="report-table-sm same-page-table">
         
    <table class="table  test-table-one">
      <thead class="table-primary  border-dark">
  
      <tr>
      <th colspan="4" scope="col">Sustained in time comparison	</th>
      <th colspan="4" scope="col">Outcomes</th>
      
    </tr>
      <tr>
      <th colspan="4" scope="col">Intervention information</th>
      <th colspan="4" scope="col">${a.sdg_name} </th>
      
    </tr>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Intervention name	</th>
          <th scope="col">Tool applied	</th>
          <th scope="col">Status</th>
          <th scope="col">Long term</th>
          <th scope="col">Medium term</th>
          <th scope="col">Short term</th>
          <th scope="col">Category score</th>
          
        </tr>
      </thead>
      <tbody class="test-tble ">
      ${a.sdg_sustaind&&a.sdg_sustaind.length>0?a.sdg_sustaind
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
        .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
   
   <div class="report-table-sm same-page-table">
       
   <table class="table  test-table-one">
     <thead class="table-primary  border-dark">
     <tr>
     <th colspan="4" scope="col">Scale & sustained in time comparison	</th>
     <th colspan="3" scope="col">GHG outcomes</th>
     
   </tr>
   <tr>
   <th colspan="7" scope="col">Intervention information</th>
   
   
 </tr>
       <tr>
         <th scope="col">ID	</th>
         <th scope="col">Intervention name	</th>
         <th scope="col">Tool applied	</th>
         <th scope="col">Status</th>
         <th scope="col">Scale category score</th>
         <th scope="col">Sustained category score		</th>
         <th scope="col">Category score</th>
         
       </tr>
     </thead>
     <tbody  class="test-tble ">
     ${ghg_scale_sustaind_comparison&&ghg_scale_sustaind_comparison.length>0?ghg_scale_sustaind_comparison
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
       .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
     </tbody>
   </table>
 </div>

 <div class="report-table-sm same-page-table">
       
 <table class="table  test-table-one">
   <thead class="table-primary  border-dark">
   <tr>
   <th colspan="4" scope="col">Scale & sustained in time comparison	</th>
   <th colspan="3" scope="col">Adaptation outcomes</th>
   
 </tr>
 <tr>
 <th colspan="7" scope="col">Intervention information</th>
 
 
</tr>
     <tr>
       <th scope="col">ID	</th>
       <th scope="col">Intervention name	</th>
       <th scope="col">Tool applied	</th>
       <th scope="col">Status</th>
       <th scope="col">Scale category score</th>
       <th scope="col">Sustained category score		</th>
       <th scope="col">Category score</th>
       
     </tr>
   </thead>
   <tbody class="test-tble ">
   ${adaptation_scale_sustaind_comparison&&adaptation_scale_sustaind_comparison.length>0?adaptation_scale_sustaind_comparison
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
     .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
    
  
 
  <div class="report-table-sm same-page-table">
       
  <table class="table  test-table-one">
    <thead class="table-primary  border-dark">
    <tr>
    <th colspan="4" scope="col">Scale & sustained in time comparison	</th>
    <th colspan="3" scope="col">${b.sdg_name}</th>
    
  </tr>
  <tr>
  <th colspan="7" scope="col">Intervention information</th>
  
  
  </tr>
      <tr>
        <th scope="col">ID	</th>
        <th scope="col">Intervention name	</th>
        <th scope="col">Tool applied	</th>
        <th scope="col">Status</th>
        <th scope="col">Scale category score</th>
        <th scope="col">Sustained category score		</th>
        <th scope="col">Category score</th>
        
      </tr>
    </thead>
    <tbody class="test-tble ">
    ${b.data&&b.data.length>0?b.data
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
      .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
  
 

        <div class="report-table-sm same-page-table">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">Scale comparison	</th>
          <th colspan="4" scope="col"> Outcomes</th>
          
        </tr>
        <tr>
        <th colspan="8" scope="col">Intervention information</th>
        
        
      </tr>
            <tr>
              <th scope="col">ID	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool applied	</th>
              <th scope="col">Status</th>
              <th scope="col">GHG</th>
              <th scope="col">SDG </th>
              <th scope="col">Adaptation </th>
              <th scope="col">Category score</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${sacle_comparison&&sacle_comparison.length>0?sacle_comparison
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
            .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="report-table-sm same-page-table">
       
      <table class="table  test-table-one">
        <thead class="table-primary  border-dark">
        <tr>
        <th colspan="4" scope="col">Sustained  comparison	</th>
        <th colspan="4" scope="col">Outcomes</th>
        
      </tr>
      <tr>
      <th colspan="8" scope="col">Intervention information</th>
      
      
    </tr>
          <tr>
            <th scope="col">ID	</th>
            <th scope="col">Intervention name	</th>
            <th scope="col">Tool applied	</th>
            <th scope="col">Status</th>
            <th scope="col">GHG</th>
            <th scope="col">SDG </th>
            <th scope="col">Adaptation </th>
            <th scope="col">Category score</th>
            
          </tr>
        </thead>
        <tbody class="test-tble ">
        ${sustaind_comparison&&sustaind_comparison.length>0?sustaind_comparison
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
          .join(''):'<tr><td colspan="8" style=" text-align: center;" ><p>No data found</p></td></tr>'}
        </tbody>
      </table>
    </div>
 
   
   </div>
   
   ${footer.replace('#pageNumber#', (pageNumber++).toString())}
   
    </div>`;

    const page_10 = `  <div  class="page text-center" >
   ${header}
   <div class="content">
   
 

        <div class="report-table-sm same-page-table">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="4" scope="col">Outcome level comparison</th>
          <th colspan="4" scope="col"> Outcomes</th>
          
        </tr>
        <tr>
        <th colspan="8" scope="col">Intervention information</th>
        
        
      </tr>
            <tr>
              <th scope="col">Id	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool applied	</th>
              <th scope="col">Status</th>
              <th scope="col">Scale </th>
              <th scope="col">Sustained  </th>
             
              <th scope="col">Outcome score</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${outcome_level&&outcome_level.length>0?outcome_level
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
                (a.sustained_cat_score.name
                  ? a.sustained_cat_score.name
                  : '-') +
                '</td><td>' +
                (a.category_score.name
                  ? a.category_score.name
                  : a.category_score) +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="7" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
    );
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
   <div  class="main_header text-start">3 Aggregation </div>
 
   <blockquote class=" paragraph blockquote text-start ">
   <p >
   The following table shows and aggregates the annual GHG emission reductions of each intervention contained in the portfolio. 
      </p>
  </blockquote> 
        <div class="report-table-sm same-page-table">
       
        <table class="table  test-table-one">
          <thead class="table-primary  border-dark">
          <tr>
          <th colspan="5" scope="col">Aggregation</th>
          
          
        </tr>
        <tr>
        <th colspan="5" scope="col">Intervention information</th>
        
        
      </tr>
            <tr>
              <th scope="col">ID	</th>
              <th scope="col">Intervention name	</th>
              <th scope="col">Tool applied	</th>
              <th scope="col">Status</th>
              
              <th scope="col">Expected GHG reductions over intervention lifetime (Mt CO<sub>2</sub>-eq)</th>
              
            </tr>
          </thead>
          <tbody class="test-tble ">
          ${aggregation.data&&aggregation.data.length>0?aggregation.data
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
                (a.mitigation? a.mitigation : '-') +
                '</td></tr>',
            )
            .join(''):'<tr><td colspan="5" style=" text-align: center;" ><p>No data found</p></td></tr>'}
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
    <div class="content" style=" height:1000px">
      <div  class="main_header text-start">4.	SDG alignment </div>
      <blockquote class=" paragraph blockquote text-start ">
      <p >
      The following tables show the score obtained by the interventions in the portfolio for each assessed Sustainable Development Goal (SDG) and how this compares to the priority given to these SDGs in the country of implementation. The first table shows the outcome scores (from major negative (-3) to major positive (3) contributions towards transformation), whereas the second one indicates the alignment between priority and outcome. Positive impacts are green, negative ones red – the shade is darker if the significance of the impact matches the country priorities.   
      </p>
     </blockquote> 
      <div class="report-all-table-sm-rotate same-page">
   
        <div class=" same-page-table-rotate">
       
          <table class="table  test-table-one table-fixed-width">
            <thead class="table-primary  border-dark">
              <tr>
                <th colspan="4" scope="col">Alignment</th>
                <th colspan="${
                  alignment_table.sdg_count
                }">Sustainable development</th>
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
            <tbody class="test-tble">
                  ${this.generateAlignmentBody(
                    alignment_table.interventions,
                    alignment_table.col_set_2,
                  )}
                 
            </tbody>
          </table>
        </div>
      
        </div>

        <div class="report-all-table-sm-rotate same-page">
        <div class=" same-page-table-rotate">
        <table class="table  test-table-one table-fixed-width">
          <thead class="table-primary  border-dark">
            <tr>
              <th colspan="4" scope="col">Alignment</th>
              <th colspan="${
                alignment_table.sdg_count
              }">Sustainable development</th>
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
          <tbody class="test-tble">
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

    return page_1;
  }
  comparisonContentFive(
    header: string,
    footer: string,
    content: ComparisonReportReportContentFive,
  ): string {
    let pageNumber = 5;
    const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content same-page">
     
      <div  class="main_header text-start">5  Transformational impact matrix   </div>
      <blockquote class=" paragraph blockquote text-start ">
      <p >
      For interventions to be transformational, they should both have a significant and lasting positive impact (Outcome) and address various components to facilitate systems change (Process). Based on the scores for these two dimensions, interventions are placed within the matrix below – the green area suggesting that they will contribute to transformational change. All interventions with negative outcomes cannot be considered transformational (red area) and if the positive impact is small, it should be accompanied by a strong focus on changing processes to achieve transformation.  
      </p>  
      <p >
      All fully assessed interventions contained in this portfolio are shown as a dot in the grid below. If two or more interventions received the same combination of outcome and process score, this is represented by a slightly larger dot. 

      </p>
     </blockquote> 

      <div class="report-table-sm same-page-table">
      <table id="heatmap" class="heatmap" style="text-align: center;">
         <tbody>
        <tr>
            <td></td>
            <td colspan="8">Outcome: Extent and sustained nature of transformation</td>
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
              
              ${this.generateHeatMapforComparison(y.value, content)}
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
  comparisonContentSix(
    header: string,
    footer: string,
    content: ComparisonReportReportContentSix,
  ): string {
    let pageNumber = 5;
    const page_1 = `  <div id="page_5" class="page text-center" >
      ${header}
      <div class="content same-page">
     
      <div  class="main_header text-start">6 Sector coverage  </div>
      <blockquote class=" paragraph blockquote text-start ">
      <p >
      The pie chart below shows how the relative distribution of sectors that are covered by the interventions contained in this portfolio. 
      </p>
     </blockquote> 
      <div  class="image-pie "><figure class="figure ">
      <img src="${content.link}"  alt="sector coverage represent chart.">
      
     </figure></div>
     
    
      </div>
      
      ${footer.replace('#pageNumber#', (pageNumber++).toString())}
      
       </div>`;

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
    return body?body:`<tr><td colspan="${cols.length}" style=" text-align: center;" ><p>No data found</p></td></tr>`;
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
  generateHeatMapforinvestment(
    y: number,
    contentTwo: ReportContentTwo | ReportCarbonMarketDtoContentFour,
  ) {
    let body = '';
    for (let x of this.xData) {
      body =
        body +
        '<td  class="charttd" style="background-color:' +
        this.getBackgroundColorInvestmentHeatmap(x.value, y) +
        '; color:' +
        (this.getIntervention(x.value, y, contentTwo)
          ? '#404040'
          : this.getBackgroundColorInvestmentHeatmap(x.value, y)) +
        ';">' +
        '<span class="' +
        (this.getIntervention(x.value, y, contentTwo) ? 'intervention' : '') +
        '">1</span>' +
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
    if (
      x <= -1 ||
      (x === 1 && y === 0) ||
      (x === 0 && y === 1) ||
      (x === 0 && y === 0)
    ) {
      return '#ec6665';
    } else {
      let value = x + y;
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
  getIntervention(
    x: number,
    y: number,
    contentTwo: ReportContentTwo | ReportCarbonMarketDtoContentFour,
  ) {
    return contentTwo.processScore === y && contentTwo.outcomeScore === x;
  }
  generateHeatMapforComparison(
    y: number,
    contentTwo: ComparisonReportReportContentFive,
  ) {
    let body = '';
    for (let x of this.xData) {
      const numberOfmatching:number=this.getInterventionComparison(x.value, y, contentTwo)
      body =
        body +
        '<td  class="charttd" style="background-color:' +
        this.getBackgroundColorInvestmentHeatmap(x.value, y) +
        '; color:' +
        (numberOfmatching
          ? '#404040'
          : this.getBackgroundColorInvestmentHeatmap(x.value, y)) +
        ';">' +
        '<span class="' +
        (numberOfmatching>0 ?numberOfmatching==1?'intervention': 'intervention-large' : '') +
        '">1</span>' +
        '</td>';
    }
    return body;
  }
  getInterventionComparison(
    x: number,
    y: number,
    contentTwo: ComparisonReportReportContentFive,
  ) {
    let a = contentTwo.scores?.filter(item => item.processScore === y && item.outcomeScore === x).length
   
    return a 

  }
}
