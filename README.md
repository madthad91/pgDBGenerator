# Postgres db generator with a module based architecture(node modules only atm)

Purpose: make an extendible postgres generator build with speed. This repo leverages node cluster to generate postgres tables generation code in parallel.

1) make your db definition by modifying the myDb.yaml file

2) npm install

3) npm start

As far as datatypes, we support every major postgres column type, all aliases too!, and shorthands(see below):

p (think primary key) = int8 not null

i = int8

v = varchar(255)

t = text

d (think date) = timestamp

## Modules

A module(plugin) by our definition is a standalone node application that can be executed before the program(preprocessor), after the program(postprocessor), or in the middle of the program(not yet supported). The stdout is read from the program and chucked into one of two places:

1) the result.sql file

2) a generated file by us if you want your output to not be merged in the result.sql file by any reason

**To enable separate file generation, have your standalone node app console.log or process.stdout.write the text |~separate~| before any other text and text separation will be enabled for that module.**

### Preprocessors:

Purpose: To prepend postgres commands to your result file, or run a module before the core program.

1) make a node program that can set itself up and run using only: npm install and npm start (see bottom for why npm run build is not supported )

2) put the whole program into the preprocessors folder

### Postprocessors:

Purpose: To append postgres commands to the end of your result file, or run a module after the core program.

1) make a node program that can set itself up and run using only: npm install and npm start (see bottom for why npm run build is not supported )

2) put the whole program into the postprocessors folder

## Why a build stage is not supported

Simply put, build is not a standard npm script command in npm. Although more popular npm frameworks use build(angular cli with ng build), every module that is developed can entail very unique functionality. For this reason, a build process cannot be assumed. If you want to added a build like step to your modules, let's say if you wanted to support a compiled language such as typescript, then add your build process to either postinstall or prestart. If these are unfamiliar, see documentation on [npm scripts](https://docs.npmjs.com/misc/scripts).