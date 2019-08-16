import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { baseurl } from 'src/app/AdminPanel/Models/basurl.data';

@Component({
  selector: 'app-add-new-terrain',
  templateUrl: './AddNewTerrain.component.html',
  styleUrls: ['./AddNewTerrain.component.scss']
})
export class AddNewTerrainComponent implements OnInit {
  addTerrainForm: FormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

  clubs: any;

  constructor(
    private formBuilder: FormBuilder,
    private clubService: AdminGenericService,
    public dialogRef: MatDialogRef<AddNewTerrainComponent>
    ) { }

  ngOnInit() {
    this.addTerrainForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      Free: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      Club: ['', [Validators.required]],
    })

    this.list().subscribe(result => {
      console.log(result);
      this.clubs = result;
    });
  }

  // onFormSubmit method is submit a add new user form.
  onFormSubmit() {
    this.dialogRef.close(this.addTerrainForm.value);
  }

  list(): any {
    return this.clubService.get(baseurl + '/clubs');
  }


}
