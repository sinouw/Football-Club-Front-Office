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
import { ReservsationService } from 'src/app/Services/reservsation.service';
import { DatePipe } from '@angular/common';

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
  startreservation
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
    private resservice : ReservsationService,
    public datePipe: DatePipe

  ) { }

  ngOnInit() {
    this.startreservation = this.datePipe.transform(this.resservice.StartReservation,"yyyy-MM-ddThh:mm") 
    console.log(this.startreservation);
    
    this.addReservationForm = this.formBuilder.group({
      StartReservation: [this.startreservation, [Validators.required]],
      Duration: ['', [Validators.required]],
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

    let endhours  = new Date(this.addReservationForm.value.StartReservation).getHours()+this.addReservationForm.value.Duration
    let endRes = this.datePipe.transform(new Date(this.addReservationForm.value.StartReservation).setHours(endhours),"yyyy-MM-ddThh:mm")     

    const body = {
      IdClient: this.accountService.getPayload().UserID,
      IdTerrain: this.embryoService.IdTerrain,
      StartReservation: this.addReservationForm.value.StartReservation,
      EndReservation: endRes,
      status: "Confirmed"
    }

    console.log(body)
    this.genericservice.post(baseurl + '/Reservations', body)
      .subscribe(res => {
        this.resservice.putEndStart(body.StartReservation,body.EndReservation)
        console.log('Added Successfully')
      },
        err => console.log(err)
      )
    this.dialogRef.close(this.addReservationForm.value);
    // this.router.navigate(['/account/order-history']);
  }

}
