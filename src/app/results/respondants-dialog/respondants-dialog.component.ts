import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Response } from 'src/app/shared/model/response.model';

@Component({
  selector: 'app-respondants-dialog',
  templateUrl: './respondants-dialog.component.html',
  styleUrls: ['./respondants-dialog.component.css']
})
export class RespondantsDialogComponent implements OnInit {

  responses: Response[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RespondantsDialogComponent>) {
    if (data) {
      this.responses = data.responses;
    }

  }

  ngOnInit() {
  }

}
