import { HttpStatus, Injectable } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Student } from 'src/entities/student.entity';
import { CreateStudentDto } from '../../dto/requestDto/create-student.dto';
import { UpdateStudentDto } from '../../dto/requestDto/update-student.dto';

@Injectable()
export class StudentsService {
  async create(createStudentDto: CreateStudentDto) {
    const result = await Student.create(
      {
        createStudentDto
      },
      { raw: true },
    );
    return new GenericResponseDto(
      HttpStatus.CREATED,
      'Created Successfully',
      result,
    );
  }

  findAll() {
    return `This action returns all students`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
