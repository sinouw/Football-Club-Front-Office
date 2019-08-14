import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../Service/account.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userDetails

  constructor(private router: Router, private service: AccountService,private http : HttpClient) { }

  ngOnInit() {
  
    this.getUser()
     
  }
  getUser(){
    this.service.getUserProfile().subscribe(
      res=>this.userDetails=res,
      err=>console.log(err))
   }

}
