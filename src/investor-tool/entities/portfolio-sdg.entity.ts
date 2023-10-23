
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Column, Entity,  JoinColumn,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
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

    /* @Column({ nullable: true })
    answer: string; */

    @ApiHideProperty()
    sdg_assessment:SdgAssessment;
   
}

