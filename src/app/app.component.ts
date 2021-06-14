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
  page: any;

  currpage = 1;
  noOfpage = 1;
  collectionSize = this.noOfpage * 20;

  months = [
    "Jan", "Feb",
    "Mar", "Apr", "May",
    "June", "July", "Aug",
    "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private http: HttpClient,
    private commonservice: CommonserviceService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // console.log('params', params);
      this.eventCategory = params.event_category;
      this.eventSubCategory = params.event_sub_category;
      this.tagList = params.tag_list;
      this.page = params.page;

      var AlleventCategory = ["CODING_EVENT", "WEBINAR", "BOOTCAMP_EVENT", "WORKSHOP", "ALL_EVENTS"];
      var check_eventCategory = AlleventCategory.includes(this.eventCategory);

      if (!check_eventCategory) {
        this.router.navigate([], {
          queryParams: {
            'event_category': 'ALL_EVENTS',
            'event_sub_category': 'Upcoming',
            'tag_list': '',
            'page': '1'
          }
        })
      }

      let body = {
        'event_category': this.eventCategory,
        'event_sub_category': this.eventSubCategory,
        'tag_list': this.tagList,
        'page': this.page
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
    // this.results = data['events'];
    this.noOfpage = data['page_count'];
    this.collectionSize = this.noOfpage * 20;

    this.results = data['events'].map(ele => {
      let timestamp = ele.event_start_time;
      var date = new Date(timestamp);
      // console.log(timestamp);
      let dd = date.getDate();
      let mm = this.months[date.getMonth()];
      let yy = date.getFullYear();

      var dt = new Date(timestamp);
      var h = dt.getHours(), m = dt.getMinutes();
      var _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');

      ele.event_start_time = _time + ',' + dd + " " + mm + " " + yy;
      return ele;
    })
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
        'page': '1'
      }
    })
  }

  // Check for active nav
  // if present true else return false
  isLinkActive(tag): Boolean {
    if (this.tagList !== undefined && this.tagList.includes(tag)) {
      return true;
    }
    if (this.eventCategory !== undefined && this.eventCategory.includes(tag)) {
      return true;
    }
    if (this.eventSubCategory !== undefined && this.eventSubCategory.includes(tag)) {
      return true;
    }
    return false;
  }

  selectPage(page: string) {
    this.router.navigate([], {
      queryParams: {
        'event_category': this.eventCategory,
        'event_sub_category': this.eventSubCategory,
        'tag_list': this.tagList,
        'page': page
      }
    })
  }



  // on next Page and on previous page
  refreshpage() {
    this.router.navigate([], {
      queryParams: {
        'event_category': this.eventCategory,
        'event_sub_category': this.eventSubCategory,
        'tag_list': this.tagList,
        'page': this.currpage
      }
    })
  }

  //keydown
  keyPressNumbers(event) {
    var charCode = event.keyCode;
    // Only Numbers 0-9 and backspace -> 8
    if ((charCode >= 48 && charCode <= 57) || charCode == 8) {
      return true;
    } else {
      return false;
    }
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
      //       'page': '0'
      //     }
      //   })
      // }