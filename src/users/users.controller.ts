import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Institution } from 'src/institution/entity/institution.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UserType } from './entity/user.type.entity';
import { UsersService } from './users.service';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { Country } from 'src/country/entity/country.entity';
import { AuditDetailService } from 'src/utills/audit_detail.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      userType: {
        eager: true,
      },
      country: {
        eager: true,
      },
      Institution: {
        eager: true,
      },
      
    },

  },
})
@ApiTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    private auditDetailService: AuditDetailService,
    private readonly auditService: AuditService,
  ) {}

  @Post('createUser')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createUserDto: User): Promise<User> {
    console.log('create user')
    let details = await this.auditDetailService.getAuditDetails()
    let obj = {
      description: "Create user"
    }
    let body = { ...details, ...obj }
    try {
      let user = await this.service.create(createUserDto);
      body = { ...body, ...{ actionStatus: "Created successfully", } }
      this.auditDetailService.log(body)
      return user 
    } catch (error) {
      body = { ...body, ...{ actionStatus: "Failed to create", } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException(error)
    }

  }
  @Post('createExternalUser')
  createExternalUser(@Body() createUserDto: User): Promise<User> {

    let audit: AuditDto = new AuditDto();
    audit.action = createUserDto.firstName +' User Created';
    audit.comment = "User Created";
    audit.actionStatus = 'Created';
    audit.userName = 'created';
    createUserDto.userType = new UserType()
    createUserDto.userType.id = 12;
    let userCountry =new Country();
    userCountry.id=0
    let userIns =new Institution();
    userIns.id=0
    createUserDto.country=userCountry;
    createUserDto.institution=userIns;
    return this.service.create(createUserDto);
  }
  

  @Post('/add-master-admin')
  async addMasterAdmin(@Body() dto: CreateUserDto){

    try{
      let users = await this.service.find({where:{email: dto.email}});
      if(users.length === 0 ){
        const u = new User();
        u.email = dto.email;
        u.firstName = "Master";
        u.lastName = "Admin";
        u.loginProfile = dto.loginProfile;
        u.username =dto.email;
        u.mobile='0114455125'
          await this.service.adduser(u);
        return "Master admin is saved";
      }      
      else{
        const u = users[0];
        u.email = dto.email;
        u.firstName = "Master";
        u.lastName = "Admin";
        u.loginProfile = dto.loginProfile;;
        await this.service.updateuser(u);
        return "Master admin is updated";
      }      
    }catch(err){;
      return "Failed to add master admin";
    }
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.COUNTRY_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.MRV_ADMIN,LoginRole.INSTITUTION_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.TECNICAL_TEAM]))
  @Patch('changeStatus')
  changeStatus( @Query('id') id:number, @Query('status') status:number): Promise<User> {;
   
    return this.service.chnageStatus(id,status);
  }

  @Get('findUserBy')
  async findUserByUserType(@Request() request): Promise<any> {;
    return await this.service.findUserByUserType();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
  let x = await this.service.findOne({where:{id:id} });;
    return this.service.findOne({where:{id:id} });
  }

  @Get('isUserAvailable/:userName')
  async isUserAvailable(@Param('userName') userName: string): Promise<boolean> {
    return await this.service.isUserAvailable(userName);
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.COUNTRY_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.MRV_ADMIN,LoginRole.TECNICAL_TEAM,LoginRole.INSTITUTION_ADMIN]))

  @Get('findUserByUserName/:userName')
  async findUserByUserName(@Param('userName') userName: string): Promise<any> {;
    return await this.service.findUserByUserName(userName);
  }

  @Get('findUserByUserNameEx/:userName')
  async findUserByUserNameEx(@Param('userName') userName: string): Promise<any> {
    return await this.service.isUserAvailable(userName)
  }

  @Get('findUserByEmail/:userName')
  async findUserByEmail(@Param('userName') userName: string): Promise<any> {
    return await this.service.findUserByEmail(userName);
  }

 

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.service.remove(id);
  }

  get base(): CrudController<User> {
    return this;
  }

  @Post('syncuser')
  async syncCountry(
    @Body() dto: any,
  ): Promise<any> {
    this.service.syncUser(dto);
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Request() req2) {;

    let userList = await this.base.getManyBase(req);;

    return userList;
  }



  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.COUNTRY_ADMIN,LoginRole.SECTOR_ADMIN,LoginRole.MRV_ADMIN,LoginRole.INSTITUTION_ADMIN,LoginRole.DATA_COLLECTION_TEAM,LoginRole.TECNICAL_TEAM]))

  @Get(
    'AllUserDetails/userDetalils/:page/:limit/:filterText/:userTypeId',
  )
  async AllUserDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userTypeId') userTypeId: number,
  ): Promise<any>{;
    return await this.service
    .getUserDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userTypeId,
    );
  }
  @UseGuards(JwtAuthGuard,RoleGuard([LoginRole.MASTER_ADMIN,LoginRole.INSTITUTION_ADMIN]))

  @Get(
    'UsersByInstitution/userDetalils/:page/:limit/:filterText/:userTypeId/:institutionId',
  )
  async UsersByInstitution(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userTypeId') userTypeId: number,
    @Query('userName') userName: string,
  ): Promise<any> {;
    return await this.service.getUserDetailsByInstitution(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userTypeId,
      userName,
    );
  }

  
    
}
