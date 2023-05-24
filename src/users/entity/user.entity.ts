import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcript from 'bcrypt';
import { UserType } from './user.type.entity';
import { Exclude } from 'class-transformer';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { Country } from 'src/country/entity/country.entity';

@Entity()
export class User extends BaseTrackingEntity {
  constructor() {
    super();
    this.salt = 'n/a';
    this.status = 0;
    this.password = '';
    this.resetToken = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn("uuid")
  @Column()
  @Generated("uuid")
  uniqueIdentification:string;

  @ManyToOne((type) => UserType, { eager: true })
  @JoinColumn()
  userType: UserType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @ManyToOne((type) => Institution, { eager: false })
  @JoinColumn()
  institution: Institution;

  @Column()
  landline: string;

  @Column()
  mobile: string;

  @Column({nullable: true})
  admin: string; // added by

  // @Column({ nullable: true })
  // mrvInstitution: string;

  @ManyToOne((type) => Country, { cascade: false, eager:true })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @Exclude()
  @Column()
  salt: string;

  @Exclude()
  @Column({default: null, nullable: true })
  password: string;

  @Exclude()
  @Column({default: null, nullable: true })
  resetToken: string;

  @Column({nullable: true})
  loginProfile: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: 0 })
  canNotDelete?: boolean;

  fullName: string;

  // @OneToMany(() => Notification, (notification) => notification.t)
  // notifications: Notification[]

  updateFullName() {
    this.fullName = this.firstName + (this.lastName ? ' ' + this.lastName : '');
  }

  // abc: string = ()=>{  this.firstName + this.lastName};

  get fullname2() {
    return this.firstName;
  }

  private _fullname: string;
  get fullname(): string {
    this._fullname =
      this.firstName + (this.lastName ? ' ' + this.lastName : '');
    return this._fullname;
  }

  set fullname(value: string) {}

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcript.hash(password, this.salt);
    return hashPassword === this.password;
  }

  async validateResetToken(token: string): Promise<boolean> {
    return token === this.resetToken;
  }
}
