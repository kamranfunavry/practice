import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from './database/connection';
import { StudentsSubject } from './entities/students-has-subjects.entity';
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { ClassModule } from './modules/class/class.module';

@Module({
  imports: [StudentsModule, SubjectsModule, StudentsSubject, ClassModule],
  controllers: [AppController],
  providers: [AppService, ...Connection],
  exports: [...Connection]
})
export class AppModule { }
