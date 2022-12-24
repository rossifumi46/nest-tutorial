import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    nullable: true,
  })
  description: string;

  @JoinColumn()
  @ManyToOne((type) => Category)
  category: Category;

  @JoinColumn()
  @OneToMany((type) => Answer, (answer) => answer, { cascade: true })
  answers: Answer[];

  @Column()
  @Generated('increment')
  position: number;
}
