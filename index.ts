import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as cluster from 'cluster';
import * as os from 'os';
import { Worker } from 'cluster';
import { Validator } from './validator';
import { EndOfFileCache } from './EndOfFileCache';
import { execute } from './Executor';

if(cluster.isMaster){
    try {
        var doc = yaml.safeLoad(fs.readFileSync('./myDb.yaml', 'utf8'));
        const schemas = Object.keys(doc['schema']);
        //preprocessors:
        fs.readdirSync(`${__dirname}/preprocessors`)
            .forEach((file, idx)=>{
                if(file == ".DS_Store") return;
                execute(`cd ${__dirname}/preprocessors/${file} && npm install > /dev/null && npm run --silent start`, (res:string)=>{
                    if(res.startsWith('|~separate~|'))
                    {
                        fs.appendFileSync(`${__dirname}/preprocessor_${file}_${idx+1}`, res.split('|~separate~|')[1]);
                    }
                    else{
                        fs.appendFileSync(`${__dirname}/result.sql`, res);
                    }
                })
            });
        //end preprocessors:

        if(!schemas.length){ console.log('No schemas in this definition. Add schemas and try again!'); process.exit();}
        for(let i =0; i<schemas.length; i++){
            const schemaName = schemas[i];
            fs.appendFileSync('./result.sql', `CREATE SCHEMA IF NOT EXISTS ${schemaName}\n\n`);
            let tableSet = doc['schema'][schemaName]; //the list of tables under a schema

            //no tables in schema warning
            if(!tableSet){ console.log('No tables in this schema, continuing though. Hope you know what you\'re doing!'); }
            else{
                let tableNames = Object.keys(tableSet);
                tableNames.forEach((tableName)=>{
                    EndOfFileCache.addSequence(schemaName, tableName);
                    let w:Worker = cluster.fork({'tableData': JSON.stringify(tableSet[tableName]),
                                                'tableName': tableName,
                                                'schemaName': schemaName});
                });
            }
        }
        cluster.disconnect(()=>{
            fs.appendFileSync('./result.sql', EndOfFileCache.getCache());
            //postprocessors:
                fs.readdirSync(`${__dirname}/postprocessors`)
                .forEach((file, idx)=>{
                    if(file == ".DS_Store") return;
                    execute(`cd ${__dirname}/postprocessors/${file} && npm install > /dev/null && npm run --silent start`, (res:string)=>{
                        if(res)
                            if(res.startsWith('|~separate~|'))
                            {
                                fs.appendFileSync(`${__dirname}/postprocessor_${file}_${idx+1}`, res.split('|~separate~|')[1]);
                            }
                            else{
                                fs.appendFileSync(`${__dirname}/result.sql`, res);
                            }
                    })
                });
            //end postprocessors:
        });
      } catch (e) {
        console.log(e);
      }
}
else{
    let hostSchemaName = process.env.schemaName || '';
    let hostTableName = process.env.tableName || '';
    let data = JSON.parse(process.env.tableData || '');
    let resString = `CREATE TABLE ${hostSchemaName}.${hostTableName} (\n`;

    //no columns in table warning
    if(!data){ console.log('No columns in this table, continuing though. Hope you know what you\'re doing!'); process.exit()}

    //If it has columns, assume it has a primary key(deprecated). TODO: move to primary key check
    //might be better to generate a sequence for a table with no columns.
    //implementation for this will still remain in master of cluster implementation
    //deprecation reason: enforcing primary key shorthand is not a good practice.
    //moving sequence creation to on table create in the case users want to defined their own
    //datatype for primary keys. (forEach on tableSet in this master node cluster process aka up above )
    // e.addSequence(hostSchemaName, hostTableName);

    let columnSet = Object.keys(data);
    columnSet.forEach((cName)=>{

        //validation token could be false, if the data type wasn't valid, or if true, 
        //the validationToken will be the data type expressed as a string
        let validationToken = Validator.validateMyStuff(data[cName].dataType);
        if(validationToken)
        {
            resString += `\t${cName} ${validationToken},\n`;
            
            if(data[cName].hasOwnProperty('foreignKeyTo')) {
                // TODO: implement token checking for periods and exit gracefully on valiation
                let tokenizedFKTo = data[cName].foreignKeyTo.split('.');
                EndOfFileCache.addFK(hostSchemaName, hostTableName, cName, tokenizedFKTo[0], tokenizedFKTo[1]);
            }
        }
    })
    // process.kill(process.pid, 'SIGHUP');
    resString += ');\n\n';
    fs.appendFileSync('./result.sql', resString);
    process.exit();
}
