import { Body, Controller, Get, Param, Patch, Post, Query, Req, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Repository } from 'typeorm-next';

import { ClimateAction } from './entity/climate-action.entity';
import { ProjectService } from './climate-action.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { editFileName, fileLocation } from './entity/file-upload.utils';
import { PolicyBarriers } from './entity/policy-barriers.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { PolicySector } from './entity/policy-sectors.entity';
const fs = require('fs');
var multer = require('multer');

@Crud({
  model: {
    type: ClimateAction,
  },
  query: {
    join: {
      projectStatus: {
        eager: true,
      },
      // sector: {
      //   eager: true,
      // },
      subSector: {
        eager: true,
      },
      aggregatedAction: {
        eager: true,
      },
      actionArea: {
        eager: true,
      },
      projectOwner: {
        eager: true,
      },
      financingScheme: {
        eager: true,
      },
      assessments: {
        eager: true,
      },
      // mappedInstitution: {
      //   eager: true,
      // },
      country: {
        eager: true,
      },
      mitigationActionType: {
        eager: true,
      },
      projectApprovalStatus: {
        eager: true,
      },
      
    },
  },
})
@Controller('climateAction')
// @UseGuards(LocalAuthGuard)
export class ProjectController implements CrudController<ClimateAction> {
  constructor(
    public service: ProjectService,
    public mailService: EmailNotificationService,
    @InjectRepository(ClimateAction)
    private readonly projectRepository: Repository<ClimateAction>,
    public configService: ConfigService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  filename: any = [];
  originalname: any = [];

  fname:any = [];
  oname:any = [];

  get base(): CrudController<ClimateAction> {
    return this;
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.MRV_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.TECNICAL_TEAM,LoginRole.INSTITUTION_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.EXTERNAL_USER]))
  // @Override()
  @Post('createOne')
  async createOne(
    // @Request() request,
    // @ParsedRequest() req: CrudRequest,
    // @ParsedBody() 
    dto: ClimateAction,
  ): Promise<ClimateAction>{
    try {
      console.log(
        '-----------------------------------------------------------',
      );
      dto.createdBy = '-';
      dto.editedBy = '-';

      console.log(dto);

      let newplData = await this.service.create(dto);

      return newplData;
    } catch (error) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log(error);
      throw error;
    }

    // await this.service.ceateSelfConvertion(dto.unitOfMeasure);
    // await this.service.ceateReverseConvertion(dto);
  }
  @Post('createNewCA')
  async createNewCA(req:ClimateAction){
    console.log("req",req)
    await this.service.create(req)
  }
 // @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))

  @Get('findAllPolicies')
