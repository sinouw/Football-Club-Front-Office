import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { HttpClient } from '@angular/common/http';
import { ToastaService } from 'ngx-toasta';
import { baseurl } from 'src/app/AdminPanel/Models/basurl.data';
import { ReservationService } from 'src/app/AdminPanel/Service/reservation.service';
import { AccountService } from 'src/app/AdminPanel/Service/account.service';
import { EmbryoService } from 'src/app/Services/Embryo.service';

@Component({
  selector: 'app-add-reservation-client',
  templateUrl: './add-reservation-client.component.html',
  styleUrls: ['./add-reservation-client.component.scss']
})
export class AddReservationClientComponent implements OnInit {
  // reservationId : string
  addReservationForm: FormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  clubsname: any
  clubs: any;
  terrains: any[] = [];
  clients;
  IdTerrain;
  type;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddReservationClientComponent>,
    private clubService: AdminGenericService,
    private embryoService: EmbryoService,
    private accountService: AccountService,
    private toastyService: ToastaService,
    private genericservice: AdminGenericService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    this.addReservationForm = this.formBuilder.group({
      StartReservation: ['', [Validators.required]],
      EndReservation: ['', [Validators.required]],
    })

    console.log(this.embryoService.IdTerrain);
    this.IdTerrain = this.embryoService.IdTerrain;
    console.log(this.IdTerrain);

    this.route.params.subscribe(res => {
      this.type = null;
      this.type = res.type;
      this.IdTerrain = res.id;
      console.log(res.id);
    });


  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day > d.getDate()
  }

  // onFormSubmit method is submit a add new user form.
  onFormSubmit() {
    const body = {
      IdClient: this.accountService.getPayload().UserID,
      IdTerrain: this.embryoService.IdTerrain,
      StartReservation: this.addReservationForm.value.StartReservation,
      EndReservation: this.addReservationForm.value.EndReservation,
      status: "Waiting For Confirmation"
    }

    console.log(body);

    this.genericservice.post(baseurl + '/Reservations', body)
      .subscribe(res => console.log('Added Successfully'),
        err => console.log(err)
      )
    this.dialogRef.close(this.addReservationForm.value);
    this.router.navigate(['/account/order-history']);
  }

}
