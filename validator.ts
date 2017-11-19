export class Validator {
  static validateMyStuff(dataType: string) {
    switch (dataType) {
      case 'p':
        return 'int8 PRIMARY KEY';
      case 'i':
        return 'int8';
      case 'v':
        return 'varchar(255)';
      case 't':
        return 'text';
      case 'd':
        return 'timestamp';
      default:
        let search = [
          'bigint',
          'bigserial',
          'bit',
          'bit',
          'boolean',
          'box',
          'bytea',
          'character',
          'character',
          'cidr',
          'circle',
          'date',
          'double',
          'inet',
          'integer',
          'interval',
          'json',
          'jsonb',
          'line',
          'lseg',
          'macaddr',
          'money',
          'numeric',
          'path',
          'pg_lsn',
          'point',
          'polygon',
          'real',
          'smallint',
          'smallserial',
          'serial',
          'text',
          'time',
          'time',
          'timestamp',
          'timestamp',
          'tsquery',
          'tsvector',
          'txid_snapshot',
          'uuid',
          'xml',
          'int8',
          'serial8',
          'varbit',
          'bool',
          'char',
          'varchar',
          'float8',
          'int',
          'int4',
          'decimal',
          'float4',
          'int2',
          'serial2',
          'serial4',
          'timetz',
          'timestamptz',
        ].find(data => {
          return dataType.startsWith(data);
        });

        if (search) return dataType;
        else return false;
    }
  }
}
