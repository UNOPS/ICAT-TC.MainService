import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";
import { Institution } from "src/institution/entity/institution.entity";
import { InvestorAssessment } from "./investor-assessment.entity";
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
