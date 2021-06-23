import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncSubject, BehaviorSubject, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {
  paramsstr = new Subject<any>();
  

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) {
    // params
    this.route.queryParams.subscribe(params => {
      this.paramsstr.next(params);
    });

  }

  url = environment.produrl;
  // Get request to get tags list
  getTags() {
    return this.http.get(`${this.url}/event_tags`);
  }

  // Get request to get data of events
  getData(body) {
    let params = new HttpParams();
    params = params.append('event_category', body.event_category);
    params = params.append('event_sub_category', body.event_sub_category);
    params = params.append('tag_list', body.tag_list);
    params = params.append('offset', ((parseInt(body.page) - 1) * 20).toString());

    return this.http.get(`${this.url}/events`, { params: params });
  }

  // return active params
  getparams(){
    return this.paramsstr.asObservable();
  }
}
