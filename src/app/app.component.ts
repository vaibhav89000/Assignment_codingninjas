import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonserviceService } from './services/commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'assignment';

  tags: any = [];
  results: any;

  eventCategory: any;
  eventSubCategory: any;
  tagList: any;
  offSet: any;


  constructor(private http: HttpClient,
    private commonservice: CommonserviceService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {

    // let ele = document.getElementById('ALL_EVENTS');
    // console.log('check',document.getElementById('ALL_EVENTS'));
    // document.getElementById('ALL_EVENTS').style.backgroundColor = 'red';

    this.route.queryParams.subscribe(params => {
      // console.log('params', params);
      this.eventCategory = params.event_category;
      this.eventSubCategory = params.event_sub_category;
      this.tagList = params.tag_list;
      this.offSet = params.offset;
      // console.log(this.eventCategory);
      // console.log(this.eventSubCategory);
      // console.log(this.tagList);
      // console.log(this.offSet);

      // if (this.eventCategory !== undefined) {
      //   let parameters = [this.eventCategory, this.eventSubCategory];
      //   let tagsarray = this.tagList.split(',');
      //   for (let tagof of tagsarray) {
      //     if (tagof !== '') {
      //       parameters.push(tagof);
      //     }
      //   }
      //   // console.log(parameters);
      //   for (let doc of parameters) {
      //     let ele = document.getElementById(doc);
      //     if (ele != null) {
      //       ele.style.backgroundColor = 'red';
      //     }
      //   }
      // }

      var AlleventCategory = ["CODING_EVENT", "WEBINAR", "BOOTCAMP_EVENT", "WORKSHOP", "ALL_EVENTS"];
      var check_eventCategory = AlleventCategory.includes(this.eventCategory);

      if (!check_eventCategory) {
        this.router.navigate([], {
          queryParams: {
            'event_category': 'ALL_EVENTS',
            'event_sub_category': 'Upcoming',
            'tag_list': '',
            'offset': '0'
          }
        })
      }

      let body = {
        'event_category': this.eventCategory,
        'event_sub_category': this.eventSubCategory,
        'tag_list': this.tagList,
        'offset': this.offSet
      }

      // call for content
      this.commonservice.getData(body).subscribe((res) => {
        // console.log(res['data']);
        this.patchValue(res['data']);
      }, (err) => {
        console.log(err);
      })
    });

    // call for tags
    this.commonservice.getTags().subscribe((res) => {
      let data = res['data'];
      this.tags = data['tags'];
      // console.log(data['tags']);
    }, (err) => {
      console.log(err);
    })

  }


  // setting values in cards
  patchValue(data) {
    // console.log('data', data['events']);
    this.results = data['events'];
  }


  tagadd(tag) {
    // console.log('tag added', tag);

    // if atleast one tag -> add or remove
    // else add
    if (this.tagList !== '') {
      let previousTags = this.tagList.split(',');
      // if already exist in query -> remove
      // else add it
      if (previousTags.includes(tag)) {
        let index = previousTags.indexOf(tag);
        previousTags.splice(index, 1);
        this.tagList = previousTags.join(",");
      }
      else {
        this.tagList = this.tagList + ',' + tag;
      }
    }
    else {
      this.tagList = tag;
    }
    this.router.navigate([], {
      queryParams: {
        'event_category': this.eventCategory,
        'event_sub_category': this.eventSubCategory,
        'tag_list': this.tagList,
        'offset': '0'
      }
    })
  }


}



// <<<-not needed now but may be use later->>>
      // var AlleventSubCategory = ["‘Upcoming’", "‘Archived’", "All Time Favorites"];
      // var check_eventSubCategory = AlleventSubCategory.includes(this.eventSubCategory);

      // if (!check_eventSubCategory) {
      //   this.router.navigate([], {
      //     queryParams: {
      //       'event_category': this.eventCategory,
      //       'event_sub_category': 'Upcoming',
      //       'tag_list': '',
      //       'offset': '0'
      //     }
      //   })
      // }