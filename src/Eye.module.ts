import { DiscordService } from './discord/discord.service';
import { EYE_OPTIONS } from './constants';
import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { EyeService } from './Eye.service';
import {
  EyeOptionsAsyncInterface,
  EyeOptionsInterface,
  OwlOptionsFactory,
} from './interfaces';

@Module({})
export class EyeModule {
  static forRoot(option: EyeOptionsInterface): DynamicModule {
    return {
      providers: [this.OwlServiceFactory(option)],
      module: EyeModule,
      imports: [DiscordModule, HttpModule],
      exports: [this.OwlServiceFactory(option)],
    };
  }

  static forRootAsync(options: EyeOptionsAsyncInterface): DynamicModule {
    return {
      global: true,
      module: EyeModule,
      imports: options.imports || [],
      providers: [EyeService, this.createAsyncOptionsProvider(options)],
      exports: [EyeService, this.createAsyncOptionsProvider(options)],
    };
  }

  private static OwlServiceFactory(
    option: Partial<EyeOptionsInterface>,
  ): Provider<any> {
    return {
      provide: EyeService,
      useFactory: (discord: DiscordService) => {
        return new EyeService(option, discord);
      },
      inject: [DiscordService],
    };
  }

  private static createAsyncOptionsProvider(
    options: EyeOptionsAsyncInterface,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: EYE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: EYE_OPTIONS,
      useFactory: async (optionsFactory: OwlOptionsFactory) =>
        await optionsFactory.createOwlOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
