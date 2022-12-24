import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import { Conversation } from './conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(
    () => Conversation,
    (conversationEntity) => conversationEntity.messages,
  )
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
