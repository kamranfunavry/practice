import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from './database/connection';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [StudentsModule],
  controllers: [AppController],
  providers: [AppService, ...Connection],
  exports: [...Connection]
})
export class AppModule { }
