import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvestorTool } from "./investor-tool.entity";

@Entity()
export class TotalInvestment extends BaseTrackingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    instrument_name: string

    @Column()
    instrument_code: string

    @Column()
    propotion: number

    @ManyToOne((type) => InvestorTool, { cascade: false ,eager:true})
    @JoinColumn()
    investor_tool: InvestorTool;
}