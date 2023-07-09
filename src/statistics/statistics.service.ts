import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserService as Uservice } from 'src/db-services/user-service';

@Injectable()
export class StatisticsService {
    constructor(private userService: UserService, private uService: Uservice){}

     async main(userId: number){
        
       const res = await this.uService.getStatistics(userId)
        
        return [{
            name: "Orders",
            value: Number(res[0]['ordercount'])
        },
        {
            name: "Reviews",
            value: Number(res[0]['reviewcount'])
        },
        {
            name: "Favorites",
            value: Number(res[0]['favoritescnt'])
        },
        {
            name: "Total price",
            value: Number(res[0]['totalorderprice'])
        }
    ]
    } 
}
