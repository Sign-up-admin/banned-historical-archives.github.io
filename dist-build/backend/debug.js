"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { AppDataSource } from './data-source';
// import lac from './lac';
// import { LACResult } from '../types';
const utils_1 = require("../utils");
(async () => {
    /*
   for(const book of books) {
    if (book.parser_option?.ocr?.extract_text_from_pdf) {
      const p =join(__dirname, `./ocr_cache/${book.entity.id}`)
      if (fs.existsSync(p))
      fs.rmSync(p, {recursive: true, force: true})
    }
   }
   for(const j of images) {
    const i = j as any;
    fs.writeFileSync(join(__dirname, '../config/archives7/' + i.id + '.ts'), `export default {
    "resource_type": "picture",
    "entity": ${JSON.stringify(i)},
    "version": 2
  }`)
   }
   */
    for (const i of ['几天', '，1', '，3'])
        console.log((0, utils_1.md5)(i), (0, utils_1.crypto_md5)(i));
    debugger;
})();
