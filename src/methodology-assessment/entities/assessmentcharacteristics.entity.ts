import { Assessment } from "src/assessment/entities/assessment.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Characteristics } from "./characteristics.entity";

@Entity()
export class AssessmentCharacteristics {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Characteristics, { cascade: false })
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

}

