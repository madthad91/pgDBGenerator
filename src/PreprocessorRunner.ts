import * as fs from 'fs';
import * as path from 'path';
import { execute } from './Executor';
import { IProcessRunner, EProcessorType} from './interfaces/IProcessRunner';

export default class PreprocessorRunner implements IProcessRunner{
  fileNames:any[] = [];
  activeFileName:string;
  activeFileIdx:number;

  constructor(){
    this.runPlugins = this.runPlugins.bind(this, EProcessorType.preprocess);
    this.runPlugins();
  }

  runPlugins(type: EProcessorType = EProcessorType.preprocess) {
    this.fileNames = fs.readdirSync(`${path.join(__dirname, '..', type)}`);
    this.fileNames.forEach(this.executePlugin);
  }

  executePlugin = (file:string, idx:number)=>{
    console.log(file, idx, this);
    this.activeFileName = file;
    this.activeFileIdx = idx;
    if (file.toLowerCase().startsWith('readme')) return;
    if (file == '.DS_Store') return;
    execute(
      `cd ${path.join(__dirname, '..', 'preprocessors', file)} && npm install > /dev/null && npm run --silent start`,
      this.postExecutionStdoutHandler);
  }

  postExecutionStdoutHandler(res: string) {
    if (res.startsWith('|~separate~|')) {
      fs.appendFile(
        `${path.join(__dirname, '..', `preprocessor_${this.activeFileName}_${this.activeFileIdx + 1}`)}`,
        res.split('|~separate~|')[1],'utf-8', ()=>null
      );
    } else if(res.startsWith('|~skip~|')) {

    } else {
      fs.appendFileSync(`${path.join(__dirname, '..', 'result.sql')}`, res);
    }
  }


      //preprocessors:
      
      //end preprocessors:
}