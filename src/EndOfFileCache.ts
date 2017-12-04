import * as fs from 'fs';
import { execute } from './Executor';
import * as path from 'path';

//writing to file because each cluster instance would have its own cache
//even if everything was static, each process would have it's own static cache
export class EndOfFileCache {
  constructor() {}

  static addSequence(schema: string, tableName: string) {
    let sequenceText = `create sequence ${schema}.${tableName}_ID_SEQ;\n`;
    fs.appendFileSync(`${path.join(__dirname, 'endOfFileCache.txt')}`, sequenceText);
  }

  // static addFK(
  //   hostSchema: string,
  //   hostTable: string,
  //   hostColName: string,
  //   targetSchema: string,
  //   targetTable: string
  // ) {
  //   let sample = `alter table ${hostSchema}.${hostTable} ADD foreign key (${
  //     hostColName
  //   }) references ${targetSchema}.${targetTable};\n`;
  //   fs.appendFileSync(`${path.join(__dirname, 'endOfFileCache.txt')}`, sample);
  // }

  static getCache() {
    const sequenceText = fs.readFileSync(`${path.join(__dirname, 'endOfFileCache.txt')}`).toString();

    //empty tmp file(cache)
    execute(`rm ${path.join(__dirname, 'endOfFileCache.txt')}`, () => null);
    return sequenceText;
  }
}
