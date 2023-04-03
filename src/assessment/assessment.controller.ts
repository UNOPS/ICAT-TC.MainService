import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Request, UseGuards,  } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
    return this.assessmentService.update(+id, updateAssessmentDto);
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

  @Get('getAssessmentsForApproveData/:id/:assementYear/:userName')
  async getAssessmentsForApproveData(
    @Request() request,
    @Query('id') id: number,
    @Query('assementYear') assementYear: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.assessmentService.getAssessmentForApproveData(
      id,
      assementYear,
      userName,
    );
  }
}
