import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatPaginator} from '@angular/material';
import { AdminGenericService } from '../../Service/AdminGeneric.service';
import { baseurl } from '../../Models/basurl.data';
import { Reservation } from '../../Models/Reservation.model';
import { ReservationService } from '../../Service/reservation.service';
import { JsonPipe } from '@angular/common';
import { ToastOptions, ToastaService } from 'ngx-toasta';

@Component({
  selector: 'app-invoices',
  templateUrl: './Invoices.component.html',
  styleUrls: ['./Invoices.component.scss']
})

export class InvoicesComponent implements OnInit {
   clubs
   collaborationData
   popUpNewResResponse    : any;
	popUpDeleteUserResponse : any;
   invoiceList             : any[]=[] ;
   reservations            
   toastOptionDelete  : ToastOptions = {
      title     : "Account Deleted",
      msg       : "An account was deleted successfully!",
      showClose : true,
      timeout   : 3000,
      theme     : "material"
   };
   @ViewChild(MatPaginator,{static: false}) paginator : MatPaginator;

   dataSource = new MatTableDataSource<any>(this.invoiceList);

   // displayedColumns : string[] = ['position', 'invoiceId', 'name','Price', 'payment','status','action'];
   // displayedColumns : string[] = ['ClubName', 'Name','Type', 'FullName', 'StartRes','EndRes', 'Price','status','action'];
   displayedColumns : string[] = ['Name','Type', 'FullName','Day', 'StartRes','EndRes', 'Price','status','action'];

   constructor(public service : AdminPanelServiceService,
      private genericservice: AdminGenericService,
      private reservationservice :ReservationService,
      private toastyService: ToastaService,
      ) { }

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
            IdReservation:el.IdReservation,
            FullName : el.Client.FullName,
            Name: el.Terrain.Name,
            Type: el.Terrain.Type,
            Price: el.Terrain.Price,
            IdClub: el.Terrain.IdClub,
            status : el.status,
            Day : el.resDay,
            StartRes :el.StartRes,
            EndRes : el.EndRes
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
   onDelete(id,i){
      this.service.deleteDialog("Are you sure you want to delete this invoice permanently?").
         subscribe( res => {this.popUpDeleteUserResponse = res},
                    err => console.log(err),
                    ()  => this.getDeleteResponse(id,this.popUpDeleteUserResponse,i))
   }

   /**
     * getDeleteResponse method is used to delete a invoice from the invoice list.
     */
   getDeleteResponse(id,response : string, i){
      if(response == "yes"){
         this.dataSource.data.splice(i,1);
         this.reservationservice.DeleteReservation(id)
         this.dataSource = new MatTableDataSource(this.dataSource.data);
         this.dataSource.paginator = this.paginator;
         this.toastyService.success(this.toastOptionDelete);
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

   
      /** 
     * addNewUserDialog method is used to open a add new client dialog.
     */   
    addNewUserDialog() {
      //  this.reservationservice.getClubs()
      this.service.addNewReservationDialog().
         subscribe( res => {this.popUpNewResResponse = res;
            
         },
                    err => console.log(err),
                     ()  => this.getAddResPopupResponse(this.popUpNewResResponse))
                
   }

   getAddResPopupResponse(response: any){
      if(response){
         let addUser = {
            FullName : response.FullName,
            Email : response.Email,
            PhoneNumber : response.PhoneNumber,
            Role : response.Role,
            IsActive : response.IsActive
         }
         this.collaborationData.push(addUser);
         this.dataSource = new MatTableDataSource<any>(this.collaborationData);     
      }
   }
}
