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
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarUtils,
  CalendarMonthViewDay
} from 'angular-calendar';


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

  

  ngOnInit() {
  }

  clickedDate: Date;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  constructor() {}

  events: CalendarEvent[] = [
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(startOfDay(new Date()), 4),
      title: '',
      color: colors.red,
      actions: null,
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    }
  ];

  dayClicked({ date }: { date: Date }): void {
    this.clickedDate = date
    if (this.view === CalendarView.Month) 
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



  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }


}
