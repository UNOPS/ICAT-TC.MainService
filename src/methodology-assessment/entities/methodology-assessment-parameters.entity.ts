
import { Assessment } from "src/assessment/entities/assessment.entity";
import { Institution } from "src/institution/entity/institution.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./category.entity";
import { Characteristics } from "./characteristics.entity";
import { Methodology } from "./methodology.entity";
import { ParameterStatus } from "./parameterStatus.entity";
import { ParameterRequest } from "src/data-request/entity/data-request.entity";
import { Indicators } from "./indicators.entity";


@Entity()
export class MethodologyAssessmentParameters {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Assessment, { cascade: false })
    @JoinColumn({ name: 'assessment_id' })
    assessment?: Assessment;

    @ManyToOne((type) => Methodology, { cascade: false })
    @JoinColumn({ name: 'methodology_id' })
    methodology?: Methodology;

    @ManyToOne((type) => Category, { cascade: false })
    @JoinColumn({ name: 'category_id' })
    category?: Category;


    @ManyToOne((type) => Characteristics, { cascade: false})
    @JoinColumn({ name: 'characteristics_id' })
    characteristics?: Characteristics;

    @Column({ nullable: true })
    score: string;

    @Column({ nullable: true })
    relevance: string;

    @ManyToOne((type) => Institution, { cascade: false, eager:false})
    @JoinColumn({ name: 'institution_id' })
    institution?: Institution;

    @ManyToOne((type) => ParameterStatus, { cascade: false })
    @JoinColumn({ name: 'status_id' })
    status?: ParameterStatus;

    @ManyToOne((type) => Indicators, { cascade: false })
    @JoinColumn({ name: 'indicator_id' })
    indicator?: Indicators;

    @Column({type: "double", nullable: true })
    indicatorValue: number;

    @Column({ nullable: true })
    isCategory: number;

    @Column({ nullable: true })
    enterDataAssumption: string;

    @Column({ nullable: true })
    uomDataEntry?: string;

    @Column({ nullable: true })
    uomDataRequest?: string;

    @Column({ nullable: true })
    fileName?: string;
    

    @Column({ type:"mediumtext" ,nullable: true })
    scoreOrInstitutionJusti?: string;

     @Column({ nullable: true, default: false })
    isAcceptedByVerifier: boolean;
    parameterRequest?: ParameterRequest; 

    @Column({ type: 'double', nullable: true })
    weight : number

    @Column({ type:"mediumtext" ,nullable: true })
    chaDescription?: string;

    @Column({ type:"mediumtext" ,nullable: true })
    chaRelJustification?: string;

   
    
}
