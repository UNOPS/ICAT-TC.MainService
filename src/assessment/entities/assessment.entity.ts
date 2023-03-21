
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity'
import { Methodology } from "src/methodology-assessment/entities/methodology.entity";
@Entity()
export class Assessment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    year: string;

    @ManyToOne((type) => ClimateAction, { cascade: false })
    @JoinColumn({ name: 'climateAction_id' })
    climateAction?: ClimateAction;

    @ManyToOne((type) => Methodology, { cascade: false })
    @JoinColumn({ name: 'methodology_id' })
    methodology?: Methodology;

    @Column({ nullable: true })
    assessmentType: string; // assessmentType :- Ex-Post, Ex-Ante

}
