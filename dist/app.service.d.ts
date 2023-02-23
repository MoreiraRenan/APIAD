import { ConfigService } from '@nestjs/config';
export declare class AppService {
    config: ConfigService;
    constructor(config: ConfigService);
    authenticateDN(): void;
    reset(matricula: string): Promise<any>;
}
