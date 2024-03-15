import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CMDefaultValue  extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "double"})
    starting_situation_value: number;

    @Column({type: "double"})
    expected_impact_value: number;

    @Column({nullable: true})
    source: string;

    @Column({nullable: true})
    unit: string;

    @Column({nullable: true})
    code: string;

    @ManyToOne((type) => Characteristics, { eager: true })
    @JoinColumn()
    characteristic: Characteristics
}