import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbn'
})
export class IsbnPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value) {
      return (value as string).slice(0, 3) + '-' + (value as string).slice(3);
    } else {
      return undefined;
    }
  }
}
