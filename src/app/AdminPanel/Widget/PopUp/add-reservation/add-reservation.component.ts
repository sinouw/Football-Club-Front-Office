import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { HttpClient } from '@angular/common/http';
import { ToastaService } from 'ngx-toasta';
import { baseurl } from 'src/app/AdminPanel/Models/basurl.data';
import { ReservationService } from 'src/app/AdminPanel/Service/reservation.service';
@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {
  // reservationId : string
  addReservationForm: FormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  clubsname : any 
  clubs:any;
  terrains:any[]=[]
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddReservationComponent>,
    private router: Router,
    private clubService: AdminGenericService,
    private http: HttpClient,
    private toastyService: ToastaService,
    private reservationservice : ReservationService
    ) { }

  ngOnInit() {
    this.addReservationForm = this.formBuilder.group({
      IdClub: ['', [Validators.required]],
      IdTerrrain: ['', [Validators.required]],
      resDay: ['', [Validators.required]],
      StartRes: ['', [Validators.required]],
      EndRes: ['', [Validators.required]],
      status: ['', [Validators.required]],
    })

    this.list()
      .subscribe(result => {
        this.clubs = result;
        console.log(this.clubs);

      });

    }
 

    getTerrains(){
      this.listTerrain()
      .subscribe(res=>{
        this.terrains = res
        this.terrains=this.terrains.filter(t=>t.IdClub==this.addReservationForm.value.IdClub)
        console.log(res);
      }
      ,err=>console.log(err))
    }
 

  // onFormSubmit method is submit a add new user form.
  onFormSubmit() {
    this.dialogRef.close(this.addReservationForm.value);
  }

  list(): any {
    return this.clubService.get(baseurl + '/clubs');
  }

  listTerrain(): any {
    return this.clubService.get(baseurl + '/Terrains');
  }
}
