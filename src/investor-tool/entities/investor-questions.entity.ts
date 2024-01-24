
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";

@Entity()
export class InvestorQuestions extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @ManyToOne((type) => Characteristics, { cascade: false,eager:true })
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

    @Column({ nullable: true})
    isMain : boolean;

    @Column({  type:"mediumtext" , nullable: true })
    tooltip : string; 
    



}
