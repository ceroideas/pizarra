import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, query: any): any {
      if(!query)return value;
      return value.filter(function(item){
        return JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
      });
  }

}
