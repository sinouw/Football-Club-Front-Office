import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatPaginator} from '@angular/material';
import { AdminGenericService } from '../../Service/AdminGeneric.service';
import { baseurl } from '../../Models/basurl.data';
import { Reservation } from '../../Models/Reservation.model';
import { ReservationService } from '../../Service/reservation.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-invoices',
  templateUrl: './Invoices.component.html',
  styleUrls: ['./Invoices.component.scss']
})

export class InvoicesComponent implements OnInit {

	popUpDeleteUserResponse : any;
   invoiceList             : any[]=[] ;
   reservations            
   @ViewChild(MatPaginator,{static: false}) paginator : MatPaginator;

   dataSource = new MatTableDataSource<any>(this.invoiceList);

   // displayedColumns : string[] = ['position', 'invoiceId', 'name','Price', 'payment','status','action'];
   // displayedColumns : string[] = ['ClubName', 'Name','Type', 'FullName', 'StartRes','EndRes', 'Price','status','action'];
   displayedColumns : string[] = ['Name','Type', 'FullName','Day', 'StartRes','EndRes', 'Price','status','action'];

   constructor(public service : AdminPanelServiceService,
      private genericservice: AdminGenericService,
      private reservationservice :ReservationService) { }

	ngOnInit() {
      
      this.getDataInfo()
   
   }

   getDataInfo(){
      this.reservationservice.getReservationInfo()
      this.service.getInvoiceContent().valueChanges().subscribe(rest => this.getInvoiceData(rest));
   }

   //getInvoiceData method is used to get the invoice list data.
   getInvoiceData(response){
      // this.invoiceList = response;
      console.log(this.reservationservice.reservations);


      this.reservationservice.reservations.forEach(el => {
         let invoice = {
            FullName : el.Client.FullName,
            Name: el.Terrain.Name,
            Type: el.Terrain.Type,
            Price: el.Terrain.Price,
            IdClub: el.Terrain.IdClub,
            status : el.status,
            Day : ((JSON.stringify(el.StartRes)).split("T")[0]).substring(1,11),
            StartRes :(((JSON.stringify(el.StartRes)).split("T")[1])).split('"')[0],
            EndRes : (((JSON.stringify(el.EndRes)).split("T")[1])).split('"')[0],
         }
         this.invoiceList.push(invoice);
      });

      

      // let body ={
      //    FullName : this.reservationservice.reservations.Client.FullName
      // }

      // this.invoiceList = this.reservationservice.reservations
      // this.invoiceList.values.
      this.dataSource = new MatTableDataSource<any>(this.invoiceList);
      setTimeout(()=>{
         this.dataSource.paginator = this.paginator;
      },0)
    
   }
	/** 
     *onDelete method is used to open a delete dialog.
     */
   onDelete(i){
      this.service.deleteDialog("Are you sure you want to delete this invoice permanently?").
         subscribe( res => {this.popUpDeleteUserResponse = res},
                    err => console.log(err),
                    ()  => this.getDeleteResponse(this.popUpDeleteUserResponse,i))
   }

   /**
     * getDeleteResponse method is used to delete a invoice from the invoice list.
     */
   getDeleteResponse(response : string, i){
      if(response == "yes"){
         this.dataSource.data.splice(i,1);
         this.dataSource = new MatTableDataSource(this.dataSource.data);
         this.dataSource.paginator = this.paginator;
      }
   }

   /**
     * onSeeDialog method is used to open a see dialog.
     */
   onSeeDialog(){
      this.service.seeList();
   }

   //applyFilter function can be set which takes a data object and filter string and returns true if the data object is considered a match.
   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }
}
