import { PolicyBarriers } from "src/climate-action/entity/policy-barriers.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BarriersCategory } from "./barrierscategory.entity";

@Entity()

export class Barriers {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    barrier : string;

    @ManyToOne((type) => BarriersCategory, { cascade: false,eager:true })
    @JoinColumn({ name: 'barriersCategory_id' })
    barriersCategory?: BarriersCategory;

    @OneToMany(() => PolicyBarriers, policyBarriers => policyBarriers.climateAction,)
    @JoinColumn()
    policyBarriers: PolicyBarriers[];
}


