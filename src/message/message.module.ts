import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

const kafkaModule = ClientsModule.registerAsync([
  {
    name: 'KAFKA_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `${configService.get<string>('APP_NAME').toLowerCase().replace(/ /gi, '-')}-service`,
          brokers: [`${configService.get<string>('KAFKA_HOST')}:${configService.get<string>('KAFKA_PORT')}`],
          logLevel: 4,
        },
        producerOnlyMode: true
      }
    })
  }
]);

@Module({
  imports: [kafkaModule],
  controllers: [],
  providers: [],
  exports: [kafkaModule]
})
export class MessageModule { }
