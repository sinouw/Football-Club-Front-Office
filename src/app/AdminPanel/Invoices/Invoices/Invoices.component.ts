import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatPaginator} from '@angular/material';
import { AdminGenericService } from '../../Service/AdminGeneric.service';
import { baseurl } from '../../Models/basurl.data';
import { Reservation } from '../../Models/Reservation.model';

@Component({
  selector: 'app-invoices',
  templateUrl: './Invoices.component.html',
  styleUrls: ['./Invoices.component.scss']
})

export class InvoicesComponent implements OnInit {

	popUpDeleteUserResponse : any;
	ReservationList         : Reservation [] = [];

   @ViewChild(MatPaginator,{static: false}) paginator : MatPaginator;

   dataSource = new MatTableDataSource<any>(this.ReservationList);

   displayedColumns : string[] = ['position', 'invoiceId', 'name', 'date','price', 'payment','status','action'];

   constructor(public service : AdminPanelServiceService,
      private genericservice: AdminGenericService) { }

	ngOnInit() {
      this.getReservationInfo()
   }


   getReservationInfo(){
      this.genericservice.get(baseurl+'/Reservations')
      .subscribe(
         res=>{
            this.ReservationList=res as Reservation[]
            console.log(res)
            this.service.getInvoiceContent().valueChanges().subscribe(rest => this.getInvoiceData(rest));
         },
         err=>
            console.log(err)
      )
      
		
   }

   //getInvoiceData method is used to get the invoice list data.
   getInvoiceData(response){
      // this.invoiceList = response;
      this.dataSource = new MatTableDataSource<any>(this.ReservationList);
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
