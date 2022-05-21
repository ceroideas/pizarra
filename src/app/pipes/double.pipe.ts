import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'double',
  pure: false
})
export class DoublePipe implements PipeTransform {

  transform(value: any, players_selected: any, id): any {
    if (id) {
      return value.filter(i => !players_selected.includes(i.id) || i.id == id);
    }else{
      return value.filter(i => !players_selected.includes(i.id));
    }
  }

}
