import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-move-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './move-history.component.html',
  styleUrl: './move-history.component.scss'
})
export class MoveHistoryComponent {

  @Input() moveHistory: { white: string, black: string }[] = [];



}
