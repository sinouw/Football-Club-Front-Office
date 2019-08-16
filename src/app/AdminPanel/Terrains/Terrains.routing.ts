import { Routes } from '@angular/router';
import { TerrainsComponent } from './terrains/terrains.component';


export const TerrainsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'TerrainsComponent',
        pathMatch: 'full'
    },
    {
        path: '',
        children: [
            {
                path: 'terrains',
                component: TerrainsComponent
            },
            {
                path: 'terrains/:id',
                component: TerrainsComponent
            }
        ]
    }
];