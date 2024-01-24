
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Barriers } from "./barriers.entity";

@Entity()
export class AssessmentBarriers {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Barriers, { cascade: false })
    @JoinColumn({ name: 'barriers_id' })
    barriers?: Barriers;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;
    
}


