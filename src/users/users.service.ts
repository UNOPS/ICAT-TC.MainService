import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';;
import { Repository } from 'typeorm';;
import { User } from './entity/user.entity';
import * as bcript from 'bcrypt';;
import { UserType } from './entity/user.type.entity';;
import { ConfigService } from '@nestjs/config';
import { Institution } from 'src/institution/entity/institution.entity';
import { RecordStatus } from 'src/shared/entities/base.tracking.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Country } from 'src/country/entity/country.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';;
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

const { v4: uuidv4 } = require('uuid');

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    @InjectRepository(UserType)
    private readonly usersTypeRepository: Repository<UserType>,
    private readonly emaiService: EmailNotificationService,
    private configService: ConfigService,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    private readonly tokenDetails: TokenDetails,
  ) {
    super(repo);
  }

  async create(createUserDto: User): Promise<User> {
    let userTypeId = createUserDto.userType.id;
    let countryId = null;
    let insId = null;
    if (createUserDto.userType['id'] == 3) {;
      insId = createUserDto.institution['id'];;
    }
    else if (createUserDto.userType['id'] == 2) {
      countryId = createUserDto.country['id'];
      insId = 0;
      let cou = await this.countryRepo.findOne(countryId);
      cou.isCA = true;
      this.countryRepo.save(cou)
    }

    else if (createUserDto.userType['id'] == 1) {;
      insId = createUserDto.institution['id'];
    }

    else if (createUserDto.userType['id'] == 5) {
      insId = createUserDto.institution['id'];
    }

    let newUser = new User();

    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    if (createUserDto.username) {
      newUser.username = createUserDto.username;
    }
    else {
      newUser.username = newUser.firstName + (newUser.lastName ? ' ' + newUser.lastName : '');
    }
    newUser.email = createUserDto.email;
    newUser.mobile = createUserDto.mobile ? createUserDto.mobile : '';
    newUser.status = RecordStatus.Active;
    newUser.landline = createUserDto.landline ? createUserDto.landline : '';
    newUser.userType = createUserDto.userType;
    newUser.country = createUserDto.country;
    newUser.institution = createUserDto.institution;
    newUser.loginProfile = createUserDto.loginProfile;
    newUser.admin = ''
    let newUUID = uuidv4();
    newUser.resetToken = '';
    var newUserDb = await this.repo.save(newUser);
    let systemLoginUrl = '';
    if (newUser.userType.id == 2) {
      let url =   process.env.ClientURl;
      systemLoginUrl = url;
    }
    else {
      let url =  process.env.ClientURl;
      systemLoginUrl = url;
    }

    return newUserDb;
  }


  async chnageStatus(userId: number, status: number): Promise<User> {
    let user = await this.repo.findOne({ where: { id: userId } });
    user.status = status;
    return this.repo.save(user);
  }

  async chnagePassword(userId: number, newPassword: string): Promise<User> {
    let user = await this.repo.findOne({ where: { id: userId } });
    user.password = newPassword;
    return this.repo.save(user);
  }

  async updateChnagePasswordToken(
    userId: number,
    newToken: string,
  ): Promise<User> {
    let url =  process.env.ClientURl;
    let systemLoginUrl = url ;
    let user = await this.repo.findOne({ where: { id: userId } });
    user.resetToken = newToken;
    let newUUID = uuidv4();
    let newPassword = ('' + newUUID).substr(0, 6);
    user.password = await this.hashPassword(
      user.password,
      user.salt,
    );
    user.password = newPassword;
    this.repo.save(user);

    var template =
      'Dear ' + user.firstName + " " + user.lastName +
      ' <br/>Your username is ' +
      user.email +
      '<br/> your login password is : ' +
      newPassword +
      ' <br/>System login url is ' + '<a href="systemLoginUrl">' +
      systemLoginUrl;

    this.emaiService.sendMail(
      user.email,
      'Your credentials for ICAT system',
      '',
      template,
    );

    return this.repo.save(user);
  }

  async mailcreate(user: User) {
    let url =  process.env.ClientURl;
    let systemLoginUrl = url ;
    let newUUID = uuidv4();
    let newPassword = ('' + newUUID).substr(0, 6);
    user.password = await this.hashPassword(
      user.password,
      user.salt,
    );
    user.password = newPassword;
    var template =
      'Dear ' + user.firstName + " " + user.lastName +
      ' <br/>Your username is ' +
      user.email +
      '<br/> your login password is : ' +
      newPassword +
      ' <br/>System login url is ' + '<a href="systemLoginUrl">' +
      systemLoginUrl;

    this.emaiService.sendMail(
      user.email,
      'Your credentials for ICAT system',
      '',
      template,
    );
  }


  async adduser(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async updateuser(user: User) {
    return await this.repo.update(user.id, user);
  }

  async syncUser(dto: any) {
    let user = await this.repo.findOne({ where: { uniqueIdentification: dto.uniqueIdentification } });
    if (user) {
      user.status = dto.status;
      await this.repo.save(user);
    }
    else {
      let newUser = new User();
      newUser.status = dto.status;
      newUser.firstName = dto.firstName;
      newUser.lastName = dto.lastName;
      newUser.email = dto.email;
      newUser.username = dto.email;
      newUser.landline = dto.telephone;
      newUser.mobile = dto.mobile;
      newUser.salt = '';
      newUser.password = '';
      newUser.loginProfile = dto.id;
      newUser.institution = dto.ins;
      newUser.country = dto.country;
      newUser.uniqueIdentification = dto.uniqueIdentification;
      let ut = new UserType()
      ut.id = dto.userType.id
      newUser.userType = ut
      await this.repo.save(newUser);
    }
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findByUserName(userName: string): Promise<User> {
    return await this.repo.findOne({ where: { username: userName } });
  }
  async findByUseremail(userName: string): Promise<User> {
    return await this.repo.findOne({ where: { email: userName } });
  }

  @UseGuards(JwtAuthGuard)
  async userDetailsForAudit() {
    let countryIdFromTocken: number;
    let InstitutionIdFromTocken: number;
    let userNameFromTocken: string;
    let role: any;
    [countryIdFromTocken, InstitutionIdFromTocken, userNameFromTocken, role] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.InstitutionId, TokenReqestType.username, TokenReqestType.role])
    let user = this.findByUserName(userNameFromTocken);
    let uuId = (await user).userType.id;

    let userDetails = {
      countryId: countryIdFromTocken,
      institutionId: InstitutionIdFromTocken[0],
      userName: userNameFromTocken,
      userType: role,
      uuId: uuId
    }

    return userDetails
  }

  @UseGuards(JwtAuthGuard)
  async currentUser(): Promise<User> {
    let userNameFromTocken: string;
    [userNameFromTocken] = this.tokenDetails.getDetails([TokenReqestType.username]);
    let user = await this.findByUseremail(userNameFromTocken)
    return user
  }

  async validateUser(userName: string, password: string): Promise<boolean> {
    const user = await this.repo.findOne({ where: { username: userName } });

    return (await user).validatePassword(password);
  }


  async isUserAvailable(userName: string): Promise<any> {
    let user = await this.repo.findOne({ where: { username: userName } });
    if (user) {
      return user;
    } else {
      return user;
    }
  }

  async findUserByUserName(userName: string): Promise<any> {
    return await this.repo
      .findOne({ where: { username: userName } })
      .then((value) => {
        if (!!value) {

          return value.id;
        } else {
          return 0;
        }
      })
      .catch(() => {
        return 0;
      });
  }

  async findUserByEmail(email: string): Promise<any> {
    return await this.repo
      .findOne({ where: { email: email } })
      .then((value) => {
        if (!!value) {

          return value;
        } else {
          return false;
        }
      })
      .catch((e) => {
        return false;
      });
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id + '');
  }

  async validateResetPasswordRequest(
    email: string,
    token: string,
  ): Promise<boolean> {
    const user = await this.repo.findOne({ where: { email: email } })

    if (user && user.resetToken === token) {

      return true;
    } else {

      return false;
    }
  }

  async resetPassword(email: string, password: string): Promise<boolean> {
    let user = await this.repo.findOne({ where: { email: email } })
    if (user) {
      let salt = await bcript.genSalt();
      user.salt = salt;
      user.password = await this.hashPassword(password, salt);
      await this.repo.save(user);
      await this.updateChnagePasswordToken(user.id, ''); 
      return true;
    }

    return false;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcript.hash(password, salt);
  }


  async getUserDetails(

    options: IPaginationOptions,
    filterText: string,
    userTypeId: number,
  ): Promise<Pagination<User>> {
    let filter: string = '';

    let countryIDFromTocken: number;
    let roleFromTocken: string;
    let institutionIDFromTocken: number;
    [countryIDFromTocken, roleFromTocken, institutionIDFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.role, TokenReqestType.InstitutionId]);

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(user.firstName LIKE :filterText OR user.lastName LIKE :filterText  OR user.email LIKE :filterText OR ins.name LIKE :filterText OR type.name LIKE :filterText)';
    }

    if (userTypeId != 0) {
      if (filter) {
        filter = `${filter} and user.userTypeId = :userTypeId`;
      } else {
        filter = `user.userTypeId = :userTypeId`;
      }
    }
    if (userTypeId == null || userTypeId || undefined || roleFromTocken != "Master Admin") {
      if (roleFromTocken == "Country Admin") {
        if (filter) {
          filter = `${filter} and user.countryId =` + countryIDFromTocken + ` and user.userTypeId in (1,2,3, 5, 6,7,8,9,10,11)`;
        } else {
          filter = `user.countryId =` + countryIDFromTocken + ` and user.userTypeId in (1,2,3,5,6,7,8,9,10,11)`;
        }
      }
      else if (roleFromTocken == "Sector Admin") {
        if (filter) {
          filter = `${filter}  and user.userTypeId in (8,2,3, 5, 6,7,9,11)`;
        } else {
          filter = `user.userTypeId in (8,2,3,5,6,7,9,11)`;
        }
      }
      else if (roleFromTocken == "Technical Team") {
        if (filter) {
          filter = `${filter}  and user.userTypeId in (5,6,7,9,11)`;
        } else {
          filter = `user.userTypeId in (5,6,7,9,11)`;
        }
      }
      else if (roleFromTocken == "Data Collection Team") {
        if (filter) {
          filter = `${filter}  and user.userTypeId in (6,9,8)`;
        } else {
          filter = `user.userTypeId in (6,8,9)`;
        }
      }
      else if (roleFromTocken == "QC Team") {
        if (filter) {
          filter = `${filter}  and user.userTypeId in (7)`;
        } else {
          filter = `user.userTypeId in (7)`;
        }
      }
      else if (roleFromTocken == "Institution Admin") {
        if (filter) {
          filter = `${filter}  and user.userTypeId in (9,8)`;
        } else {
          filter = `user.userTypeId in (9,8)`;
        }
      }
      else if (roleFromTocken == "MRV Admin") {
        if (filter) {
          filter = `${filter}  and user.userTypeId in (11)`;
        } else {
          filter = `user.userTypeId in (11)`;
        }
      }
    }


    if (roleFromTocken == "Master Admin" || roleFromTocken == "Country Admin") {
      let data = this.repo
        .createQueryBuilder('user')
        .innerJoinAndMapOne('user.country', Country, 'con', 'con.id = user.countryId')
        .leftJoinAndMapOne('user.institution', Institution, 'ins', 'ins.id = user.institutionId')
        .leftJoinAndMapOne('user.userType', UserType, 'type', 'type.id = user.userTypeId')

        .where(filter, {
          filterText: `%${filterText}%`,
          userTypeId,
        }).orderBy('user.firstName', 'ASC');

      return await paginate(data, options);
    }
    else if (roleFromTocken != "Master Admin" && roleFromTocken != "Country Admin") {
      let data = this.repo
        .createQueryBuilder('user')
        .innerJoinAndMapOne('user.country', Country, 'con', 'con.id = user.countryId and user.countryId =' + countryIDFromTocken)
        .innerJoinAndMapOne('user.institution', Institution, 'ins', 'ins.id = user.institutionId and user.institutionId =' + institutionIDFromTocken)
        .leftJoinAndMapOne('user.userType', UserType, 'type', 'type.id = user.userTypeId',)

        .where(filter, {
          filterText: `%${filterText}%`,
          userTypeId,
          countryIDFromTocken,
          institutionIDFromTocken,
        }).orderBy('user.firstName', 'ASC');

      return await paginate(data, options);
    }

  }

  async findUserByUserType() {
    let data = await this.repo
      .createQueryBuilder('u')
      .select('*')
      .where(
        'u.userTypeId = 2'
      ).execute();
    return data;
  }

  async getUserDetailsByInstitution(
    options: IPaginationOptions,
    filterText: string,
    userTypeId: number,
    userName: string,
  ): Promise<Pagination<User>> {
    const user = await this.repo.findOne({ where: { username: userName } });
    let institutionId = user ? user.institution.id : 0;

    let filter: string = '';

    let data = this.repo
      .createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.institution',
        Institution,
        'ins',
        'ins.id = user.institutionId',
      )
      .leftJoinAndMapOne(
        'user.userType',
        UserType,
        'type',
        'type.id = user.userTypeId',
      )

      .where(' type.id=' + userTypeId + ' AND ins.id=' + institutionId)
      .orderBy('user.status', 'ASC');
    let SQLString = data.getSql();
    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }


}

