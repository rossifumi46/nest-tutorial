import { Answer } from 'src/question/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Survey } from './survey.entity';

@Entity()
export class SurveyQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Survey)
  survey: Survey;

  @ManyToOne((type) => Question)
  question: Question;

  @Column()
  @Generated('increment')
  order: number;

  @JoinTable()
  @ManyToMany(() => Question)
  answers: Answer[];
}
