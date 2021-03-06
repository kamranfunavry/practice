import { Sequelize } from "sequelize-typescript";

import 'dotenv/config'
import { Student } from "src/entities/student.entity";
import { Subject } from "src/entities/subject.entity";
import { StudentsSubject } from "src/entities/students-has-subjects.entity";
import { Class } from "src/entities/class.entity";

export const Connection = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: process.env.DATABASE_TYPE as 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        logging: true,
        models: [Student, Subject, StudentsSubject, Class],
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
      // await sequelize.sync({
      //   force: true,
      //   alter: true
      // });
      return sequelize;
    },
  },
]

