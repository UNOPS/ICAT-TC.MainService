import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification>  {

    constructor(
        @InjectRepository(Notification) repo,
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
        return re;
    }

    async findByUSerId(id: number) {
        return this.repo.findOne({ where: { toUser: { id: id }} });
    }

    async updateNotification(note: Notification) {
        return this.repo.save(note);
    }
}
