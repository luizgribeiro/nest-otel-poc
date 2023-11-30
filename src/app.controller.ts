import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { firstValueFrom, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosError } from 'axios';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.hello();
  }

  @Get('/manual')
  getManual(): string {
    return this.appService.manual();
  }

  @Get('/error')
  throwError(): void {
    this.appService.throwError();
  }

  @Get('/markerror')
  markError(): string {
    return this.appService.markError();
  }

  @Get('/outbound')
  async getOutBound(): Promise<AxiosResponse<any>> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>('http://localhost:3000/manual').pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
