import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'assignment';

  constructor(private http: HttpClient) { }

  ngOnInit() {

    let body = {
      "event_category": "ALL_EVENTS",
      "event_sub_category": "Archived",
      "tag_list": "Interview Preparation",
      "offset": "20"
    }

    let params = new HttpParams();
    params = params.append('event_category', "ALL_EVENTS");
    params = params.append('event_sub_category', "Archived");
    params = params.append('tag_list', "Interview Preparation");
    params = params.append('offset', "20");

    this.http.get('https://api.codingninjas.com/api/v3/events', { params: params }).subscribe((res) => {
      console.log(res['data']);
    }, (err) => {
      console.log(err);
    })
  }


}
