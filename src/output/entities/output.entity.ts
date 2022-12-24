import { Category } from '../../category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Output {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @JoinColumn()
  @ManyToOne((type) => Category)
  category: Category;
}
