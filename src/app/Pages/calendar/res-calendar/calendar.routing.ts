import { Routes } from '@angular/router';
import { ResCalendarComponent } from "./res-calendar.component";


export const CalendarRoutes : Routes = [
	{ 
		path: '', 
		component: ResCalendarComponent 
	},
   { 
      path: 'Calendar', 
      component: ResCalendarComponent
   },

]