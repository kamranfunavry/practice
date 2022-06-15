import { HttpStatus, Injectable } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Class } from 'src/entities/class.entity';
import { CreateClassDto } from '../../dto/requestDto/create-class.dto';
import { UpdateClassDto } from '../../dto/requestDto/update-class.dto';

@Injectable()
export class ClassService {
  async create(createClassDto: CreateClassDto) {
    const result = await Class.create({ ...createClassDto })
    return new GenericResponseDto(
      HttpStatus.CREATED,
      'Created Successfully',
      result,
    );
  }

  findAll() {
    return `This action returns all class`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
