import { Routes } from '@angular/router';
import { ClubsComponent } from './Clubs/Clubs.component';
import { EditClubComponent } from './EditClub/EditClub.component';

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
            },
            {
                path: 'club-edit/:id',
                component: EditClubComponent
            },
        ]
    }
];
