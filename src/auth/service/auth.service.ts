import { Injectable, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from 'src/audit/audit.service';
import { HttpService } from '@nestjs/axios';


const AUTH_URL = process.env.AUTH_URL
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
    
    const user = await this.usersService.findByUserName(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  
}
