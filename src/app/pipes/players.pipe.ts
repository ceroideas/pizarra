import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'players'
})
export class PlayersPipe implements PipeTransform {

  transform(player: any, report:any, p): any {

    if (report) {
      let pl = report.players.find(x=>x.player_id == player.id);

      if (!pl) {
        return false;
      }

      if (pl.punctuation == p) {
        return true;
      }

      return false;
    }
  }

}
