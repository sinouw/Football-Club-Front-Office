import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservsationService {
  idTerrain
  reservationBody:any;
  constructor() { }

  putIdTerrain(id : string){
    this.idTerrain=id
  }

}
