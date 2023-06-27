import { User } from 'src/users/entity/user.entity';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ParameterRequestService } from './data-request.service';
import { UpdateDeadlineDto } from './dto/dataRequest.dto';
import { ParameterRequest } from './entity/data-request.entity';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiHeader } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { Tool } from './enum/tool.enum';

@Crud({
  model: {
    type: ParameterRequest,
  },
  query: {
    join: {
      parameter: {
        eager: true,
      },
      cmAssessmentAnswer: {
        eager: true,
        exclude: ['id']
      },
      investmentParameter: {
        eager: true,
        exclude: ['id']
      },
    },
    exclude: ['id']
  },
})
@Controller('parameter-request')
export class ParameterRequestController implements CrudController<ParameterRequest>
{
  constructor(
    private readonly tokenDetails:TokenDetails,
    public service: ParameterRequestService,
    private readonly auditService: AuditService,
  ) {}



  // @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.MRV_ADMIN,LoginRole.DATA_COLLECTION_TEAM]))
  @Get('getDateRequestToManageDataStatus')
  async getDateRequestToManageDataStatus(
    @Request() request,

    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmentYear: number,
    @Query('tool') tool: Tool,
  ): Promise<any> {
    return await this.service.getDateRequestToManageDataStatus(assessmentId,assessmentYear, tool);
  }

  @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.DATA_COLLECTION_TEAM]))
  @Get(
    'getNewDataRequest/:page/:limit/:filterText/:climateActionId/:year/:dataProvider/:tool',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  
  async getNewDataRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('dataProvider') dataProvider: number,
    @Query('tool') tool: string,
  ): Promise<any> {

    let countryIdFromTocken:number;
    let sectorIdFromTocken:number;

    [countryIdFromTocken,sectorIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])

    return await this.service.getNewDataRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      dataProvider,
      countryIdFromTocken,
      sectorIdFromTocken,
      tool
    );
  }


  @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.DATA_COLLECTION_TEAM]))
  @Get(
    'getNewDataRequestForClimateList/:page/:limit/:filterText/:climateActionId/:year/:dataProvider',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  async getNewDataRequestForClimateList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('dataProvider') dataProvider: number,
  ): Promise<any> {

    let countryIdFromTocken:number;
    let sectorIdFromTocken:number;

    [countryIdFromTocken,sectorIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])
    console.log("*******************************")
    return await this.service.getNewDataRequestForClimateList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      dataProvider,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))
  @Get(
    'getAssignDateRequest/:page/:limit/:filterText/:climateActionId/:userName/:tool',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  async getAssignDateRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('userName') userName: string,
    @Query('tool') tool: string,
  ): Promise<any> {
    return await this.service.getAssignDataRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      userName,
      tool
    );
  }

  @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN,LoginRole.DATA_ENTRY_OPERATOR]))
  @Get('getEnterDataRequest/:page/:limit/:filterText/:climateActionId/:year')
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  async getEnterDataParameter(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getEnterDataParameter(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      userName,
    );
  }
  @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN,LoginRole.DATA_ENTRY_OPERATOR]))
  @Get('getEnterDataRequests/:page/:limit/:filterText/:climateActionId/:year')
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  async getEnterDataParameters(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('userName') userName: string,
    @Query('tool') tool: Tool,
  ): Promise<any> {
    return await this.service.getEnterDataParameters(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      userName,
      tool
    );
  }

  @UseGuards(LocalAuthGuard,JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))

  @Get(
    'getReviewDataRequest/:page/:limit/:filterText/:climateActionId/:year/:type',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  async getReviewDataRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('type') type: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getReviewDataRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      type,
      userName,
    );
  }
 
  @Get(
    'getReviewDataRequests/:page/:limit/:filterText/:climateActionId/:year/:type',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: '1234'} 
   
  }) 	
  async getReviewDataRequests(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('type') type: string,
    @Query('userName') userName: string,
    @Query('tool') tool: Tool
  ): Promise<any> {
    return await this.service.getReviewDataRequests(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      type,
      userName,
      tool
    );
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.DATA_ENTRY_OPERATOR,LoginRole.INSTITUTION_ADMIN]))
  @Put('update-deadline')
  updateDeadline(
    @Request() request,
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    let audit: AuditDto=new AuditDto();
    audit.action='Deadline Updated';
    audit.comment='Deadline Updated';
    audit.actionStatus ='Updated'
    // this.auditService.create(audit);
    console.log(updateDeadlineDto);
    return this.service.updateDeadlineForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))
  @Put('update-deadline-dataEntry')
  updateDeadlineDataEntry(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    let audit: AuditDto=new AuditDto();
    audit.action='Deadline Updated';
    audit.comment=updateDeadlineDto.comment+' Updated';
    audit.actionStatus ='Updated'
    // this.auditService.create(audit);
    console.log(updateDeadlineDto);
    return this.service.updateDataEntryDeadlineForIds(updateDeadlineDto);
  }

  // @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.DATA_ENTRY_OPERATOR,LoginRole.INSTITUTION_ADMIN]))
  @Put('accept-review-data')
  acceptReviewData(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    console.log("================",updateDeadlineDto);
    let audit: AuditDto=new AuditDto();
    audit.action='Review Data Accepted';
    audit.comment=updateDeadlineDto.comment+' Accepted';
    audit.actionStatus ='Approved'
  
    // this.auditService.create(audit);
    
    return this.service.acceptReviewDataForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.INSTITUTION_ADMIN]))

  @Put('reject-review-data')
  rejectReviewData(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean | InternalServerErrorException> {
    let audit: AuditDto=new AuditDto();
    audit.action='Review Data Rejected';
    audit.comment=updateDeadlineDto.comment+' Rejected';
    audit.actionStatus ='Rejected'
  
    // this.auditService.create(audit);
    console.log("==========",updateDeadlineDto);
    return this.service.rejectReviewDataForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.DATA_ENTRY_OPERATOR,LoginRole.INSTITUTION_ADMIN]))

  @Put('reject-enter-data')
  rejectEnterData(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    let audit: AuditDto = new AuditDto();
    audit.action = 'Review Data Rejected';
    audit.comment = updateDeadlineDto.comment + ' Rejected';
    audit.actionStatus = 'Rejected';

    // this.auditService.create(audit);
    console.log("==========",updateDeadlineDto);
    return this.service.rejectEnterDataForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))
  @Get('climateaction/bydatRequestStatsu2')
  async getClimateActionByDataRequestStatus(
    @Request() request,
    
    
  ): Promise<any> {
    return await this.service.getClimateActionByDataRequestStatus(
     
    );
  }


  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))

  @Get('climateaction/bydatRequestStatsusSix')
  async getClimateActionByDataRequestStatusSix(
    @Request() request,
    
    
  ): Promise<any> {
    return await this.service.getClimateActionByDataRequestStatusSix(
     
    );
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))

  @Post('update-institution/:id')
  updateInstitution(
    @Query('id') id: number,
    
    @Body() updateValueDto: ParameterRequest,
  ): Promise<boolean> {
    // console.log("++++++++++++++++++++++++++++++++++++",updateValueDto)
    return this.service.updateInstitution(updateValueDto,id);
  }


}
