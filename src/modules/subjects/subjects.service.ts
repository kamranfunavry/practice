import { HttpStatus, Injectable } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Subject } from 'src/entities/subject.entity';
import { CreateSubjectDto } from '../../dto/requestDto/create-subject.dto';
import { UpdateSubjectDto } from '../../dto/requestDto/update-subject.dto';

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto) {
    const result = await Subject.create({ ...createSubjectDto })
    return new GenericResponseDto(
      HttpStatus.CREATED,
      'Created Successfully',
      result,
    );
  }

  findAll() {
    return `This action returns all subjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
