
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Objectives } from "./objectives.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";


@Entity()
export class AssessmentObjectives {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Objectives, { cascade: false })
    @JoinColumn({ name: 'objective_id' })
    objectives?: Objectives;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;
}

