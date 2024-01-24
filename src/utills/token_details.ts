import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class TokenDetails {
    constructor(
        @Inject(REQUEST) private request
    ) { }


    getDetails(reqDetails: TokenReqestType[]): any[] {
        let details: any[] = [];
        let user: any = this.request.user.user;
        for (let det of reqDetails) {
            switch (det) {
                case TokenReqestType.countryId:
                    details.push(user.countryId);
                    break;
                case TokenReqestType.sectorId:
                    details.push(user.sectorId ? user.sectorId : 0)
                    break;
                case TokenReqestType.InstitutionId:
                    details.push(user.insId ? user.insId : 0)
                    break;
                case TokenReqestType.role:
                    details.push(user.role.name)
                    break;
                case TokenReqestType.username:
                    details.push(user.username)
                    break;
                case TokenReqestType.moduleLevels:
                    details.push(user.moduleLevels)
                    break;
                default:
            }
        }
        return details
    }
}


export enum TokenReqestType {
    countryId = 1,
    sectorId = 2,
    InstitutionId = 3,
    role = 4,
    username = 5,
    moduleLevels = 6
}