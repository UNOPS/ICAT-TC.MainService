
import { Assessment } from "src/assessment/entities/assessment.entity";
import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
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


