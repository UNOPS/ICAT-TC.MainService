import { Body, Controller, Get, Param, Put, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from './decorators/public.decorator';
import { strictThrottle } from 'src/config/throttle.config';
import { UsersService } from 'src/users/users.service';
import { ResetPassword } from './dto/reset.password.dto';
import { ForgotPasswordDto } from './dto/forgot.passowrd.dto';
const { v4: uuidv4 } = require('uuid');

@Controller('auth')
export class AuthController {
  username: string;
  constructor(
    private usersService: UsersService,
  ) {}



  @Public()
  @Get('auth/validate-reset-password/:email/:token')
  async validateResetPassword(
    @Param('email') email: string,
    @Param('token') token: string,
  ): Promise<boolean> {

    return await this.usersService.validateResetPasswordRequest(email, token);
  }

  @Public()
  @Throttle(strictThrottle)
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

  @Public()
  @Throttle(strictThrottle)
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


    return response.status(200).send(true);
  }
}
