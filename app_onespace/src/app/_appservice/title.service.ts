import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class PageTitleService {
    public moduleTitle: string = ''
    public moduleSubTitle: string = ''
    constructor(private _title: Title) { }

    public setTitle(pageTitle: string, moduleTitle: string = '', moduleSubTitle: string = '') {
        this._title.setTitle(pageTitle + ' | Apna Society');
        this.moduleTitle = moduleTitle;
        this.moduleSubTitle = moduleSubTitle;
    }
}