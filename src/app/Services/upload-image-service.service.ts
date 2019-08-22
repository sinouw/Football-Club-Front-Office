import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseurl } from '../AdminPanel/Models/basurl.data';

@Injectable({
  providedIn: 'root'
})
export class UploadImageServiceService {
  idterrain
  constructor(private http : HttpClient) { }

  postFile(caption: string, fileToUpload: File) {
    const endpoint = baseurl+'/Images/upload/'+this.idterrain;
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('ImageCaption', caption);
    return this.http
      .post(endpoint, formData);
  }
}
