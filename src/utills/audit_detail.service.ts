import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { TokenDetails, TokenReqestType } from "./token_details";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AuditDetailService {
    public auditlogURL = process.env.AUDIT_URL + '/audit/log'

    constructor(
        private readonly usersService: UsersService,
        private tokenDetails: TokenDetails,
        private httpService: HttpService) {
    }

    async getAuditDetails() {
        let [userName] = this.tokenDetails.getDetails([TokenReqestType.username])
        let user = await this.usersService.findByUserName(userName)

        return {
            userName: user.username,
            userType: user.userType.name,
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