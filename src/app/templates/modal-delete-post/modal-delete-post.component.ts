import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'modal-delete-post',
  standalone: true,
  templateUrl: './modal-delete-post.component.html',
  styleUrls: ['./modal-delete-post.component.sass'],
  imports: [CommonModule],
})
export class ModalDeletePostComponent {
  @Input() isVisible: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  confirmDelete() {
    this.confirm.emit();
  }

  cancelDelete() {
    this.cancel.emit();
  }
}
