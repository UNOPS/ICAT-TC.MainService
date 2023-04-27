import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { MasterData } from "src/shared/entities/master.data.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity({ name: 'notification' })

export class Notification extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: false })
    massege : string;

    @Column({ nullable: false })
    sendAt : string;

    @Column({ nullable: false })
    viewAt : string;

    @Column({ nullable: false,default:false })
    is_viewed : boolean; 
     
    @Column({ nullable: false,default:false })
    is_reminder : boolean;  
    
    @ManyToOne((type) => User, { eager: true })
    @JoinColumn()
    fromUser: User;

    @ManyToOne((type) => User, { eager: true })
    @JoinColumn()
    toUser: User;


}
