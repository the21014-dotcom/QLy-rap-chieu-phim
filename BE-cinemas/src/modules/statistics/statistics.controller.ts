import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { StatisticQueryDto } from './dto/statistic-query.dto';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  async getSummary() {
    return await this.statisticsService.getSummaryStats();
  }
  @Get('cinemas-breakdown')
async getCinemasBreakdown() {
  return await this.statisticsService.getCinemasBreakdown();
}
  @Get('revenue-weekly')
  async getWeeklyRevenue() {
    return await this.statisticsService.getWeeklyRevenue();
  }

  @Get('top-movies')
  async getTopMovies() {
    return await this.statisticsService.getTopMovies();
  }
  

  @Get('revenue-period')
  async getRevenueByPeriod(@Query() query: StatisticQueryDto) {
    return await this.statisticsService.getRevenueByPeriod(query.startDate, query.endDate);
  }
}