import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-chess-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, MatSelectModule],
  templateUrl: './chess-settings.component.html',
  styleUrl: './chess-settings.component.scss'
})
export class ChessSettingsComponent {

  @Output() botLevel = new EventEmitter<number>();
  @Output() isBotPlaysAsWhite = new EventEmitter<boolean>();
  @Output() blindfoldMode = new EventEmitter<boolean>(false);

  botLevels () {
    var values = [];
    const numLevels = 20;
    const minElo = 1100;
    const maxElo = 3100;
    for (var i = 0; i <= numLevels; i++) {
      const elo =
        Math.floor((minElo + (maxElo - minElo) * (i / numLevels)) / 100) * 100;
      values.push({ value: i, label: elo });
    }
    return values;
  };

}
