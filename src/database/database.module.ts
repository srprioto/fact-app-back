import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({

    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => {
                return { 
                    type: 'mysql',
                    host: process.env.HOSTNAME, 
                    port: parseInt(process.env.PORT_DB), 
                    username: process.env.USER,
                    password: process.env.PASSWORD,
                    database: process.env.DATABASE,
                    synchronize: false, 
                    autoLoadEntities: true
                };
            }
        })
    ],
    providers: [],
    exports: [TypeOrmModule]

})
export class DatabaseModule {}




// imports: [
//     TypeOrmModule.forRootAsync({
//         // inject: [ config.KEY ],
//         useFactory: (/* configService:ConfigType<typeof config> */) => {

//             // const { user, host, dbName, password, port } = configService.postgres;

//             return { 
//                 type: 'mysql',
//                 host: 'localhost', 
//                 port: 3306, 
//                 username: 'root', 
//                 password: '', 
//                 database: 'facts_db',
//                 synchronize: false, // true solo en periodo de desarrollo
//                 autoLoadEntities: true
//             };
//         }
//     })
// ],
// providers: [],
// exports: [TypeOrmModule]