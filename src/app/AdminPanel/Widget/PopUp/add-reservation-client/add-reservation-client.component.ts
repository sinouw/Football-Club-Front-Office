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

@Component({
  selector: 'app-add-reservation-client',
  templateUrl: './add-reservation-client.component.html',
  styleUrls: ['./add-reservation-client.component.scss']
})
export class AddReservationClientComponent implements OnInit {
  // reservationId : string
  addReservationForm: FormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  clubsname : any 
  clubs:any;
  terrains:any[]=[];
  clients;
  IdTerrain;
  type;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddReservationClientComponent>,
    private clubService: AdminGenericService,
    private accountService: AccountService,
    private toastyService: ToastaService,
    private genericservice : AdminGenericService,
    private route: ActivatedRoute,
    private router: Router,
    ) {}

  ngOnInit() {

    this.addReservationForm = this.formBuilder.group({
      resDay: ['', [Validators.required]],
      StartRes: ['', [Validators.required]],
      EndRes: ['', [Validators.required]],
      status: ['', [Validators.required]],
    })

    this.route.params.subscribe(res => {
      this.type = null;
      this.type = res.type;
      this.IdTerrain = res.id;
      console.log(res.id);
    });


    this.getClients()
    this.getClubs()
    this.getTerrains()
    }

    getClubs(){
      this.list()
      .subscribe(result => {
        this.clubs = result;
        console.log(this.clubs);
      });
    }

    getClients(){
      this.genericservice.get(baseurl+'/client?$select=UserName,Id')
        .subscribe(res=>{
          console.log(res)
          this.clients=res
        },
        err=>{
          console.log(err);
        })
    }
         	
      myFilter = (d: Date): boolean => {
        const day = d.getDay();
        // Prevent Saturday and Sunday from being selected.
        return day>d.getDate() 
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
    const body = {
      IdClient: this.accountService.getPayload().UserID,
      // IdTerrain: this.IdTer,
      resDay: this.addReservationForm.value.resDay,
      StartRes: this.addReservationForm.value.StartRes,
      EndRes: this.addReservationForm.value.EndRes,
      status: "Waiting For Confirmation"
    }



    this.genericservice.post(baseurl+'/Reservations',body)
    .subscribe(res=>console.log('Added Successfully'),
    err=>console.log(err)
    )
     this.dialogRef.close(this.addReservationForm.value);
  }

  list(): any {
    return this.clubService.get(baseurl + '/clubs');
  }

  listTerrain(): any {
    return this.clubService.get(baseurl + '/Terrains');
  }

}
