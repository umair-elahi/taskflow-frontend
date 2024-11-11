import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any {
    if (!items || !filter.filtrationKeys || !filter.filtrationKeys.length || !filter.filtrationValues || !filter.filtrationValues.length) {
      return items;
    }
    const tempItems: any = [];

    _.forEach(items, (item: any) => {
      let isAddItem = true;
      filter.filtrationKeys.forEach((selectedKey: any, ind: number) => {
        if (filter.filtrationValues[ind] !== 'all' && filter.filtrationValues[ind] !== null && filter.filtrationValues[ind] !== undefined) {
          if (item[selectedKey].toLowerCase().indexOf(filter.filtrationValues[ind].toLowerCase()) === -1) {
            isAddItem = false;
          }
        }
      });
      if (isAddItem) {
        tempItems.push(item);
      }
    });

    return tempItems;
  }
}
