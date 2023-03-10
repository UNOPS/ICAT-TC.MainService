import { Injectable, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from 'src/audit/audit.service';
import { HttpService } from '@nestjs/axios';


const AUTH_URL = process.env.AUTH_URL || 'http://localhost:7090'
@Injectable()
export class  AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    private  httpService: HttpService,

  ) {}

  async getLoginProfile(id: string): Promise<any>{
    const url = `${AUTH_URL}/login-profile/by-id?id=${id}`
    return this.httpService.get(url).toPromise();
  }
  async addLoginProfile(email: string, password: string, role: string): Promise<any>{
    const url = `${AUTH_URL}/login-profile/`
    return await this.httpService.post(url, {
      userName: email, 
      password: password,
      roles: [role]
    }).toPromise();
  }
  
  async getRolese(): Promise<any>{
    const url = `${AUTH_URL}/role`
    return this.httpService.get(url).toPromise();
  }

  async validateUser(username: string, pass: string): Promise<any> {
    console.log("AuthService.validateUser ===============");
    
    const user = await this.usersService.findByUserName(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  // async login(authCredentialDto: AuthCredentialDto): Promise<any> {
  //   console.log("AuthService.login");
  //   const {username, password} = authCredentialDto;
 
    

  //   if(await this.usersService.validateUser(username, password)){
  //     const selectedUser= await  this.usersService.findByUserName(username);
      
      
  //     const payload = {usr: (await selectedUser).username, 
  //       fname: (selectedUser).firstName, 
  //       lname: (selectedUser).lastName, 
  //       countryId:selectedUser.country.id,
  //       ...([UserTypeNames.PMUAdmin].includes(selectedUser.userType.id) || [UserTypeNames.PMUUser].includes(selectedUser.userType.id)) &&{ institutionId:selectedUser.institution.id},
  //       roles : [(selectedUser).userType.name]};
      
      
  //    // console.log("jwt payload ", payload);

  //     const expiresIn = '240h';  
  //     let token = this.jwtService.sign(payload, { expiresIn });
  //     console.log("token", token);
  //     return {access_token: token};
  //   }
  //   else{

  //     // let audit: AuditDto = new AuditDto();
  //     // audit.action =  authCredentialDto.username +" Logging Faild";
  //     // audit.comment = "Logging Faild";
  //     // audit.actionStatus = 'Failed';
  //     // this.auditService.create(audit);
  //     // console.log("audit.......",audit);
  //     return null;
  //   }
  
}
