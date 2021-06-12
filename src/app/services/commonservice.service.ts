import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  constructor(private http: HttpClient) { }

  // Get request to get tags list
  getTags(){
    return this.http.get('https://api.codingninjas.com/api/v3/event_tags');
  }

  // Get request to get data of events
  getData(){
    let params = new HttpParams();
    params = params.append('event_category', "ALL_EVENTS");
    params = params.append('event_sub_category', "Archived");
    params = params.append('tag_list', "Interview Preparation");
    params = params.append('offset', "0");

    return this.http.get('https://api.codingninjas.com/api/v3/events', { params: params });
  }
}
