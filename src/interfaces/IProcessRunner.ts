export interface IProcessRunner{
  fileNames:any;
  activeFileName:string;
  activeFileIdx:number;

  runPlugins(type: EProcessorType):void;
  executePlugin(file:string, idx:number):void;
  postExecutionStdoutHandler(res: string):void;
}

export enum EProcessorType{
  preprocess = 'preprocessors',
  midprocess = 'midprocessors',
  postprocess = 'postprocessors'
}