import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import LocalFile from './entities/local-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, LocalFile])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
