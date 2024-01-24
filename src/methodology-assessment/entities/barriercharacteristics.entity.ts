import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Characteristics } from "./characteristics.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Barriers } from "./barriers.entity";
import { Institution } from "src/institution/entity/institution.entity";

@Entity()
export class BarriersCharacteristics {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Characteristics, { cascade: false})
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

    @ManyToOne((type) => Barriers, { cascade: false })
    @JoinColumn({ name: 'barriers_id' })
    barriers?: Barriers;

    @Column({ type: 'double',  nullable: true })
    barrier_score : number;

    @Column({ nullable: true })
    bscore_comment : string;

    @Column({ type: 'double', nullable: true })
    barrier_weight : number;

    @Column({ nullable: true })
    bweight_comment : string;


    @ManyToOne((type) => Institution, { cascade: false, eager:false})
    @JoinColumn({ name: 'institution_id' })
    institution?: Institution;

    @Column({ nullable: true })
    barrier_target : string;
}


