import {Component, Input} from '@angular/core';
import {FieldState, MaybeFieldTree} from '@angular/forms/signals';

@Component({
  selector: 'app-form-errors',
  imports: [],
  templateUrl: './form-errors.html',
  styleUrl: './form-errors.css',
})
export class FormErrors {
    @Input({ required: true }) ref!: MaybeFieldTree<any, string>;

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }
}
