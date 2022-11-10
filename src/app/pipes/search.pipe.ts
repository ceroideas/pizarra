import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, query: any, field = null, equipo = null): any {
      console.log(equipo);
      if(!query && !equipo)return value;

      if (!query) {
        query = "";
      }

      if (equipo) {
        value = value.filter(x=>x.team.name == equipo);
      }

      console.log(value);

      if (!field) {
        return value.filter(function(item){
          return JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
        });
      }
      return value.filter(x=>x[field].toLowerCase().includes(query.toLowerCase()));
  }

}
