import { Injectable, CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


export enum LoginRole {
  MASTER_ADMIN = "Master_Admin", //icat admin
  COUNTRY_ADMIN = "Country Admin",
  VERIFIER = "Verifier",
  SECTOR_ADMIN = "Sector Admin",
  MRV_ADMIN = "MRV Admin",
  TECNICAL_TEAM = "Technical Team",
  DATA_ENTRY_OPERATOR = "Data Entry Operator",
  QC_TEAM = "QC Team",
  INSTITUTION_ADMIN = "Institution Admin",
  DATA_COLLECTION_TEAM = "Data Collection Team",
  EXTERNAL_USER = "External User",
}

export function RoleGuard(roles?: LoginRole[]): Type<CanActivate>{

  class RolesGuardIn implements CanActivate {
    constructor() {
      
    }
  
    canActivate(context: ExecutionContext): boolean {
   
     
  
     
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      console.log(request.user)
      const user = request.user;
      if (!user) {
          return false;
        }
     
      // return user.user.roles.includes(role);
      console.log("++++++++++++++",user.user.role.code)
      return user.user.role.code
      return  user.user.role.some(r=> roles.includes(r)) ;
    }
  }

return RolesGuardIn

}

export default RoleGuard;

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
 
   
//     const roles = this.reflector.get<string[]>('roles', context.getHandler());
   
//     if (!roles) {
//       return true;
//     }
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     if (!user) {
//         return true;
//       }
   
//     return roles.some((role) => user.user.roles.includes(role));
//   }
// }