import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(matricula: string): Promise<any>;
    getT(): Promise<string>;
}
