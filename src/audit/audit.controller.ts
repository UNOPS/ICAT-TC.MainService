import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import * as moment from 'moment';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuditService } from './audit.service';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
    model: {
      type: Audit,
    },
    query: {
      join: {
        country: {
          eager: true,
        },
        user: {
          eager: true,
        },
        
      },
    },
  })
@Controller('audit')
export class AuditController implements CrudController<Audit> {
    constructor(public service: AuditService,
      @InjectRepository(Audit)
      public configService: ConfigService, private readonly tokenDetails: TokenDetails,) {}

    get base(): CrudController<Audit> {
        return this;
      }

      @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.COUNTRY_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.TECNICAL_TEAM,LoginRole.DATA_COLLECTION_TEAM,LoginRole.QC_TEAM,LoginRole.INSTITUTION_ADMIN,LoginRole.DATA_ENTRY_OPERATOR]))
      @Post()
      create(@Body() auditDto: AuditDto){
      }

      @Get(
        'audit/auditinfo/:page/:limit/:userTypeId/:action/:editedOn/:filterText/:institutionId', 
      )
      async getAuditDetails(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('userTypeId') userTypeId: string,
        @Query('action') action: string,
        @Query('editedOn') editedOn: string,
        @Query('filterText') filterText: string,
        @Query('institutionId') institutionId:number
        
      ): Promise<any> {
        let InstitutionIdFromTocken: number;
       [ InstitutionIdFromTocken] =
       this.tokenDetails.getDetails([
         TokenReqestType.InstitutionId
       ]);
       var timestamp = Date.parse(editedOn);
      var dateObject = new Date(timestamp);
      
        return await this.service.getAuditDetails(
          {
            limit: limit,
            page: page,
          },
          filterText,
          userTypeId,
          action,
          editedOn,
          institutionId
        );

      }
}
