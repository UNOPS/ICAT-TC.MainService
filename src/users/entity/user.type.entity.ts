import { LearningMaterialUserType } from 'src/learning-material/entity/learning-material-usertype.entity';
import { MasterData } from 'src/shared/entities/master.data.entity';
import { Column, Entity,OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserType extends MasterData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null })
    name: string;
    
    @OneToMany(() => LearningMaterialUserType, learningMaterialUserType => learningMaterialUserType.userType)
    public learningMaterialusertype!: LearningMaterialUserType[];

 
}
