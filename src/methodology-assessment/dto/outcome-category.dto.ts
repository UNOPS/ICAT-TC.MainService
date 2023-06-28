import { CMResultDto } from "src/carbon-market/dto/cm-result.dto"
import { Characteristics } from "../entities/characteristics.entity"

export class OutcomeCategory{
    name: string
    code: string
    type: string
    method: string
    results: CMResultDto[]
}