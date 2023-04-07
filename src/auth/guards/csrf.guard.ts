import { CanActivate, ExecutionContext, Injectable, Type } from "@nestjs/common";
import { Reflector } from "@nestjs/core/services";


export function CSRFGuard(): Type<CanActivate>{

    class CSRFGuardIn implements CanActivate {
      constructor() {
        
      }
    
      canActivate(context: ExecutionContext): boolean {
        console.log("csrf")
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // console.log(request.user.user['csrfTocken'])
        const headerFieldValue = request.headers;
        // console.log(headerFieldValue);
        return headerFieldValue['csrftocken']===request.user.user['csrfTocken'];
      }
    }
  
  return CSRFGuardIn
  
  }
  
  export default CSRFGuard;