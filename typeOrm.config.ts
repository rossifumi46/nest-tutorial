import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Survey } from './src/survey/entities/survey.entity';
import { test1667066920762 } from './src/migrations/1667066920762-test';
import { Learning } from './src/learning/entities/learning.entity';
import { Category } from './src/category/entities/category.entity';
import { Answer } from './src/question/entities/answer.entity';
import { Output } from './src/output/entities/output.entity';
import { Question } from './src/question/entities/question.entity';
import { $npmConfigName1667073644093 } from './src/migrations/1667073644093-$npm_config_name';
import { Customer } from './src/customer/entities/customer.entity';
import { $npmConfigName1670660449203 } from './src/migrations/1670660449203-$npm_config_name';
import { User } from './src/user/entities/user.entity';
import { $npmConfigName1670674166562 } from './src/migrations/1670674166562-$npm_config_name';
import { $npmConfigName1670684115108 } from './src/migrations/1670684115108-$npm_config_name';
import { $npmConfigName1670692965870 } from './src/migrations/1670692965870-$npm_config_name';
import { Post } from './src/post/entities/post.entity';
import { Tag } from './src/post/entities/tag.entity';
import { $npmConfigName1671368032906 } from './src/migrations/1671368032906-$npm_config_name';

config();

// const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 8001,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: [
    User,
    Survey,
    Learning,
    Category,
    Answer,
    Output,
    Question,
    Customer,
    Post,
    Tag,
  ],
  migrations: [
    test1667066920762,
    $npmConfigName1667073644093,
    $npmConfigName1670660449203,
    $npmConfigName1670674166562,
    $npmConfigName1670684115108,
    $npmConfigName1670692965870,
    $npmConfigName1671368032906,
  ],
});

// module.exports = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 8001,
//   username: 'postgres',
//   password: 'pass123',
//   database: 'postgres',
//   entities: ['dist/**/*.entity.js'],
//   // migrations: ['dist/migrations/*.js'],
//   // cli: {
//   //   migrationsDir: 'src/migrations',
//   // },
// };
