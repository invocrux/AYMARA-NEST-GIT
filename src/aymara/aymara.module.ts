import { Module } from '@nestjs/common';
import { AymaraController } from './aymara.controller';
import { AymaraService } from './aymara.service';
import { ContextService } from './services/context.service';

@Module({
  controllers: [AymaraController],
  providers: [AymaraService, ContextService],
})
export class AymaraModule {}