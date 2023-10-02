import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Any, Repository, getConnection } from 'typeorm';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Institution } from '../entity/institution.entity';
import { InstitutionService } from '../service/institution.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { InstitutionCategory } from '../entity/institution.category.entity';
import { InstitutionType } from '../entity/institution.type.entity';

@Crud({
  model: {
    type: Institution,
  },
  query: {
    join: {
      category: {
        eager: true,
      },
      province: {
        eager: true,
      },
      district: {
        eager: true,
      },
      divisionalSecretariat: {
        eager: true,
      },
      parentInstitution: {
        eager: true,
      },
      type: {
        eager: true,
      },
      hierarchy: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      country: {
        eager: true,
      },
    },
  },
})
@Controller('institution')
export class InstitutionController implements CrudController<Institution> {
  constructor(
    public service: InstitutionService,
    @InjectRepository(Institution)
    private readonly repo: Repository<Institution>,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails, // @Inject(REQUEST) private request
  ) { }

  get base(): CrudController<Institution> {
    return this;
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.DATA_COLLECTION_TEAM]))

  @Get(
    'getInstitutionDataProvider/institutioninfo/:page/:limit/:filterText/:userId',
  )
  async getInstitutionDataProvider(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number; //instypeId

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    return await this.service.getInstitutionDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionTypeId,
      userTypeFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.COUNTRY_ADMIN, LoginRole.SECTOR_ADMIN, LoginRole.DATA_COLLECTION_TEAM, LoginRole.MRV_ADMIN, LoginRole.TECNICAL_TEAM]))
  @Get('institution/:page/:limit/:filterText/:userId')
  async getInstiDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number;
    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken, institutionTypeId] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
        TokenReqestType.InstitutionId,
      ]);


    return await this.service.getInstitutionDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionTypeId,
      userTypeFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.COUNTRY_ADMIN, LoginRole.SECTOR_ADMIN, LoginRole.DATA_COLLECTION_TEAM, LoginRole.MRV_ADMIN, LoginRole.TECNICAL_TEAM]))

  @Get('institution/institutioninfo/:filterText/:userId')
  @ApiCreatedResponse({ type: Any })
  async getInsti(
    @Request() request,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;

    [countryIdFromTocken] =
      this.tokenDetails.getDetails([TokenReqestType.countryId]);


    return await this.service.getInsDetails(
      filterText,
      countryIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.COUNTRY_ADMIN, LoginRole.SECTOR_ADMIN, LoginRole.DATA_COLLECTION_TEAM, LoginRole.MRV_ADMIN, LoginRole.TECNICAL_TEAM]))

  @Get('deactivateInstituion')
  @ApiCreatedResponse({ type: Any })
  async deactivateInstitution(@Query('instiId') instiId: number): Promise<any> {
    let audit: AuditDto = new AuditDto();
    audit.action = 'Institution Deactivated';
    audit.comment = 'Institution Deactivated';
    audit.actionStatus = 'Deactivated';
    // this.auditService.create(audit);
    console.log('Institution Deactivated');
    return await this.service.softDelete(instiId);
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.DATA_COLLECTION_TEAM]))
  @Get('getInstitutionforAssesment')
  @ApiCreatedResponse({ type: Any })
  async getInstitutionforAssesment(): Promise<any> {
    console.log('wwwwwwwwwwwwwwwwwwww');
    let countryIdFromTocken: number;

    [countryIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId])



    return await this.service.getInstitutionforAssesment(countryIdFromTocken);
  }


  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.DATA_COLLECTION_TEAM]))

  @Get('getInstitutionforApproveData')
  @ApiCreatedResponse({ type: Any })
  async getInstitutionforApproveData(): Promise<any> {

    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId])



    return await this.service.getInstitutionforApproveData(countryIdFromTocken, sectorIdFromTocken);
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.COUNTRY_ADMIN, LoginRole.SECTOR_ADMIN, LoginRole.DATA_COLLECTION_TEAM, LoginRole.MRV_ADMIN, LoginRole.TECNICAL_TEAM]))

  @Override()
  @ApiCreatedResponse({ type: Any })
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Institution,
  ): Promise<Institution> {
    console.log(
      '------ppp--------------------',
    );
    // const queryRunner = getConnection().createQueryRunner();
    // await queryRunner.startTransaction();
    try {
      console.log(
        '-----------------------------------------------------------',
      );
      dto.createdBy = '-';
      dto.editedBy = '-';

      dto.parentInstitution = null;
      if (dto.type != undefined) {
        console.log('type have', dto.type);
      }
      if (dto.category != undefined) {
        console.log('cat have', dto.category);
      }
      if (dto.sector != undefined) {
        console.log('sec have', dto.sector);
      }

      console.log(dto);
      let newInstitution = await this.service.creteNew(dto);
      // let newInstitution= await queryRunner.manager.save(Institution ,dto);

      // let audit: AuditDto = new AuditDto();
      // audit.action = newInstitution.name + ' Created';
      // audit.comment = newInstitution.name + ' Created';
      // audit.actionStatus = 'Created';
      // this.auditService.create(audit);

      // await queryRunner.commitTransaction();
      return newInstitution;
    }
    catch (err) {
      console.log("worktran2")
      console.log(err);
      // await queryRunner.rollbackTransaction();
      return err;
    } finally {
      // await queryRunner.release();
    }
  }

  // @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.COUNTRY_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.MRV_ADMIN,LoginRole.TECNICAL_TEAM]))
  // @Override()
  // async updateOne(
  //   @Request() request,
  //   @ParsedRequest() req: CrudRequest,
  //   @ParsedBody() dto: Institution,
  // ): Promise<Institution> {
  //   console.log("request",dto)
  //   const queryRunner = getConnection().createQueryRunner();
  //   await queryRunner.startTransaction();

  //   try {
  //     dto.editedOn= new Date()
  //     let updateInstitution= await queryRunner.manager.save(Institution,dto);
  //     if (updateInstitution.status == 0) {
  //       let audit: AuditDto = new AuditDto();
  //       audit.action = updateInstitution.name + ' Institution Updated';
  //       audit.comment = 'Institution Updated';
  //       audit.actionStatus = 'Updated';
  //       // this.auditService.create(audit);
  //       console.log('Institution Updated');
  //     }
  //     await queryRunner.commitTransaction();
  //     return updateInstitution;
  //   }
  //   catch (err) {
  //     console.log("worktran2")
  //     console.log(err);
  //     await queryRunner.rollbackTransaction();
  //     return err;
  //   } finally {
  //     await queryRunner.release();
  //   }

  // }

  @Post('syncins')
  async syncCountry(
    @Body() dto: any,
  ): Promise<any> {
    let ins = new Institution();
    let cat = new InstitutionCategory();
    let type = new InstitutionType();
    type.id = 1
    cat.id = 1;

    ins.name = dto.mrvInstitution;
    ins.telephoneNumber = dto.mobile;
    ins.sectorId = 1
    ins.country = dto.country;
    ins.category = cat;
    ins.type=type;
    return this.repo.save(ins);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionForManageUsers')
  async getInstitutionForManageUsers(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let InstitutionIdFromTocken: number;
    let role: string;

    [countryIdFromTocken, sectorIdFromTocken, InstitutionIdFromTocken, role] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.InstitutionId,
      TokenReqestType.role,
    ]);

    let ins = await this.service.findOne({ where: { id: InstitutionIdFromTocken } });

    let resault = await this.service.getInstitutionForManageUsers(
      {
        limit: limit,
        page: page,
      },
      countryIdFromTocken,
      sectorIdFromTocken,
      InstitutionIdFromTocken,
      role, ins.sectorId
    );

    return resault;
  }


  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.MASTER_ADMIN, LoginRole.COUNTRY_ADMIN, LoginRole.SECTOR_ADMIN, LoginRole.DATA_COLLECTION_TEAM, LoginRole.MRV_ADMIN, LoginRole.TECNICAL_TEAM, LoginRole.INSTITUTION_ADMIN]))

  @Get('getInstitutionForUsers')
  async getInstitutionForUsers(
    @Request() request,
    @Query('insId') insId: number,
    @Query('userType') userType: number,
  ): Promise<any> {


    let resault = await this.service.getInstitutionForUsers(
      insId,
      userType
    );

    return resault;
  }
  @Get('getALlinstitutions')
  async getAllInstitutions(
  ): Promise<any> {
    return await this.service.getAllInstitutions();
  }
  @Get('getInstituion')
  async getInstituion(
    @Request() request,
    @Query('filterText') type: number,
    @Query('countryId') countryId: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<any> {

    return await this.service.getInstituion(
      {
        limit: limit,
        page: page,
      },
      type,
      countryId,
    )
  }

}
