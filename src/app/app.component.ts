import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonserviceService } from './services/commonservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'assignment';

  tags: any = [];
  results: any;
  constructor(private http: HttpClient,
    private commonservice:CommonserviceService) { }

  ngOnInit() {

    // call for tags
    this.commonservice.getTags().subscribe((res)=>{
      let data = res['data'];
      this.tags = data['tags'];
      // console.log(data['tags']);
    },(err)=>{
      console.log(err);
    })

    // call for content
    this.commonservice.getData().subscribe((res) => {
      // console.log(res['data']);
      this.patchValue(res['data']);
    }, (err) => {
      console.log(err);
    })
  }


  // setting values in cards
  patchValue(data){
    console.log('data',data['events']);
    this.results = data['events'];
  }


}
