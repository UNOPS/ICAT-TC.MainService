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


  contentOne(header: string, footer: string): string {
    let pageNumber = 5;
    const page_one = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">1.	OVERVIEW OF THE METHODOLOGY </div>
  <div style="margin-top: 50px;" class="image-larg "><figure class="figure ">
  <img src="http://localhost:7080/report/Picture1.jpg" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
  <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
</figure></div>

  
  </div>
  
  ${footer.replace('#pageNumber#', pageNumber.toString())}
  
   </div>`;

    return page_one;
  }


  contentTwo(header: string, footer: string): string {
    let pageNumber = 5;

    const general_information  = [
      {
        general_information : 'data',
        assessment_information : 'test value',
      },
      {
        general_information : 'Name of the policy/action/package assessed',
        assessment_information : 'test value',
      },
      {
        general_information : 'Person(s)/organisation(s) that did the assessment',
        assessment_information : 'test value',
      },
      {
        general_information : 'Date of the assessment',
        assessment_information : 'test value',
      }, {
        general_information : 'Whether the assessment is an update of a previous assessment, and if so, links to any previous assessments',
        assessment_information : 'test value',
      },
      {
        general_information : 'Objective(s) of the assessment ',
        assessment_information : 'test value',
      },
      {
        general_information : 'Intended audience(s) of the assessment ',
        assessment_information : 'test value',
      },
      {
        general_information : 'Opportunities for stakeholders to participate in the assessment',
        assessment_information : 'test value',
      },
      {
        general_information : 'Principles on which the assessment is based',
        assessment_information : 'test value',
      },
    ];
    const page_1 = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">2.	DEFINING THE ASSESSMENT (PART I & II)</div>
  <blockquote class=" paragraph blockquote text-start ">
           <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
             took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
             </p>
         </blockquote>
         <blockquote class=" paragraph blockquote text-start ">
           <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
            a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
           </p>
         </blockquote>
         <div class="report-table-sm">
         <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
             <tr>
               <th scope="col">General information </th>
               <th scope="col">Assessment information </th>
               
             </tr>
           </thead>
           <tbody class="table-active ">
           ${general_information
             .map(
               (a: { general_information: string; assessment_information: string }) =>
                 '<tr><td>' +
                 a.general_information +
                 '</td><td>' +
                 a.assessment_information +
                 '</td></tr>',
             )
             .join('')}
           </tbody>
         </table>
       </div>
  
  </div>
  
  ${footer.replace('#pageNumber#', pageNumber.toString())}
  
   </div>`;

   const describing_policy_or_action  = [
    {
      information  : 'Individual policy/action or package of related policies/ actions? If a package is assessed, which policies and actions are included in the package?',
      assessment_information : 'test value',
    },
    {
      information : 'Is the assessment ex-ante, ex-post, or a combination of ex-ante and ex-post?',
      assessment_information : 'test value',
    },
    {
      information : 'Assessment boundary in terms of impacts covered',
      assessment_information : 'test value',
    },
    {
      information : 'Assessment boundary in terms of geographical coverage',
      assessment_information : 'test value',
    }, {
      general_information : 'Assessment boundary in terms sectoral coverage',
      assessment_information : 'test value',
    },
    {
      information : 'Assessment period ',
      assessment_information : 'test value',
    },
    {
      information : 'Intended audience(s) of the assessment ',
      assessment_information : 'test value',
    },
   
  ];


   const page_2 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
   <blockquote class=" paragraph blockquote text-start ">
            <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
             Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
              took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
              </p>
          </blockquote>
          <blockquote class=" paragraph blockquote text-start ">
            <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
             Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
             a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
            </p>
          </blockquote>
          <div class="report-table-sm">
          <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>
          <table class="table  table-bordered border-dark">
            <thead class="table-primary  border-dark">
              <tr>
                <th scope="col">General information </th>
                <th scope="col">Assessment information </th>
                
              </tr>
            </thead>
            <tbody class="table-active ">
            ${describing_policy_or_action
              .map(
                (a: { information: string; assessment_information: string }) =>
                  '<tr><td>' +
                  a.information +
                  '</td><td>' +
                  a.assessment_information +
                  '</td></tr>',
              )
              .join('')}
            </tbody>
          </table>
        </div>
   
   </div>
   
   ${footer.replace('#pageNumber#', pageNumber.toString())}
   
    </div>`;
    const transformational_change_guidance   = [
      {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      },
      {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      },
      {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      },
      {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      }, {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      },
      {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      },
      {
        information  : 'test value',
        description : 'test value',
        assessment_information : 'test value',
      },
     
    ];


    const page_3 = `  <div id="page_9" class="page text-center" >
   ${header}
   <div class="content">
   
   
          <div class="report-table-sm">
          <figcaption class="figure-caption-table figure-caption text-start">Transformational Change Guidance for an example of filling out the template</figcaption>
          <table class="table  table-bordered border-dark">
            <thead class="table-primary  border-dark">
              <tr>
                <th scope="col">Information </th>
                <th scope="col">Description</th>
                <th scope="col">Assessment information </th>
                
              </tr>
            </thead>
            <tbody class="table-active ">
            ${transformational_change_guidance
              .map(
                (a: { information: string;description: string; assessment_information: string }) =>
                  '<tr><td>' +
                  a.information +
                  '</td><td>' +
                  a.description +
                  '</td><td>' +
                  a.assessment_information +
                  '</td></tr>',
              )
              .join('')}
            </tbody>
          </table>
        </div>
   
   </div>
   
   ${footer.replace('#pageNumber#', pageNumber.toString())}
   
    </div>`;

    const page_4 = `  <div id="page_9" class="page text-center" >
    ${header}
    <div class="content">
    
    
           <div class="report-table-sm">
           <figcaption class="figure-caption-table figure-caption text-start">Transformational Change Guidance for an example of filling out the template</figcaption>
           <table class="table  table-bordered border-dark">
             <thead class="table-primary  border-dark">
               <tr>
                 <th scope="col">Information </th>
                 <th scope="col">Description</th>
                 <th scope="col">Assessment information </th>
                 
               </tr>
             </thead>
             <tbody class="table-active ">
             ${transformational_change_guidance
               .map(
                 (a: { information: string;description: string; assessment_information: string }) =>
                   '<tr><td>' +
                   a.information +
                   '</td><td>' +
                   a.description +
                   '</td><td>' +
                   a.assessment_information +
                   '</td></tr>',
               )
               .join('')}
             </tbody>
           </table>
         </div>
    
    </div>
    
    ${footer.replace('#pageNumber#', pageNumber.toString())}
    
     </div>`;
     const page_5 = `  <div id="page_9" class="page text-center" >
     ${header}
     <div class="content">
     
     <blockquote class=" paragraph blockquote text-start ">
     <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
      a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
     </p>
   </blockquote>
   <div style="margin-top: 50px;" class="image-larg "><figure class="figure ">
   <img src="http://localhost:7080/report/Picture3.png" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
   <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
 </figure></div>     
     
     </div>
     
     ${footer.replace('#pageNumber#', pageNumber.toString())}
     
      </div>`;

      const understanPolicyOrActions = [
        {
          Time_periods: 'Long-term (≥15 years)',
          description: 'description 1',
          assessment_information:'test value'
        },
        {
          Time_periods: 'Medium-term (≥5 years and greater than 15 years)',
          description: 'description 2',
          assessment_information:'test value'
        },
        {
          Time_periods: 'Short-term (greater than 5 years)',
          description: 'description 3',
          assessment_information:'test value'
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
      const page_6 = `  <div id="page_9" class="page text-center" >
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
          <th scope="col">Time periods</th>
          <th scope="col">Description of the vision for desired societal, environmental and technical changes</th>
          <th scope="col">Assessment information</th>
        </tr>
      </thead>
      <tbody class="table-active">
      ${understanPolicyOrActions
        .map(
          (a: {
            assessment_information: string; Time_periods: string; description: string 
}) =>
            '<tr><td>' +
            a.Time_periods +
            '</td><td>' +
            a.description +
            '</td><td>' +
            a.assessment_information +
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
      
      ${footer.replace('#pageNumber#', pageNumber.toString())}
      
       </div>`;
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
           <th scope="col">Process Characteristic</th>
           <th scope="col">Description </th>
           <th scope="col">Relevance </th>
           <th scope="col">Justification </th>
         </tr>
       </thead>
       <tbody class="table-active">
        <tr>
         <td rowspan="3" >Technology</td>
         <td>Research and development</td>
         <td>test value</td>
         <td>test value</td>
         <td>test value</td>
        
         
       </tr>
       <tr>
       <td>Adoption</td>
       <td>test value</td>
       <td>test value</td>
       <td>test value</td>
       </tr>
        <tr>
       <td>Scale up</td>
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
      </tr>
     <tr>
     <td>Coalition of advocates </td>
     <td>test value</td>
         <td>test value</td>
         <td>test value</td>
     </tr>
      <tr>
     <td>Beneficiaries</td>
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
     </tr>
     <tr>
     <td>Disincentives</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Institutions and regulations</td>
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
     </tr>
     <tr>
     <td>Behavior</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
     </tr>
     <tr>
     <td>Social norms</td>
     <td>test value</td>
     <td>test value</td>
     <td>test value</td>
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

    return page_1+page_2+page_3+page_4+page_5+page_6+page_7+page_8;
  }

  contentThree(header: string, footer: string): string {
    let pageNumber = 5;
    const assessment = [];

    const page_1 = `  <div id="page_5" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">3.	IMPACT ASSESSMENT (PART III)</div>
  <div  class="main_header_sub text-start">3.1	Assessment of the starting situation </div> 
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
<td>Behavior</td>
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
    <div  class="main_header_sub text-start">3.2	Ex-ante assessment </div> 
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
          <th scope="col">Relative importance</th>
          <th scope="col">Rationale for importance</th>
          
          
        </tr>
      </thead>
      <tbody class="table-active">
       <tr>
        <td   >Technology</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
     
      </tr>
      <tr>
      <td   >Agents</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
     
    </tr>
    <tr>
    <td   >Incentives</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
    <td>test value</td>
     
    </tr>
    <tr>
    <td   >Norms  </td>
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
           
           const page_12 = `  <div id="page_9" class="page text-center" >
           ${header}
           <div class="content">
           <div  class="main_header text-start"></div>
           <div style="margin-top: 50px;" class="image-larg "><figure class="figure ">
           <img src="http://localhost:7080/report/Picture2.png" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
           <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
         </figure></div>


         <div style="margin-top: 50px;" class="image-set  row">
                  
         <div class="col-4"><figure class="figure ">
           <img src=""http://localhost:7080/report/Picture3.png"" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
           <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
         </figure></div>
         <div class="col-4"><figure class="figure ">
           <img src=""http://localhost:7080/report/Picture3.png"" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
           <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
         </figure></div>
         <div class="col-4"><figure class="figure ">
           <img src=""http://localhost:7080/report/Picture3.png"" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
           <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
         </figure></div>
         <div class="col-4"><figure class="figure ">
           <img src=""http://localhost:7080/report/Picture3.png"" class="figure-img" alt="A generic square placeholder image with rounded corners in a figure.">
           <figcaption class="figure-caption">Figure 2: GHG emissions by source for the inventory year 2020</figcaption>
         </figure></div>
       </div>
           
           </div>
           
           ${footer.replace('#pageNumber#', pageNumber.toString())}
           
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
            page_10 + page_11+page_12
    
          );
  }

  contentFour(header: string, footer: string): string {
    let pageNumber = 5;
    const general_information  = [
      {
        indicator : 'data',
        type_of_data  : 'test value',
        monitoring_frequency   : 'test value',
        data_source  : 'test value',
        responsible_entity  : 'test value',
        observed_data   : 'test value',
      },
      {
        indicator : 'data',
        type_of_data  : 'test value',
        monitoring_frequency   : 'test value',
        data_source  : 'test value',
        responsible_entity  : 'test value',
        observed_data   : 'test value',
      },
      {
        indicator : 'data',
        type_of_data  : 'test value',
        monitoring_frequency   : 'test value',
        data_source  : 'test value',
        responsible_entity  : 'test value',
        observed_data   : 'test value',
      },
      {
        indicator : 'data',
        type_of_data  : 'test value',
        monitoring_frequency   : 'test value',
        data_source  : 'test value',
        responsible_entity  : 'test value',
        observed_data   : 'test value',
      },
     
    ];
    const page_one = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">4.	MONITORING AND REPORTING (PART IV)</div>
  <blockquote class=" paragraph blockquote text-start ">
  <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
   Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
    took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
    </p>
</blockquote>
<div class="report-table-sm">
         <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
             <tr>
               <th scope="col">Indicator</th>
               
               <th scope="col">Type of data (quantitative/ qualitative)</th>
               <th scope="col">Monitoring frequency and date of collection</th>
               <th scope="col">Data source/ collection method</th>
               <th scope="col">Responsible entity</th>
               <th scope="col">Observed data (unit)</th>
             </tr>
           </thead>
           <tbody class="table-active ">
           ${general_information
             .map(
               (a: { indicator: string;type_of_data: string;monitoring_frequency: string; data_source: string; responsible_entity: string;observed_data: string; }) =>
                 '<tr><td>' +
                 a.indicator +
                 '</td><td>' +
                 a.type_of_data +
                 '</td><td>' +
                 a.monitoring_frequency +
                 '</td><td>' +
                 a.data_source +
                 '</td><td>' +
                 a.responsible_entity +
                 '</td><td>' +
                 a.observed_data +
                 '</td></tr>',
             )
             .join('')}
           </tbody>
         </table>
       </div>
  
  </div>
  
  ${footer.replace('#pageNumber#', pageNumber.toString())}
  
   </div>`;

    return page_one;
  }
  contentFive(header: string, footer: string): string {
    let pageNumber = 5;
    const general_information  = [
      {
        information : 'data',
        assessment_information : 'test value',
      },
      {
        information : 'data',
        assessment_information : 'test value',
      },
     
     
    ];
    const page_one = `  <div id="page_9" class="page text-center" >
  ${header}
  <div class="content">
  <div  class="main_header text-start">5. DECISION-MAKING AND USING RESULTS (PART V)</div>
  <blockquote class=" paragraph blockquote text-start ">
  <p class="mb-0 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
   Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
    took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
    </p>
</blockquote>
<div class="report-table-sm">
         <figcaption class="figure-caption-table figure-caption text-start">table 1</figcaption>
         <table class="table  table-bordered border-dark">
           <thead class="table-primary  border-dark">
             <tr>
               <th scope="col">General information </th>
               <th scope="col">Assessment information </th>
               
             </tr>
           </thead>
           <tbody class="table-active ">
           ${general_information
             .map(
               (a: { information: string; assessment_information: string }) =>
                 '<tr><td>' +
                 a.information +
                 '</td><td>' +
                 a.assessment_information +
                 '</td></tr>',
             )
             .join('')}
           </tbody>
         </table>
       </div>
  
  </div>
  
  ${footer.replace('#pageNumber#', pageNumber.toString())}
  
   </div>`;

    return page_one;
  }
}
