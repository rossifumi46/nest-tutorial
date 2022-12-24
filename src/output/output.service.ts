import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { Repository } from 'typeorm';
import { CreateOutputDto } from './dto/create-output.dto';
import { UpdateOutputDto } from './dto/update-output.dto';
import { Output } from './entities/output.entity';

@Injectable()
export class OutputService {
  constructor(
    @InjectRepository(Output)
    private readonly outputRepository: Repository<Output>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createOutputDto: CreateOutputDto) {
    const { title, categoryId } = createOutputDto;
    const category = await this.categoryService.findOne(categoryId);

    const output = this.outputRepository.create({
      title,
      category,
    });
    return this.outputRepository.save(output);
  }

  async findAll(filterQuery: FilterQueryDto) {
    const { limit, offset, category: categoryId } = filterQuery;
    let category: Category;
    if (categoryId) {
      category = await this.categoryService.findOne(categoryId);
    }
    return this.outputRepository.find({
      where: {
        category,
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const output = await this.outputRepository.findOne({
      where: { id },
    });
    if (!output) {
      throw new NotFoundException(`Output #${id} not found`);
    }
    return output;
  }

  update(id: number, updateOutputDto: UpdateOutputDto) {
    return `This action updates a #${id} output`;
  }

  remove(id: number) {
    return `This action removes a #${id} output`;
  }

  findByCategory(category: Category) {
    return this.outputRepository.find({
      where: {
        category,
      },
    });
  }
}
