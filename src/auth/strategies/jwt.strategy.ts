import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
// import passportJWT from "passport-jwt";

// const ExtractJwt = passportJWT.ExtractJwt;
// const Strategy = passportJWT.Strategy;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // console.log('JwtStrategy.validate in');

    return { user: payload, username: payload.usr };
  }
}
