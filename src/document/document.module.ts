import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Documents } from './entity/document.entity';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Documents])],
  providers: [DocumentService,StorageService],
  controllers: [DocumentController],
  exports: [DocumentService,StorageService],
})
export class DocumentModule {}
