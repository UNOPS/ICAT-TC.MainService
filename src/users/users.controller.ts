import {
  Body,
  Controller,
  Delete,
  Get,
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
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
  ParsedBody,
} from '@nestjsx/crud';
import { request } from 'http';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Institution } from 'src/institution/entity/institution.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserType } from './user.type.entity';
import { UsersService } from './users.service';

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
    },

    // this works
    // filter: {
    //   id: {
    //     $eq: 1,
    //   }
    // }
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

    private readonly auditService: AuditService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: User): Promise<User> {

    let audit: AuditDto = new AuditDto();
    audit.action = createUserDto.firstName +' User Created';
    audit.comment = "User Created";
    audit.actionStatus = 'Created';
    audit.userName = 'created'
    //this.auditService.create(audit);
    console.log("audit.......",audit);
    createUserDto.userType = new UserType()
    createUserDto.userType.id = 1

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
        // u.telephone="";
        u.username =dto.email;
        u.mobile='0114455125'
        // const mas =await this.unitService.find({name: "ClimateSI Unit"});
        // if(mas.length > 0){
          // u.unit = mas[0];
          await this.service.adduser(u);
        // }

        return "Master admin is saved"
      }      
      else{
        const u = users[0];
        u.email = dto.email;
        u.firstName = "Master";
        u.lastName = "Admin";
        u.loginProfile = dto.loginProfile;
        // u.telephone="";
        await this.service.updateuser(u);
        return "Master admin is updated";
      }      
    }catch(err){
      console.log(err)
      return "Failed to add master admin";
    }
  }

  @Patch('changeStatus')
  changeStatus( @Query('id') id:number, @Query('status') status:number): Promise<User> {
   console.log('status',status)
   
    return this.service.chnageStatus(id,status);
  }

  @Get('findUserBy')
  async findUserByUserType(@Request() request): Promise<any> {
    

    // console.log('test', this.service.findByUserName(userName));
    return await this.service.findUserByUserType();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
  let x = await this.service.findOne({where:{id:id} });
  console.log("xxxxxxxxxxxx=====",x)
    return this.service.findOne({where:{id:id} });
  }

  @Get('isUserAvailable/:userName')
  async isUserAvailable(@Param('userName') userName: string): Promise<boolean> {
    return await this.service.isUserAvailable(userName);
  }

  @Get('findUserByUserName/:userName')
  async findUserByUserName(@Param('userName') userName: string): Promise<any> {
    // console.log(userName);

    // console.log('test',await this.service.findByUserName(userName));
    return await this.service.findUserByUserName(userName);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.service.remove(id);
  }

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Request() req2) {
    
    
    console.log(req.parsed.filter.length, req.parsed.search['$and'][0]);

    let userList = await this.base.getManyBase(req);
    console.log('yyyyyyyyyyyyyyyyyyyyyyyy',userList);

    return userList;
  }




  @Get(
    'AllUserDetails/userDetalils/:page/:limit/:filterText/:userTypeId',
  )
  async AllUserDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userTypeId') userTypeId: number,
  ): Promise<any>{
    console.log('incontroler...')
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
  ): Promise<any> {
    console.log('incontroler...');
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

  // @Get(
  //   'AllUserDetails/userDetalils/:page/:limit/:filterText/:userTypeId',
  // )
  // async getUserList(
  //   @Request() request,
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('userTypeId') filterText: string,
  //   @Query('userTypeId') userTypeId: number,
  // ): Promise<any>{
  //   console.log('incontroler...')
  //   return await this.service
  //   .getUserDetails(
  //     {
  //       limit: limit,
  //       page: page,
  //     },
  //     filterText,
  //     userTypeId,
  //   );
  // }
  
    
}
