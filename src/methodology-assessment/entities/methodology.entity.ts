
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Methodology {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    methodology_name : string;

 
}
