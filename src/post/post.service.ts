import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { LocalFileDto } from './dto/local-file.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import LocalFile from './entities/local-file.entity';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(LocalFile)
    private readonly localFilesRepository: Repository<LocalFile>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User) {
    const content = JSON.stringify(createPostDto.content);

    const tagsPromises = createPostDto.tags.map(async (name) => {
      const tag = await this.getTag(name);
      if (!tag) {
        return this.createTag(name);
      }
      return tag;
    });

    const tags = await Promise.all(tagsPromises);

    const post = this.postRepository.create({
      title: createPostDto.title,
      author,
      content,
      tags,
    });
    return this.postRepository.save(post);
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['tags'],
    });
    return posts.map((item) => ({
      ...item,
      content: JSON.parse(item.content),
    }));
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    return this.postRepository.remove(post);
  }

  getTag(name: string) {
    return this.tagRepository.findOneBy({ name });
  }

  createTag(name: string) {
    const tag = this.tagRepository.create({ name });
    return this.tagRepository.save(tag);
  }

  async uploadFile(fileData: LocalFileDto) {
    const newFile = await this.localFilesRepository.create(fileData);
    await this.localFilesRepository.save(newFile);
    return newFile;
  }
}
