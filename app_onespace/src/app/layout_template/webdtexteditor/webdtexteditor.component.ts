import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';

import { Editor, Toolbar } from 'ngx-editor';
@Component({
  selector: 'webd-texteditor',
  standalone: true,
  imports: [NgxEditorModule,ReactiveFormsModule],
  templateUrl: './webdtexteditor.component.html',
  styleUrl: './webdtexteditor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WebdtexteditorComponent implements OnInit, OnDestroy {

  editors = ['Classic', 'Divarea', 'Inline'];
  constructor() { }
  @Input() formGroupTextArea!: FormGroup;

  html = 'Hello world!';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];


  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
