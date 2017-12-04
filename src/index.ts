import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as cluster from 'cluster';
import * as os from 'os';
import { Worker } from 'cluster';
import { Validator } from './validator';
import { EndOfFileCache } from './EndOfFileCache';
import { execute } from './Executor';
import * as path from 'path';
import PreprocessorRunner from './PreprocessorRunner';

if (cluster.isMaster) {
  try {
    var doc = yaml.safeLoad(fs.readFileSync('./myDb.yaml', 'utf8'));
    new PreprocessorRunner();
    
    const dbs = doc['dbs'];
    let dbNames:any = [];
    dbNames = dbNames.concat(Object.keys(dbs));
    if (!dbNames.length) {
      console.log('No databases in this definition. Add schemas and try again!');
      process.exit();
    }
    
    for (let i = 0; i < dbNames.length; i++) {
      fs.appendFileSync('./result.sql', `CREATE DATABASE ${dbNames[i]};\n\\connect ${dbNames[i]};\n\n`);

      const schemas = Object.keys(doc['dbs'][`${dbNames[i]}`]);
      if (!schemas.length) {
        console.log('No schemas in this definition. Add schemas and try again!');
        process.exit();
      }
      
      for (let j = 0; j < schemas.length; j++) {
        const schemaName = schemas[j];
        fs.appendFileSync('./result.sql', `CREATE SCHEMA IF NOT EXISTS ${schemaName};\n\n`);
        let tableSet = doc['dbs'][`${dbNames[i]}`][schemaName]; //the list of tables under a schema

        //no tables in schema warning
        if (!tableSet) {
          console.log(
            "No tables in this schema, continuing though. Hope you know what you're doing!"
          );
        } else {
          let tableNames = Object.keys(tableSet);
          tableNames.forEach(tableName => {
            EndOfFileCache.addSequence(schemaName, tableName);
            let w: Worker = cluster.fork({
              tableData: JSON.stringify(tableSet[tableName]),
              tableName: tableName,
              schemaName: schemaName,
            });
          });
        }
      }
    }
    cluster.disconnect(() => {
      fs.appendFile('./result.sql', EndOfFileCache.getCache(),
        ()=>{
          //postprocessors:
          fs.readdirSync(`${path.join(__dirname, '..', 'postprocessors')}`).forEach((file, idx) => {
            if (file.toLowerCase().startsWith('readme')) return;
            if (file == '.DS_Store') return;
            execute(
              `cd ${path.join(__dirname, '..', `postprocessors/${
                file
              }`)} && npm install > /dev/null && npm run --silent start`,
              (res: string) => {
                if (res)
                  if (res.startsWith('|~separate~|')) {
                    fs.appendFile(
                      `${path.join(__dirname, '..', `postprocessor_${file}_${idx + 1}`)}`,
                      res.split('|~separate~|')[1],'utf-8', ()=>null
                    );
                  } else if(res.startsWith('|~skip~|')) {
                    
                  } else {
                    fs.appendFileSync(`${path.join(__dirname, '..', 'result.sql')}`, res);
                  }
              }
            );
          });
          //end postprocessors:
        });
    });
  } catch (e) {
    console.log(e);
  }
} else {
  let hostSchemaName = process.env.schemaName || '';
  let hostTableName = process.env.tableName || '';
  let data = JSON.parse(process.env.tableData || '');
  let resString = `CREATE TABLE ${hostSchemaName}.${hostTableName} (\n`;

  //no columns in table warning
  if (!data) {
    console.log("No columns in this table, continuing though. Hope you know what you're doing!");
    process.exit();
  }

  //If it has columns, assume it has a primary key(deprecated). TODO: move to primary key check
  //might be better to generate a sequence for a table with no columns.
  //implementation for this will still remain in master of cluster implementation
  //deprecation reason: enforcing primary key shorthand is not a good practice.
  //moving sequence creation to on table create in the case users want to defined their own
  //datatype for primary keys. (forEach on tableSet in this master node cluster process aka up above )
  // e.addSequence(hostSchemaName, hostTableName);

  let columnSet = Object.keys(data);
  columnSet.forEach((cName, idx, arr) => {
    //validation token could be false, if the data type wasn't valid, or if true,
    //the validationToken will be the data type expressed as a string
    let validationToken = Validator.validateMyStuff(data[cName].dataType);
    if (validationToken) {

      resString += `\t${cName} ${validationToken}`;

      if (data[cName].hasOwnProperty('foreignKeyTo')) {
        // TODO: implement token checking for periods and exit gracefully on valiation
        let tokenizedFKTo = data[cName].foreignKeyTo.split('.');
        resString += ` REFERENCES ${tokenizedFKTo[0]}.${tokenizedFKTo[1]}`;
        // console.log('the foreign key set is at ', tokenizedFKTo)
        // EndOfFileCache.addFK(
        //   hostSchemaName,
        //   hostTableName,
        //   cName,
        //   tokenizedFKTo[0],
        //   tokenizedFKTo[1]
        // );
      }

      if(idx + 1 == arr.length)
        resString += `\n`;
      else
        resString += `,\n`;


      //processing for midprocessors
      fs.readdirSync(`${path.join(__dirname, '..', 'midprocessors')}`).forEach((file, idx) => {
        if (file.toLowerCase().startsWith('readme')) return;
        if (file == '.DS_Store') return;
        // console.log(`schemaName=${hostSchemaName};tableName=${hostTableName};data=${process.env.tableData ||
        //   ''};cd ${__dirname}/midprocessors/${
        //   file
        // } && npm install > /dev/null && npm run --silent start`)
        // console.log(file);
        execute(
          `schemaName=${hostSchemaName};tableName=${hostTableName};data=${process.env.tableData ||
            ''};cd ${path.join(__dirname, '..', 'midprocessors', file)} && npm install > /dev/null && npm run --silent start`,
          (res: string) => {
            console.log(res)
            // if (res.startsWith('|~separate~|')) {
              fs.appendFileSync(
                `${path.join(__dirname, '..', `midprocessor_${file}_${idx + 1}`)}`,
                res);
            // } else {
            //   fs.appendFileSync(`${__dirname}/result.sql`, res);
            // }
          }
        );
      });
      //end processing for midprocessors
    }
  });
  // process.kill(process.pid, 'SIGHUP');
  resString += ');\n\n';
  fs.appendFileSync('./result.sql', resString);
  process.exit();
}