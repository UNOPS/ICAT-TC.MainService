import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ActionArea } from './entity/action-area.entity';
import { ActionAreaService } from './action-area.service';


@Crud({
    model: {
      type: ActionArea,
    },
    query: {
      join: {
          ndc: {
            eager: true,
          },
      },
    },
  })
@Controller('ActionArea')
export class ActionAreaController implements CrudController<ActionArea> {
    constructor(public service: ActionAreaService) {}

    get base(): CrudController<ActionArea> {
        return this;
      }
}
