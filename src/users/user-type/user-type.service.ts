import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserType } from 'src/users/entity/user.type.entity';

@Injectable()
export class UserTypeService extends TypeOrmCrudService<UserType> {
  constructor(@InjectRepository(UserType) repo) {
    super(repo);
  }

  async GetUserTypes(): Promise<UserType[]> {
    let data = await this.repo.find()
    if (data) {
      return data;
    }
  }
}
