import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SdgAssessment } from "./sdg-assessment.entity";
import { ApiHideProperty } from "@nestjs/swagger";

@Entity()
export class PortfolioSdg  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    number: number;

    @Column({ nullable: true })
    name: string;

    @ApiHideProperty()
    sdg_assessment:SdgAssessment;
   
}

