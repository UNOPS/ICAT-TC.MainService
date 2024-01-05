import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { TokenDetails, TokenReqestType } from "./token_details";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AuditDetailService {
    public auditlogURL = process.env.AUDIT_URL + '/audit/log'
    public UserTypes =  [
        {name: "Country Admin", code: UserTypesEnum.COUNTRY_ADMIN},
        {name: "Country User", code: UserTypesEnum.COUNTRY_USER},
        {name: "Master Admin", code: UserTypesEnum.MASTER_ADMIN},
        {name: "External", code: UserTypesEnum.EXTERNAL}
    ]

    constructor(
        private readonly usersService: UsersService,
        private tokenDetails: TokenDetails,
        private httpService: HttpService) {
    }

    async getAuditDetails() {
        let [userName] = this.tokenDetails.getDetails([TokenReqestType.username])
        let user = await this.usersService.findByUserName(userName)
        let userType: string

        let type = this.UserTypes.find(o => o.name === user.userType.name)
        if (type) {
            userType = type.code
        } else {
            userType = user.userType.name
        }

        return {
            userName: user.username,
            userType: userType,
            uuId: user.id,
            institutionId: user.institution.id,
            countryId: user.country.id
        }
    }

    log(body: any) {
        try {
            this.httpService.post(this.auditlogURL, body).subscribe(rr => { }, er => console.log("log failed 1"))
        } catch (err) {
            console.log("log failed ")
        }
    }
}

export enum UserTypesEnum {
    COUNTRY_ADMIN = "COUNTRY_ADMIN",
    COUNTRY_USER = "COUNTRY_USER",
    MASTER_ADMIN = "MASTER_ADMIN",
    EXTERNAL = "EXTERNAL"
}