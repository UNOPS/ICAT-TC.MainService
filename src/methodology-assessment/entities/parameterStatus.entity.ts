import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ParameterStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;
    
}