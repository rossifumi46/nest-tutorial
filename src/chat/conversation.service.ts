import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { from, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    // @InjectRepository(ActiveConversationEntity)
    // private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  getConversation(creatorId: number, friendId: number) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :creatorId', { creatorId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();
  }

  createConversation(creator: User, friend: User) {
    const conversation = this.getConversation(creator.id, friend.id);
    const doesConversationExist = !!conversation;
    if (!doesConversationExist) {
      const newConversation = {
        users: [creator, friend],
      };
      return this.conversationRepository.save(newConversation);
    }
    return conversation;
  }

  getConversationsForUser(userId: number) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('conversation.lastUpdated', 'DESC')
      .getMany();
  }

  getUsersInConversation(conversationId: number) {
    this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .where('conversation.id = :conversationId', { conversationId })
      .getMany();
  }

  // getConversationsWithUsers(userId: number) {
  //   const conversations = await this.getConversationsForUser(userId);
  //   return this.getUsersInConversation(conversation.id);
  // }

  // joinConversation(
  //   friendId: number,
  //   userId: number,
  //   socketId: string,
  // ): Observable<ActiveConversation> {
  //   return this.getConversation(userId, friendId).pipe(
  //     switchMap((conversation: Conversation) => {
  //       if (!conversation) {
  //         console.warn(
  //           `No conversation exists for userId: ${userId} and friendId: ${friendId}`,
  //         );
  //         return of();
  //       }
  //       const conversationId = conversation.id;
  //       return from(this.activeConversationRepository.findOne({ userId })).pipe(
  //         switchMap((activeConversation: ActiveConversation) => {
  //           if (activeConversation) {
  //             return from(
  //               this.activeConversationRepository.delete({ userId }),
  //             ).pipe(
  //               switchMap(() => {
  //                 return from(
  //                   this.activeConversationRepository.save({
  //                     socketId,
  //                     userId,
  //                     conversationId,
  //                   }),
  //                 );
  //               }),
  //             );
  //           } else {
  //             return from(
  //               this.activeConversationRepository.save({
  //                 socketId,
  //                 userId,
  //                 conversationId,
  //               }),
  //             );
  //           }
  //         }),
  //       );
  //     }),
  //   );
  // }

  // leaveConversation(socketId: string): Observable<DeleteResult> {
  //   return from(this.activeConversationRepository.delete({ socketId }));
  // }

  // getActiveUsers(conversationId: number): Observable<ActiveConversation[]> {
  //   return from(
  //     this.activeConversationRepository.find({
  //       where: [{ conversationId }],
  //     }),
  //   );
  // }

  // createMessage(message: Message): Observable<Message> {
  //   return from(this.messageRepository.save(message));
  // }

  // getMessages(conversationId: number): Observable<Message[]> {
  //   return from(
  //     this.messageRepository
  //       .createQueryBuilder('message')
  //       .innerJoinAndSelect('message.user', 'user')
  //       .where('message.conversation.id =:conversationId', { conversationId })
  //       .orderBy('message.createdAt', 'ASC')
  //       .getMany(),
  //   );
  // }

  // // Note: Would remove below in production - helper methods
  // removeActiveConversations() {
  //   return from(
  //     this.activeConversationRepository.createQueryBuilder().delete().execute(),
  //   );
  // }

  // removeMessages() {
  //   return from(this.messageRepository.createQueryBuilder().delete().execute());
  // }

  // removeConversations() {
  //   return from(
  //     this.conversationRepository.createQueryBuilder().delete().execute(),
  //   );
  // }
}
