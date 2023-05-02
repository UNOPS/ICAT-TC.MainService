
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";


@Entity()
export class Objectives {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    name : string;
}

