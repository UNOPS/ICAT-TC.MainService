
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Indicators } from "./indicators.entity";

@Entity()
export class MethodologyIndicators {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;

    @ManyToOne((type) => Indicators, { cascade: false })
    @JoinColumn({ name: 'indicator_id' })
    indicator ?: Indicators;

    @Column({ nullable: true,unique:true })
    meth_code : string;
  
}
