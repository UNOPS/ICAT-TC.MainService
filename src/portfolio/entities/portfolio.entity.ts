
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { User } from "src/users/entity/user.entity";

@Entity()
export class Portfolio {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    portfolioId : string; 

    @Column({ nullable: true })
    portfolioName : string; 

    @Column({  type:"mediumtext" ,nullable: true })
    description : string; 

    @Column({ nullable: true })
    person : string; 

    @Column({ nullable: true })
    IsPreviousAssessment : string; 

    @Column({  type:"mediumtext" , nullable: true })
    objectives : string; 

    @Column({  type:"mediumtext" , nullable: true })
    audience : string; 

    @Column({  type:"mediumtext" , nullable: true })
    opportunities : string; 

    @Column({ nullable: true })
    principles : string; 

    @ManyToOne((type) => User, { cascade: false, eager: true, })
    user?: User;  

}
