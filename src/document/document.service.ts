import { ConfigService } from '@nestjs/config';
import { AppModule } from './../app.module';
import { statticFileLocation } from './entity/file-upload.utils';
import { promises } from 'fs';
import { DocumentOwner } from './entity/document-owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
  Module,
} from '@nestjs/common';
import { Documents } from './entity/document.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { DocOwnerUpdateDto } from './entity/doc-owner-update.dto';
var fs = require('fs');
var path = require('path');

@Injectable()
export class DocumentService extends TypeOrmCrudService<Documents> {
  
  constructor(
    @InjectRepository(Documents) repo,
    private configService: ConfigService,
  ) {
    super(repo);
  }

  saveDocument(doc: Documents) {
    return this.repo.save(doc).catch((error) => {
      console.log(error);
    });
  }

  deleteDocument(docId: number) {
    let doc = this.getDocument(docId).then((val) => {
      return this.repo
        .delete(val)
        .then((res) => {
          this.deleteFile(val.relativePath);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  deleteFile(filepath: string) {
    let rootPath = path.resolve('./');
    let fullfilePath = join(rootPath, statticFileLocation, filepath);
    console.log(fullfilePath);
    if (fs.existsSync(fullfilePath)) {
      fs.unlinkSync(fullfilePath);
    }
  }

  getDocument(id: number): Promise<Documents> {
    return this.repo.findOne({ where: { id: id } });
  }

  async getDocuments(oid: number, owner: DocumentOwner): Promise<Documents[]> {
    let documenst = await this.repo.find({
      where: { documentOwnerId: oid, documentOwner: owner },
    });
    //console.log("hiiiii.............",documenst);
    const base = this.configService.get<string>('baseUrl');
    documenst.forEach((a) => {
      // a.url = `${base}${a.relativePath}`;
      a.url = `${base}document/downloadDocument/attachment/${a.id}`;
      console.log("pathdoc---",a.url)
    });

    return documenst;

  }

 async  updateDocOwner(req: DocOwnerUpdateDto):Promise<any> {
  // console.log("document ids:",req)
  let projectid=req.projectID
    for (let num of req.ids) {
      console.log("num",num)
      let update = await this.repo.createQueryBuilder()
      .update(Documents)
      .set({documentOwnerId:projectid})
      .where("id = :id", { id: num })
      .execute()
      console.log("updated",num)
    }
  }
}
