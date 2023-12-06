import { DocumentOwner } from './entity/document-owner.entity';
import { editFileName, fileLocation } from './entity/file-upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { Crud, CrudController, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { Documents } from './entity/document.entity';
import { Controller, Post, UploadedFile, UseInterceptors, Body, Param, Req, Get, StreamableFile, Res, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { createReadStream } from 'fs';
import { DocOwnerUpdateDto } from './entity/doc-owner-update.dto';
var multer = require('multer')
const restrictedFileExtentions = ["exe", "dll", "com", "bat", "sql","php","js.","ts"];
const allowedFileExtentions = ["xls","xlsx","doc","docx","ppt","pptx","txt","pdf","png","jpeg","gif","jpg","avi","mp3","mp4"];

@Crud({
    model: {
        type: Documents,
    }
})

@Controller('document')
export class DocumentController implements CrudController<Documents> {
    constructor(public service: DocumentService) {
    }

    @Post('upload')
    uploadFile(@Body() file: Documents) {
    }

    @Post('upload2/:oid/:owner')
    @UseInterceptors(FileInterceptor("file", {
        storage: multer.diskStorage({
            destination: fileLocation,
            filename: editFileName,
        })

    }))
    async uploadFile2(@UploadedFile() file, @Req() req: CrudRequest, @Param("oid") oid, @Param("owner") owner) {

        let fileExtentionTemp = ("" + file.originalname).split(".");
        let fileExtention = fileExtentionTemp[fileExtentionTemp.length - 1].toLowerCase();

        if (restrictedFileExtentions.includes(fileExtention)) {
            throw new HttpException('Forbidden, Unauthorized file type.', HttpStatus.FORBIDDEN);
        }

        if(!allowedFileExtentions.includes(fileExtention)){
            throw new HttpException('Forbidden, Unauthorized file type..', HttpStatus.FORBIDDEN);
        }

        let fileNameLower = (""+file.originalname).toLowerCase();

        for (let index = 0; index < restrictedFileExtentions.length; index++) {
            const element = restrictedFileExtentions[index];
            let extentiontemp = "."+ element+  ".";
            if(fileNameLower.includes(extentiontemp)){
                throw new HttpException('Forbidden, Unauthorized file type.', HttpStatus.FORBIDDEN);
            }
        }

        var docowner: DocumentOwner = (<any>DocumentOwner)[owner];
        let path = join(owner, oid, file.filename)
        let doc = new Documents();
        doc.documentOwnerId = oid;
        doc.documentOwner = docowner;
        doc.fileName = file.originalname;
        doc.mimeType = file.mimetype;
        doc.relativePath = path;



        var newdoc = this.service.saveDocument(doc);
    }

    @Post('upload3/:oid')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile3(@UploadedFile() file, @Param("oid") oid) {
    }

    @Post('delete/:docId')
    async deleteDoc(@Param("docId") docId: number) {
        return await this.service.deleteDocument(docId);
    }

    @Get('getDocument/:oid/:owner')
    async getDocuments(@Param("oid") oid: number, @Param("owner") owner: DocumentOwner) {
        var docowner: DocumentOwner = (<any>DocumentOwner)[owner];
        return await this.service.getDocuments(oid, docowner);
    }

    @Get('downloadDocument/:state/:did')
    async downloadDocuments(@Res({ passthrough: true }) res,  @Param("did") did: number,@Param("state") state: string ) :Promise<StreamableFile>  {
      let doc:Documents =await this.service.getDocument(did);



      res.set({
        'Content-Type': `${doc.mimeType}`,
        'Content-Disposition': `${state}; filename=${doc.fileName}`
      });

        const file = createReadStream(`./static-files/${doc.relativePath}`);
        
          return new StreamableFile(file);
    }
   
    @Post('updateDocOwner')
    async updateDocOwner(@Body() req: DocOwnerUpdateDto) {
    return await this.service.updateDocOwner(req);
  }
  




}
