import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
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
import { timeout } from 'q';


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

  popUpNewResResponse
  
  IdTerrain: any

  reservations: any[] = []

  clickedDate: Date;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public embryoService: EmbryoService,
    public service: AdminGenericService,
    private resservice: ReservsationService,
    public cdr: ChangeDetectorRef) {


    this.IdTerrain = this.resservice.idTerrain
    console.log(this.IdTerrain)

    if (this.IdTerrain == null || this.IdTerrain == undefined)
      this.router.navigateByUrl('/client/terrains');

    this.getReservations()
      .subscribe(
        res => {
          this.reservations = res
          this.reservations.forEach(e => {
            this.addDbEvents(new Date(e.StartReservation), new Date(e.EndReservation))
          });
        },
        err => console.log(err))
  }

  ngOnInit() {


  }

  events: CalendarEvent[] = [];

  getReservations(): Observable<any> {
    return this.http.get<any>(baseurl + "/Reservations?$select=StartReservation,EndReservation,Duration&$filter=contains(status,'Confirmed')")
  }

  dayClicked({ date }: { date: Date }): void {
    this.clickedDate = date
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

    if (this.view === CalendarView.Month && today <= date) {
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



  addDbEvents(startRes, endRes): void {

    this.events = [
      ...this.events,
      {
        title: '',
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

  RefrechEvents(): void {
    this.events = [
      ...this.events
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

  HourClicked({ date }: { date: Date }) {
    this.resservice.putStartDate(date)
    this.embryoService.addNewReservationDialog(this.IdTerrain)
      .subscribe(res => {
        this.popUpNewResResponse = res;
      },
        err => console.log(err),
        () => this.getAddResPopupResponse(this.popUpNewResResponse))
  }


  getAddResPopupResponse(response: any) {
    if (response) {
      console.log('response : ',response)
      // let body = this.resservice.getEndStart()
      // this.addDbEvents(new Date(body.start),new Date(body.end))
      // this.RefrechEvents()
      // this.refresh.next();
      this.getReservations()
      .subscribe(
        res => {
          this.events = []
          this.reservations = res
          this.reservations.forEach(e => {
            this.addDbEvents(new Date(e.StartReservation), new Date(e.EndReservation))
          });
        },
        err => console.log(err))
    }
  }
}
