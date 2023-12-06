import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { extname, join } from "path";
const path = require('path');
var fs = require('fs');

export class FileUpload {
    constructor(private configService: ConfigService) {
    }

    getStaticFolderName() {
        return this.configService.get<string>('staticFolederName');
    }

    getbaseUrl() {
        return this.configService.get<string>('baseUrl');
    }
}

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(8)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};

export const statticFileLocation = "static-files";

export const fileLocation = (req, file, callback) => {
    let dir = join(statticFileLocation, 'climate_actions');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        }, (e) => {
        });
    }
    callback(null, dir);
}