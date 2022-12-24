import { Customer } from '../../customer/entities/customer.entity';
import { Question } from '../../question/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  budget: number;

  @JoinColumn()
  @ManyToOne((type) => Customer)
  customer: Customer;

  @JoinColumn()
  @ManyToMany(() => Question)
  questions: Question[];

  @Column()
  title: string;

  @CreateDateColumn()
  createdDate: Date;
}
