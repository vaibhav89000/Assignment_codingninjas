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
  getData(body){
    let params = new HttpParams();
    params = params.append('event_category', body.event_category);
    params = params.append('event_sub_category', body.event_sub_category);
    params = params.append('tag_list', body.tag_list);
    params = params.append('offset', body.offset);

    return this.http.get('https://api.codingninjas.com/api/v3/events', { params: params });
  }
}
