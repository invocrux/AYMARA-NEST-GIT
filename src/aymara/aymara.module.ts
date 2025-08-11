import { Module } from '@nestjs/common';
import { AymaraController } from './aymara.controller';
import { AymaraService } from './aymara.service';

@Module({
  controllers: [AymaraController],
  providers: [AymaraService],
})
export class AymaraModule {}