import { Sector } from "src/master-data/sector/entity/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClimateAction } from "./climate-action.entity";

@Entity()
export class PolicySector extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

 

    @ManyToOne((type) => ClimateAction, { cascade: false })
    @JoinColumn({ name: 'intervention_id' })
    intervention?: ClimateAction;

    @ManyToOne((type) => Sector, { cascade: false })
    @JoinColumn({ name: 'sector_id' })
    sector?: Sector;

   


}
