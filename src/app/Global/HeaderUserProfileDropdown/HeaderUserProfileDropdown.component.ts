import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/AdminPanel/Service/account.service';

@Component({
  selector: 'embryo-HeaderUserProfileDropdown',
  templateUrl: './HeaderUserProfileDropdown.component.html',
  styleUrls: ['./HeaderUserProfileDropdown.component.scss']
})
export class HeaderUserProfileDropdownComponent implements OnInit {

  loginStatus: boolean = false;

  constructor(
    public router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.loginStatus = this.getLoginStatus();
  }

  getLoginStatus() {
    return localStorage.getItem('token') != null ;
  }

  logOut() {
    localStorage.removeItem('token');
    document.getElementById('html').classList.remove("admin-panel");
    this.router.navigate(['/session/signin']);
  }
}
