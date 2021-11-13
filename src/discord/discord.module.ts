import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
