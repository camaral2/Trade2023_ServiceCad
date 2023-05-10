import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined - AppController', () => {
    expect(AppController).toBeDefined();
  });

  it('should return "Version"', () => {
    expect(appController.getVersion()).toMatchObject({
      app: 'trade2023_servicecad',
      author: 'Cristian dos Santos Amaral',
      email: 'cristian_amaral@hotmail.com',
      version: process.env.npm_package_version,
    });
  });
});
