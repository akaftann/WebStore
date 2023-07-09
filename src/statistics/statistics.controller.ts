import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get()
  async mainStat(@CurrentUser('id') id: number){
    return await this.statisticsService.main(id)

  }
}
