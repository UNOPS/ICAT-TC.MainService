import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification>  {

    constructor(
        @InjectRepository(Notification) repo,
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // @InjectRepository(User)
        // private readonly userService: UsersService,
        // @InjectRepository(Country)
        // private readonly countryRepository: Repository<Country>,
    ) {
        super(repo);
    }

    async saveNotification(note: Notification[]) {
        for (let re of note) {
            this.repo.save(re);
        }
    }

    async findById(id: number) {
        let re= await this.repo.createQueryBuilder('notification')
        .leftJoinAndMapOne(
            'notification.toUser',
            User,
            'user',
            'user.id = notification.toUser',
          )
        .where('notification.toUser=' + id)
        .getMany();
        // re.push( this.repo.find({ where: { toUser: { id: id }} }));
        return re
        // return this.repo.findOne({ where: { id: id } });
    }

    async findByUSerId(id: number) {
        return this.repo.findOne({ where: { toUser: { id: id }} });
    }

    async updateNotification(note: Notification) {
        return this.repo.save(note);
    }
}
