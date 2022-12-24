import { Category } from '../../category/entities/category.entity';
import { Output } from '../../output/entities/output.entity';
import { Answer } from '../../question/entities/answer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['input', 'output'])
export class Learning {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne((type) => Category)
  category: Category;

  @JoinColumn()
  @ManyToOne((type) => Answer)
  input: Answer;

  @JoinColumn()
  @ManyToOne((type) => Output)
  output: Output;

  @Column()
  score: number;
}
