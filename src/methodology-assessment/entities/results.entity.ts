
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assessment } from "src/assessment/entities/assessment.entity";

@Entity()
export class Results {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne((type) => Assessment, { cascade: false , nullable: true, eager: true,})
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @Column({type: 'double', nullable: true })
    averageProcess : number;

    @Column({type: 'double', nullable: true })
    averageOutcome : number;  
    
    @Column({ nullable: true, default: false })
    isAcceptedByVerifier: boolean;
    
  
}