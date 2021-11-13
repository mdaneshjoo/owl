import {
  Injectable,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DiscordService } from './discord/discord.service';
import {
  EyeOptionsInterface,
  BaseServiceInterface,
  WebHookProviderEnum,
} from './interfaces';


@Injectable()
export class EyeService {
  [WebHookProviderEnum.discord];
  constructor(
    private options: Partial<EyeOptionsInterface>,
    discord: DiscordService,
  ) {
    this[WebHookProviderEnum.discord] = discord;
  }

  private get webhook() {
    const hook = <BaseServiceInterface>this[this.options.webHookProvider];
    if (!hook)
      throw new Error(
        `webhook provider (${this.options.webHookProvider}) not supported yet`,
      );
    return hook;
  }

  /**
   * @description this method sent error exeption to your webHook
   */
  watchErrors(
    exception: any,
    host: ArgumentsHost,
    withHttpExeptions: boolean = false,
  ): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && !withHttpExeptions) {
      this.webhook
        .post(this.options.url, {
          errorCode: status.toString(),
          message: exception.message,
          errType: 'INTERNAL',
          path: request?.url,
        })
        .subscribe();
      return;
    }
    const exceptionData = exception.getResponse();
    this.webhook
      .post(this.options.url, {
        errorCode: exceptionData.error
          ? exceptionData.error
          : exceptionData.message,
        message: exceptionData.message,
        errType: 'HTTP_EXCEPTION',
        path: request?.url,
      })
      .subscribe();
  }
}
