import { Injectable } from '@angular/core';
import { baseurl } from '../Models/basurl.data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
reservations : any
  constructor(private http : HttpClient) { }

  getReservationInfo(){
    this.http.get(baseurl+'/Reservations?$select=Client&$expand=Client($select=FullName)&$expand=terrain($select=Name,Type,Price,IdClub)&$select=status,StartRes,EndRes,IdReservation')
    // this.genericservice.get(baseurl+'/Reservations')
    .subscribe(
       res=>{
          // this.reservations=res as Reservation[]
          this.reservations =res 
          console.log(res)
       },
       err=>
          console.log(err))
   }

   DeleteReservation(id){
      this.http.delete(baseurl+'/Reservations/'+id).subscribe(
        res=>{
          this.getReservationInfo()
        },err=>{
          console.log(err);
        })
    }





}
