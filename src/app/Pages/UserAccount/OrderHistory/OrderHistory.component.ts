import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/AdminPanel/Service/account.service';
import { HttpClient } from '@angular/common/http';
import { baseurl } from 'src/app/AdminPanel/Models/basurl.data';

const order_history = [
   {position: 1, orderid:1801, name: 'LEGITIM', price: 1.0079, status: 'Sent',action:''},
   {position: 2, orderid:1832, name: 'GRUNDTAL', price: 4.0026, status: 'In processing',action:''},
   {position: 3, orderid:1881, name: 'BOHOLMEN', price: 6.941, status: 'Sent',action:''},
   {position: 4, orderid:1832, name: 'ROSTAD LÖK', price: 9.0122, status: 'Return',action:''},
   {position: 5, orderid:1810, name: 'TÅRTA CHOKLADKROKANT', price: 10.811, status: 'Sent',action:''},
];

@Component({
  selector: 'app-OrderHistory',
  templateUrl: './OrderHistory.component.html',
  styleUrls: ['./OrderHistory.component.scss']
})
export class OrderHistoryComponent implements OnInit {

   ReservationHistory : any[]=[]
   i : number = 0
   // displayedColumns: string[] = ['position', 'orderid', 'name', 'price', 'status','action'];
   displayedColumns: string[] = ['position','StartReservation', 'EndReservation', 'Price', 'status'];
   dataSource

   constructor(private accountService : AccountService,private http : HttpClient) { }

   ngOnInit() {
      this.list().subscribe(
         res => { 
         this.ReservationHistory=res.Reservations 
         console.log(this.ReservationHistory);
         this.dataSource =this.ReservationHistory;
         
       },
       err=>{
          console.log(err);
          
       });
       
   }


   list(): any {
      let payload = this.accountService.getPayload();
        return this.http.get(baseurl + '/client/'+payload.UserID);
    }

}
