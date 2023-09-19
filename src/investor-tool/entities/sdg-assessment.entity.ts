
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { PortfolioSdg } from "./portfolio-sdg.entity";

@Entity()
export class SdgAssessment  {

   

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne((type) => Assessment, { cascade: false ,eager:true})
    assessment: Assessment;
    
    @ManyToOne((type) => PortfolioSdg, { cascade: false ,eager:true})
    sdg: PortfolioSdg;

    @Column({ nullable: true })
    answer: string;

   

}


