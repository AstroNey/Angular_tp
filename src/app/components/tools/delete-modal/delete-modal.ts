import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css',
})
export class DeleteModal {

    @Input({ required: true }) itemType!: string;
    @Input({ required: true }) itemId!: number;
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
