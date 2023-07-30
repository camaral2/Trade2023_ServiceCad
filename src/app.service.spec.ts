import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Version App', () => {
    it('Should version Ok', async () => {
      expect(service.getVersion()).toMatchObject({
        app: 'trade2023_servicecad',
        author: 'Cristian dos Santos Amaral',
        email: 'cristian_amaral@hotmail.com',
        version: '1.2.4',
      });
    });
  });
});
