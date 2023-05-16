import { Query } from "@nestjs/common";
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";

@Entity()
export class ImpactCovered extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    // @ManyToOne((type) => InvestorTool, { cascade: false })
    // @JoinColumn({ name: 'investorTool_id' })
    // investorTool?: InvestorTool;

    


}