async findAllPolicies() {
  const policies = await this.service.findAllPolicies();
  // console.log("aaaaa",policies)
  return policies;
}
@Get('getIntervention')
async getIntervention(@Query('id') id:number) :Promise<ClimateAction>{
  let  intervention = await this.service.getIntervention(id);
  // console.log("aaaaa",intervention)
  return intervention;
  }


  @Get('typeofAction')
  async findTypeofAction(): Promise<any[]> {
  let res  = await this.service.findTypeofAction();
    return res;
   
  }


  @Get(
    'AllClimateAction/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:countryId/:sectorId',
  )
  async getAllClimateActionList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    // console.log("heelo controler",page,limit,filterText,projectStatusId,projectApprovalStatusId,countryId,sectorId);

    return await this.service.getAllCAList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
   
      countryId,
      sectorId,
    );
  }

  @Post('uploadFiles')
  @UseInterceptors(
    FilesInterceptor('files',5,
    {
      storage: multer.diskStorage({
        destination: fileLocation,
        filename: editFileName,
      }),
    }),
  )
  async uploadFile2(
    @UploadedFiles() files,
    @Req() req: CrudRequest,
    @Request() request,

  ) {
    console.log("file")
    console.log(files)
    for(let e of files){
      this.filename = e.filename
      this.originalname = e.originalname

      this.fname.push(this.filename)
      this.oname.push(this.originalname)
    }
    //this.filename = files.filename
    //this.originalname = files.originalname
    //console.log("xxx" + this.filename)

    console.log("fname")
    console.log(this.fname)
    console.log("oname")
    console.log(this.oname)

  }

  


  // @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))


  @Get(
    'project/projectinfo/:page/:limit/:sectorId/:statusId/:mitigationActionTypeId/:editedOn/:filterText', 
  )
  async getClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('statusId') statusId: number,
    @Query('mitigationActionTypeId') mitigationActionTypeId: number,
    @Query('editedOn') editedOn: string,
    @Query('filterText') filterText: string,
    
  ): Promise<any> {
    // console.log(moment(editedOn).format('YYYY-MM-DD'))
  
    console.log("getall",page,limit,sectorId,statusId,mitigationActionTypeId,editedOn,filterText)
    return await this.service.getProjectDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      sectorId,
      statusId,
      mitigationActionTypeId,
      editedOn,
    );
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Get(
    'AllClimateActions/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:assessmentStatusName/:Active/:countryId/:sectorId',
  )
  async getAllClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,  
    @Query('assessmentStatusName') assessmentStatusName: string, 
    @Query('Active') Active: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
  

    [countryIdFromTocken, sectorIdFromTocken] =this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
    
      ]);
    return await this.service.getAllProjectDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      assessmentStatusName,
      Active, 
      countryIdFromTocken,
      sectorId,
    );
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  // @Override()
  @Patch('updateOneClimateAction')
  async updateOneClimateAction(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ClimateAction,
  ): Promise<any>  {
    let project = await this.projectRepository.findOne({
      where: { id: dto.id },
      relations: ['projectApprovalStatus'],
    });

    let updateData = await this.base.updateOneBase(req, dto);
    const baseurl = this.configService.get<string>('ClientURl');
    console.log(baseurl);

    if (
      dto.projectApprovalStatus &&
      dto.projectApprovalStatus.id !== project.projectApprovalStatus.id
    ) {
      if (dto.projectApprovalStatus.id === 1) {
        let emailTemplate = fs.readFileSync(
          './src/template/email/status-approved-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.policyName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id,
        );

        this.mailService.sendMail(
          project.email,
          'Approval Status Approved',
          'Approval Status Approved',
          emailTemplate,
        );
      }
      if (dto.projectApprovalStatus.id === 2) {
        let emailTemplate = fs.readFileSync(
          './src/template/email/status-rejected-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.policyName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id,
        );
        this.mailService.sendMail(
          project.email,
          'Approval Status Rejected',
          'Approval Status Rejected',
          emailTemplate,
        );
      }
      if (dto.projectApprovalStatus.id === 3) {
        let emailTemplate = fs.readFileSync(
          './src/template/email/status-datarequest-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.policyName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id,
        );
        this.mailService.sendMail(
          project.email,
          'Data request sent successfully',
          'Data request sent successfully',
          emailTemplate,
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Post("policybar")
  async policyBar(@Body() req:PolicyBarriers[]){
   return await this.service.save(req);
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Post("policySectors")
  async policySectors(@Body() req:PolicySector[]){
   return await this.service.savepolicySectors(req);
  }

  

  
  // @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Get('allProjectApprove')
  async allProjectApprove(
    @Request() request,   
    @Query('filterText') filterText: number,   
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) : Promise<any>{ 

    return await this.service.allProject(
      {
        limit: limit,
        page: page,
      },
      filterText,
    )
  }

 
  @Get('findPolicySectorData/:policyID')
  async findPolicySectorData(@Param('policyID') policyID: number) {
    return await this.service.findPolicySectorData(policyID);
  }

  @Get('findPolicyBarrierData/:policyID')
  async findPolicyBarrierData(@Param('policyID') policyID: number) {
    return await this.service.findPolicyBarrierData(policyID);
  }
  
}

