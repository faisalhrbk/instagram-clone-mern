import dataUriParser from 'datauri/parser.js'
import path from "path";
const parser = new dataUriParser();
const getDataUri = (file) => {
    const extName = path.extname(file.orignalname).toString();
    return parser.format(extName, file.buffer).content
}
export default getDataUri;