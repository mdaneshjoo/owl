import { DiscordService } from './discord/discord.service';
import { EYE_OPTIONS } from './constants';
import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { EyeService } from './Eye.service';
import { EyeOptionsInterface } from './interfaces';

const eyeServiceFactory = (
  option: Partial<EyeOptionsInterface>,
): Provider<any> => {
  return {
    provide: EyeService,
    useFactory: (discord: DiscordService) => {
      return new EyeService(option, discord);
    },
    inject: [DiscordService],
  };
};

@Module({})
export class EyeModule {
  static forRoot(option: EyeOptionsInterface): DynamicModule {
    const providers: Provider<any>[] = [eyeServiceFactory(option)];

    return {
      providers: providers,
      exports: providers,
      module: EyeModule,
      imports: [DiscordModule, HttpModule],
    };
  }
}
