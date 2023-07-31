import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

describe('CompraController (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: 'clientProcess', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({ Transport: Transport.TCP });

    await app.startAllMicroservices();
    await app.init();

    client = app.get('clientProcess');
    await client.connect();
  });

  afterAll(async () => {
    await app.close();
    await client.close();
  });

  describe('@compra_findAll', () => {
    it('should list all compra', async () => {
      const resultConsulta = await firstValueFrom(
        client.send('compra_findAll', { user: 'aaa', acao: 'ddd' }),
      );

      // Validate if the result is an array
      expect(resultConsulta).toBeInstanceOf(Array);

      // Validate if the array length is 5
      expect(resultConsulta.length).toBeGreaterThan(0);

      // Validate if all objects have the required attributes
      for (const obj of resultConsulta) {
        expect(obj).toHaveProperty('url');
        expect(obj).toHaveProperty('acao');
        expect(obj).toHaveProperty('desc');
      }
    });
  });
});
