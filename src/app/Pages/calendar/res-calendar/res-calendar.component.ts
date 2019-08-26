import {Component,OnInit,ChangeDetectionStrategy,ViewChild,TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  addHours,
  startOfMonth,
  subWeeks,
  addWeeks,
  endOfMonth
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarUtils,
  CalendarMonthViewDay
} from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { baseurl } from 'src/app/AdminPanel/Models/basurl.data';
import { EmbryoService } from 'src/app/Services/Embryo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminGenericService } from 'src/app/AdminPanel/Service/AdminGeneric.service';
import { ReservsationService } from 'src/app/Services/reservsation.service';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-res-calendar',
  templateUrl: './res-calendar.component.html',
  styleUrls: ['./res-calendar.component.css']
})
export class ResCalendarComponent implements OnInit {
  
  IdTerrain : any

  reservations : any[]=[]

  clickedDate: Date;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  constructor(private http : HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public embryoService: EmbryoService,
    public service: AdminGenericService,
    private resservice :ReservsationService) {
     

      this.IdTerrain= this.resservice.idTerrain
      console.log(this.IdTerrain)

      // if(this.IdTerrain == null)
      // this.router.navigateByUrl('/client/terrains');

    this.getReservations()
    .subscribe(
      res=>{
       this.reservations=res
        this.reservations.forEach(e => {
           var StartRes = new Date(e.StartReservation)
           var EndRes = new Date(e.EndReservation)
           console.log(StartRes,EndRes);    
           this.addDbEvents(StartRes , EndRes)
        });
      },
      err=>console.log(err))
  }

  ngOnInit() {
    
    
  }

  events: CalendarEvent[] = [];

  getReservations() : Observable<any>{
    return this.http.get<any>(baseurl+"/Reservations?$select=StartReservation,EndReservation,Duration&$filter=contains(status,'Confirmed')")
  }

  dayClicked({ date }: { date: Date }): void {
    this.clickedDate = date
    let today = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())  
    
    if (this.view === CalendarView.Month && today<=date) 
    {
      this.viewDate = date; 
      this.view = CalendarView.Week;
    }   
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }



  addDbEvents(startRes , endRes): void {
   
    // addHours(startOfDay(new Date()), 2),
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startRes,
        end: endRes,
        color: colors.red,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false
        }
      }
    ];
  }

  AddReservationPopup() {
    this.embryoService.addNewReservationDialog(this.IdTerrain);
  }


  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  HourClicked({ date }: { date: Date }){
    console.log(date);
    
  }

}
