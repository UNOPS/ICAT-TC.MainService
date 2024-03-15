import { CanActivate, ExecutionContext, Type } from "@nestjs/common";

export function CSRFGuard(): Type<CanActivate>{

    class CSRFGuardIn implements CanActivate {
      constructor() {
        
      }
    
      canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const headerFieldValue = request.headers;
        return headerFieldValue['csrftocken']===request.user.user['csrfTocken'];
      }
    }
  
  return CSRFGuardIn
  
  }
  
  export default CSRFGuard;