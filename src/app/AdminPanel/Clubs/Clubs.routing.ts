import { Routes } from '@angular/router';
import { ClubsComponent } from './Clubs/Clubs.component';

export const ClubsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'ClubsComponent',
        pathMatch: 'full'
    },
    {
        path: '',
        children: [
            {
                path: 'clubs',
                component: ClubsComponent
            }
        ]
    }
];
