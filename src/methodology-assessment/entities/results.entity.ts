
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Category } from "./category.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";
import { Characteristics } from "./characteristics.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";

@Entity()
export class Results {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @Column({type: 'double', nullable: true })
    averageProcess : number;

    @Column({type: 'double', nullable: true })
    averageOutcome : number;  
    
    @Column({ nullable: true, default: false })
    isAcceptedByVerifier: boolean;
    
  
}