
import { Column, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class BarriersCategory {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    category : string;
}

