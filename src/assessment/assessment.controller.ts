import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Request, UseGuards, Put,  } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { DataVerifierDto } from './dto/dataVerifier.dto';
import { getConnection } from 'typeorm';
import { LoginRole, RoleGuard } from 'src/auth/guards/roles.guard';
import { Assessment } from './entities/assessment.entity';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { Crud, CrudController } from '@nestjsx/crud';

@Controller('assessment')
export class AssessmentController {
  constructor(
    public assessmentService: AssessmentService,
    private readonly tokenDetails: TokenDetails,
  ) { }


  @Post()
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentService.create(createAssessmentDto);
  }

  @Get()
  findAll() {
    return this.assessmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.assessmentService.findbyID(id);
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.MRV_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.TECNICAL_TEAM]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
    return await this.assessmentService.update(+id, updateAssessmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assessmentYearForManageDataStatus/ass')
  async assessmentYearForManageDataStatus(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('isProposal') isProposal: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    console.log('=====================================================================',
    );
    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId])
   
    return await this.assessmentService.assessmentYearForManageDataStatus(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      isProposal,
      countryIdFromTocken,
      sectorIdFromTocken,

    );
  }

  // @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Get('checkAssessmentReadyForQC/getAssment/:id')
  async checkAssessmentReadyForQC(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: number,
  ): Promise<any> {
    return await this.assessmentService.checkAssessmentReadyForQC(assessmentId, assessmenYear);
  }

  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MRV_ADMIN,LoginRole.QC_TEAM,LoginRole.MASTER_ADMIN]))
  @Put('accept-qc')
  async acceptQC(@Body() updateDeadlineDto: DataVerifierDto): Promise<boolean> {

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let paeameter = this.assessmentService.acceptQC(updateDeadlineDto);
      // console.log(updateDeadlineDto)
      // await queryRunner.commitTransaction();
      return paeameter;
    }
    catch (err) {
      console.log("worktran2")
      console.log(err);
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN]))
  @Get('getAssessmentsForApproveData/:id/:assementYear/:userName')
  async getAssessmentsForApproveData(
    @Request() request,
    @Query('id') id: number,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.assessmentService.getAssessmentForApproveData(
      id,
      userName,
    );
  }



}
