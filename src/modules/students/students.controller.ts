import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from '../../dto/requestDto/create-student.dto';
import { UpdateStudentDto } from '../../dto/requestDto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Post("create")
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get("getAll")
  findAll() {
    return this.studentsService.findAll();
  }

  @Post("getAramex")
  getAramex() {
    return this.studentsService.getCountries();
  }

  @Get('getUserById/:id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
