import { Body, Controller, Get, Param, Put, Res } from '@nestjs/common';
import { Request, Post, UseGuards } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { AuthService } from './service/auth.service';
import { UsersService } from 'src/users/users.service';
import { ResetPassword } from './dto/reset.password.dto';
import { ForgotPasswordDto } from './dto/forgot.passowrd.dto';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

@Controller('auth')
export class AuthController {
  username: string;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
    private emailService: EmailNotificationService,

    private readonly auditService: AuditService,

  ) {}



  @Get('auth/validate-reset-password/:email/:token')
  async validateResetPassword(
    @Param('email') email: string,
    @Param('token') token: string,
  ): Promise<boolean> {

    return await this.usersService.validateResetPasswordRequest(email, token);
  }

  @Put('auth/reset-password')
  async resetPassword(@Body() resetPwd: ResetPassword): Promise<boolean> {

    if (
      await this.usersService.validateResetPasswordRequest(
        resetPwd.email,
        resetPwd.token,
      )
    ) {

      let res = await this.usersService.resetPassword(
        resetPwd.email,
        resetPwd.password,
      );

      return res;
    }
    return false;
  }

  @Post('auth/forgot-password')
  async forgotPassword(
    @Body() forgotparam: ForgotPasswordDto,
    @Res() response: any,
  ): Promise<any> {
    let user = await this.usersService.findUserByEmail(forgotparam.email);

    if (!user) {
      const errorResponse: any = {
        status: 0,
        message: 'Invalid Email/User Id',
      };
      return response.status(400).send(errorResponse);
    }

    let pwdRestToken = uuidv4();

    user = await this.usersService.updateChnagePasswordToken(
      user.id,
      pwdRestToken,
    );

    const resetPwdUrl = this.configService.get<string>('PWD_RESET_URL');


    return response.status(200).send(true);
  }
}
