import { QualityCheckService } from './quality-check.service';
import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Controller('quality-check')
export class QualityCheckController implements CrudController<ParameterRequest>{

    constructor(public service: QualityCheckService,
        private readonly tokenDetails:TokenDetails,
        ) {}

        @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.MRV_ADMIN,LoginRole.TECNICAL_TEAM]))

  @Get(
    'quality-check/GetQCParameters/:page/:limit/:statusId/:filterText',
  )
  async GetQCParameters(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
    @Query('ctAction') ctAction: string,
  ): Promise<any> {
    let countryIdFromTocken:number ;
    [countryIdFromTocken] =    this.tokenDetails.getDetails([TokenReqestType.countryId])
   


    return await this.service.GetQCParameters(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      countryIdFromTocken,
      ctAction,
    );
  }



  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.MRV_ADMIN,LoginRole.TECNICAL_TEAM]))

  @Post(
    'quality-check/UpdateQCStatus/:paramId/:assessmentYearId/:qaStatusId/:comment/:userQc',
  )
  async UpdateQCStatus(
    @Query('paramId') paramId: number,
    @Query('assessmentYearId') assessmentYearId: number,
    @Query('qaStatusId') qaStatusId: number,
    @Query('comment') comment: string,
    @Query('userQc') userQc: string,
   
  ):Promise<any> {

  }
}
