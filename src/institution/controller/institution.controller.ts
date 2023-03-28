import {
  Controller,
  Get,
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
import { Any, getConnection } from 'typeorm';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Institution } from '../entity/institution.entity';
import { InstitutionService } from '../service/institution.service';
import { ApiCreatedResponse } from '@nestjs/swagger';

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
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails, // @Inject(REQUEST) private request
  ) {}

  get base(): CrudController<Institution> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
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
      'Technical Team',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('institution/institutioninfo/:page/:limit/:filterText/:userId')
  async getInstiDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number; //instypeId
    console.log('userTypeFromTocken==',  this.tokenDetails.getDetails([ 
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.role,
    ]));
    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    console.log('userTypeFromTocken==', userTypeFromTocken);

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

  @UseGuards(JwtAuthGuard)
  @Get('institution/institutioninfo/:filterText/:userId')
  @ApiCreatedResponse({type: Any})
  async getInsti(
    @Request() request,
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

    console.log('userTypeFromTocken==', userTypeFromTocken);

    return await this.service.getInsDetails(
      filterText,
      countryIdFromTocken,
      sectorIdFromTocken,
      userTypeFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('deactivateInstituion')
  @ApiCreatedResponse({type: Any})
  async deactivateInstitution(@Query('instiId') instiId: number): Promise<any> {
    let audit: AuditDto = new AuditDto();
    audit.action = 'Institution Deactivated';
    audit.comment = 'Institution Deactivated';
    audit.actionStatus = 'Deactivated';
    // this.auditService.create(audit);
    console.log('Institution Deactivated');
    return await this.service.softDelete(instiId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionforAssesment')
  @ApiCreatedResponse({type: Any})
  async getInstitutionforAssesment(): Promise<any> {
    console.log('wwwwwwwwwwwwwwwwwwww');
    let countryIdFromTocken:number ;
    let sectorIdFromTocken:number;
  
    [countryIdFromTocken,sectorIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])



    return await this.service.getInstitutionforAssesment(countryIdFromTocken);
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionforApproveData')
  @ApiCreatedResponse({type: Any})
  async getInstitutionforApproveData(): Promise<any> {
    
    let countryIdFromTocken:number ;
    let sectorIdFromTocken:number;
  
    [countryIdFromTocken,sectorIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId,TokenReqestType.sectorId])



    return await this.service.getInstitutionforApproveData(countryIdFromTocken,sectorIdFromTocken);
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  @ApiCreatedResponse({type: Any})
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
      let newInstitution= await this.service.creteNew(dto);
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

  @UseGuards(JwtAuthGuard)
  @Override()
  async updateOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Institution,
  ): Promise<Institution> {

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      dto.editedOn= new Date()
      let updateInstitution= await queryRunner.manager.save(Institution,dto);
      if (updateInstitution.status == 0) {
        let audit: AuditDto = new AuditDto();
        audit.action = updateInstitution.name + ' Institution Updated';
        audit.comment = 'Institution Updated';
        audit.actionStatus = 'Updated';
        // this.auditService.create(audit);
        console.log('Institution Updated');
      }
      await queryRunner.commitTransaction();
      return updateInstitution;
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

  // @UseGuards(JwtAuthGuard)
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

    [countryIdFromTocken, sectorIdFromTocken, InstitutionIdFromTocken,role] =this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
        TokenReqestType.role,
      ]);

    console.log('countryIdFromTocken====', countryIdFromTocken);
    console.log('sectorIdFromTocken====', sectorIdFromTocken);

    console.log('InstitutionIdFromTocken====', InstitutionIdFromTocken);

    let resault = await this.service.getInstitutionForManageUsers(
      {
        limit: limit,
        page: page,
      },
      countryIdFromTocken,
      sectorIdFromTocken,
      InstitutionIdFromTocken,
      role
    );

    return resault;
  }


 
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
  ) : Promise<any>{ 

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
