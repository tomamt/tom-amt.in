
import { HttpRequest,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable({
    providedIn: 'root'
  })
export class UploadFileService {

  constructor(private httpClient: HttpClient,public envService: EnvironmentService){
  }

  uploadfile(imageFile,s3data) {
    const fd = new FormData();
    fd.append('key', s3data.policysiganture.fields.key);
    fd.append('Content-Type', imageFile.type);
    fd.append('acl', 'public-read'); 
    fd.append('X-Amz-Credential', s3data.policysiganture.fields['X-Amz-Credential']);
    fd.append('X-Amz-Algorithm', s3data.policysiganture.fields['X-Amz-Algorithm']);
    fd.append('X-Amz-Date', s3data.policysiganture.fields['X-Amz-Date']);
    fd.append('Policy', s3data.policysiganture.fields.Policy);
    fd.append('X-Amz-Signature', s3data.policysiganture.fields['X-Amz-Signature']);
    fd.append("file", imageFile);

    let S3Url = "https://"+this.envService.read('S3bucket')+".s3.amazonaws.com/";
    const req = new HttpRequest('POST', S3Url, fd, { responseType:'text'});
    return this.httpClient.request(req);    
  }

}
