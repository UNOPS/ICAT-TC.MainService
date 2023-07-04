import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class TokenDetails{
constructor(
     @Inject(REQUEST) private request){}

   
      getDetails(reqDetails:TokenReqestType[]):any[]{
        let details:any[]=[];
        let user:any = this.request.user.user;
        // console.log("user",reqDetails) 
        // console.log("user1",user) 
        for(let det of reqDetails){
         switch(det){
         case 1:
             details.push(user.countryId);
             console.log("1")
             break;
         case 2:
            details.push(user.insId?user.insId:0)
            console.log("2")
             break;
         case 3:
            details.push(user.sectorId?user.sectorId:0)
            console.log("3")
             break;
         case 4:
             details.push(user.role.name)
             console.log("4")
             break;  
         case 5:
             details.push(user.username)
             console.log("5")
             break;  
         case 6:
             details.push(user.moduleLevels)
             console.log("6")
             break;  
         default:


         }
        }
        return details
      }


}


export enum TokenReqestType{

    countryId=1,
    sectorId=2,
    InstitutionId=3,
    role=4,
    username=5,
    moduleLevels=6



}