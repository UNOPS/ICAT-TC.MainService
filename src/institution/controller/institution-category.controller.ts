import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InstitutionCategoryService } from '../service/institution-category.service';
import { InstitutionCategory } from '../entity/institution.category.entity';


@Crud({
    model: {
        type: InstitutionCategory,
    },
})
@Controller('institution-category')
export class InstitutionCategoryController implements CrudController<InstitutionCategory>{
        constructor(public service: InstitutionCategoryService){}
    }
