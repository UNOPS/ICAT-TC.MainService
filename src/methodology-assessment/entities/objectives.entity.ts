
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Objectives {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;
}

