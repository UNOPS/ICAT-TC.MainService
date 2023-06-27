import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Methodology } from "./methodology.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;

    @Column({ nullable: true })
    code : string;

    @Column({ nullable: true })
    type : string;
    

/*     @ManyToOne(type => Methodology, methodology => methodology.categories)
    @JoinColumn({ name: 'methodology_id' })
    methodology: Methodology; */

    @ManyToOne((type) => Methodology, { cascade: false })
  @JoinColumn({ name: 'methodology_id' })
  methodology?: Methodology;

}

