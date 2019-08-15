import { Component, OnInit } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminGenericService } from '../../Service/AdminGeneric.service';
import { url } from 'inspector';
import { Club } from '../../Models/Club.model';

@Component({
  selector: 'app-edit-club',
  templateUrl: './EditClub.component.html',
  styleUrls: ['./EditClub.component.scss']
})
export class EditClubComponent implements OnInit {

  private baseUrl: string = "https://localhost:44358/api";
  s = 3
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

  editClubDetail: any;
  mainImgPath: string;
  clubId: any;
  clubType: any;
  showStatus: boolean;
  form: FormGroup;
  colorsArray: string[] = ["Red", "Blue", "Yellow", "Green"];
  sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
  quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private adminPanelService: AdminPanelServiceService,
    private clubService: AdminGenericService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.clubId = res.id;
      console.log(this.clubId);
    })

    this.form = this.formBuilder.group({
      IdClub: [''], 
      Name: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      Phone: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      OpeningTime: [''],
      ClosingTime: [''],
      IsActive: ['', [Validators.required]],
    });

    this.getClubDetail();

  }

  public getClubDetail() {
    this.clubService.get(this.baseUrl + '/clubs/' + this.clubId).subscribe(
      result => {
        this.form.patchValue({
          IdClub : result.IdClub,
          Name: result.Name,
          Address: result.Address,
          Phone: result.Phone,
          Email: result.Email,
          OpeningTime: result.OpeningTime,
          ClosingTime: result.ClosingTime,
          IsActive: result.IsActive
        });
        console.log(result);
      }, error => {
        console.log(error);
      }
    );

    console.log();
    
  }

  updateClub() {
    let addclub  = {
      IdClub : this.form.value.IdClub,
      Name : this.form.value.Name,
      Address : this.form.value.Address,
      Phone : this.form.value.Phone,
      Email : this.form.value.Email,
      OpeningTime : this.form.value.OpeningTime,
      ClosingTime : this.form.value.ClosingTime,
      IsActive : this.form.value.IsActive
   }
   console.log(addclub);
   
     this.clubService.put(this.baseUrl+`/clubs/${this.clubId}`,addclub)
     .subscribe(res=>console.log(res),
      err=>console.log(err))
  }

}
