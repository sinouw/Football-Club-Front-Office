import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { baseurl } from 'src/app/AdminPanel/Models/basurl.data';
import { AccountService } from 'src/app/AdminPanel/Service/account.service';

@Component({
  selector: 'app-add-new-terrain',
  templateUrl: './AddNewTerrain.component.html',
  styleUrls: ['./AddNewTerrain.component.scss']
})
export class AddNewTerrainComponent implements OnInit {
  addTerrainForm: FormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  namePattern: any = /^[A-Za-z0-9_]*$/;
  floatPattern: any = /^-?(0|[1-9]\d*)?.-?(0|[1-9]\d*)?$/;

  clubs: any;

  constructor(
    private formBuilder: FormBuilder,
    private clubService: AdminGenericService,
    private account: AccountService,
    public dialogRef: MatDialogRef<AddNewTerrainComponent>
    ) { }

  ngOnInit() {
    this.addTerrainForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      Type: ['', [Validators.required]],
      Free: ['', [Validators.required]],
      Price: ['', [Validators.required, Validators.pattern(this.floatPattern)]],
      IdClub: ['', [Validators.required]],
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
    if(this.account.getPayload().role == "SuperAdmin") {
      return this.clubService.get(baseurl + '/clubs');
    } else {
      return this.clubService.get(baseurl + '/clubs/GetClubsByClubAdmin/' + this.account.getPayload().UserID);
    }
  }


}
