import { Module } from '@nestjs/common';
// import { ChatService } from './conversation.service';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
