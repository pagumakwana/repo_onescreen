import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
// import {  parseInt, padNumbe } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && dateParts[0]) {
                return { day: parseInt(dateParts[0]), month: null, year: null };
            } else if (dateParts.length === 2 && dateParts[0] && dateParts[1]) {
                return { day: parseInt(dateParts[0]), month: parseInt(dateParts[1]), year: null };
            } else if (dateParts.length === 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
                return { day: parseInt(dateParts[0]), month: parseInt(dateParts[1]), year: parseInt(dateParts[2]) };
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