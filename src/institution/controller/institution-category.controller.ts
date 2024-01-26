import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InstitutionCategoryService } from '../service/institution-category.service';
import { InstitutionCategory } from '../entity/institution.category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Crud({
    model: {
        type: InstitutionCategory,
    },
})
@Controller('institution-category')
export class InstitutionCategoryController implements CrudController<InstitutionCategory>{
        constructor(public service: InstitutionCategoryService){}


        @UseGuards(JwtAuthGuard)
        @Get('getInstitutionCategory')
        async getInstitutionType(
        ): Promise<any> {
            return await this.service.getInstitution(
            );
        }
    }
