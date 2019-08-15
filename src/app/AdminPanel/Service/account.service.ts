import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/Models/User.model';
import { log } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  Userbody : User
  Users : any []=[]
  UserID:any
  UserFullName : any
  UserN : any
  userRole

  constructor(private fb: FormBuilder, private http: HttpClient) { }
  readonly BaseURI = 'http://localhost:44358/api';

  login(formData) {
    return this.http.post(this.BaseURI + '/Login', formData)
  }

  putUser(){
    let payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    this.http.put(this.BaseURI+'/SuperAdmin/Edit/'+payLoad.UserID,this.Userbody).subscribe(res=>{
      console.log(res)
   })
  }

  GetUsers(){
    let payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
  this.http.get(this.BaseURI+ '/User/').subscribe(
    res=>{
      this.Users=res as User[]
      this.Users=this.Users.filter(u=>u.UserName!=payLoad.UserName)
      console.log(res)
    },
    err=>{
      console.log(err)
    })
    return this.Users
  }

  DeleteUser(username){
    this.http.delete(this.BaseURI+'/user/delete/'+username).subscribe(
      res=>{
        this.GetUsers()
      },err=>{
        console.log(err);
        
      })
  }

  getUserProfile() {
    let headers_object = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get(this.BaseURI + '/UserProfile',{headers:headers_object});
  }
  getPayload(){
    let payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    return payLoad
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    let payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    let userRole = payLoad.role;
    let userid = payLoad.UserID;
    
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
}
