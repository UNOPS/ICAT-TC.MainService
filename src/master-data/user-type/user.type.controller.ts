import { Controller } from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';
import { UserType } from 'src/users/entity/user.type.entity';
import { UserTypeService } from './user.type.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Crud({
  model: {
    type: UserType,
  },
})
@Controller('usertype')
export class UserTypeController implements CrudController<UserType> {
  constructor(
    public service: UserTypeService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  get base(): CrudController<UserType> {
    return this;
  }

}
