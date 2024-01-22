import { extname, join } from "path";
var fs = require('fs');

export class FileUpload {
    constructor(
        ) {
    }


    getbaseUrl() {
        return process.env.ClientURl;
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