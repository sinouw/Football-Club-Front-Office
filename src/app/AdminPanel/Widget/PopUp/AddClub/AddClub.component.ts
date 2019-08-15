import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-club',
  templateUrl: './AddClub.component.html',
  styleUrls: ['./AddClub.component.scss']
})
export class AddClubComponent implements OnInit {
  addClubForm: FormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddClubComponent>
    ) { }

  ngOnInit() {
    this.addClubForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      Phone: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      OpeningTime: [''],
      ClosingTime: [''],
      IsActive: ['', [Validators.required]],
    })
  }

  // onFormSubmit method is submit a add new user form.
  onFormSubmit() {
    this.dialogRef.close(this.addClubForm.value);
  }
}
