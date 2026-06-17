import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [SeatsModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
  