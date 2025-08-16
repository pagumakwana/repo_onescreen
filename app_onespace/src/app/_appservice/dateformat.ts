import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
// import {  parseInt, padNumbe } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable({ providedIn: 'root' })
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct | null {
        if (value) {
          const dateParts = value.trim().split('/').map(part => parseInt(part, 10));
          if (dateParts.length === 1 && !isNaN(dateParts[0])) {
            return { day: dateParts[0], month: 1, year: new Date().getFullYear() }; // Default values
          } else if (dateParts.length === 2 && !isNaN(dateParts[0]) && !isNaN(dateParts[1])) {
            return { day: dateParts[0], month: dateParts[1], year: new Date().getFullYear() }; // Default year
          } else if (dateParts.length === 3 && !isNaN(dateParts[0]) && !isNaN(dateParts[1]) && !isNaN(dateParts[2])) {
            return { day: dateParts[0], month: dateParts[1], year: dateParts[2] };
          }
        }
        return null;
      }
      
    format(date: NgbDateStruct): string {
        return date ?
            `${date.day ? this.padNumber(date.day, 2) : ''}-${date.month ? this.padNumber(date.month, 2) : ''}-${date.year}` :
            '';
    }

    padNumber(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
}