import { ConnectionOptions, DataSourceOptions } from 'typeorm';


export const config: ConnectionOptions = {
  // name: 'Real',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
    username: 'sqluser',
     password: 'password',
     database: 'tc-main-new3',

  /* username: 'root',
 password: 'pradeep123#',
 database: 'tc-main', */  
  // password: 'dil19971121',
  // database: 'climate_action',


  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

