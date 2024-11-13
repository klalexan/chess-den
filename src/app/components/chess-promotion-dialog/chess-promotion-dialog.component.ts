import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-chess-promotion-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './chess-promotion-dialog.component.html',
  styleUrl: './chess-promotion-dialog.component.scss'
})
export class ChessPromotionDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ChessPromotionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {color: string}) { }

  close(piece: string): void {
    this.dialogRef.close(piece);
  }

  getSvgPath(piece: string): string {
    return `../../../assets/images/pieces/merida/${this.data.color}${piece}.svg`;
  }


}


