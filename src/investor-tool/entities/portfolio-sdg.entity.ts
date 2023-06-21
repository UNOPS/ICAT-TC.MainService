
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Column, Entity,  JoinColumn,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PortfolioSdg  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    number: number;

    @Column({ nullable: true })
    name: string;
   
}

