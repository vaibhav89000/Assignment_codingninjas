import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonserviceService } from './services/commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'assignment';

  tags: any = [];
  Alltags: any = [];
  results: any;
  isalltags: boolean = false;


  badges = {
    'CODING_EVENT': 'Coding Event',
    'WEBINAR': 'WEBINAR',
    'BOOTCAMP_EVENT': 'BOOTCAMP EVENT',
    'WORKSHOP': 'WORKSHOP',
    'ALL_EVENTS': 'ALL EVENTS'
  }

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
    "Jun", "Jul", "Aug",
    "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private http: HttpClient,
    private commonservice: CommonserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

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
      this.spinner.show();
      this.commonservice.getData(body).subscribe((res) => {

        this.spinner.hide();
        this.patchValue(res['data']);
      }, (err) => {
        // console.log(err);
        this.spinner.hide();
      })
    });

    // spinner start
    this.spinner.show();
    // call for tags
    this.commonservice.getTags().subscribe((res) => {
      let data = res['data'];
      this.Alltags = data['tags'];
      this.tags = this.Alltags.slice(0, 12);
      // spinner stop
      this.spinner.hide();
    }, (err) => {
      // console.log(err);
      // spinner stop
      this.spinner.hide();
    })
  }

  // setting values in cards
  patchValue(data) {
    // this.results = data['events'];
    this.noOfpage = data['page_count'];
    this.collectionSize = this.noOfpage * 20;

    this.results = data['events'].map(ele => {
      if (ele.event_category in this.badges) {
        ele.event_category = this.badges[ele.event_category];
      }
      else {
        ele.event_category = 'No Badge';
      }

      // seconds to milliseconds
      let timestamp = ele.event_start_time * 1000;
      var date = new Date(timestamp);
      // dd/mm/yy
      let dd = date.getDate();
      let mm = this.months[date.getMonth()];
      let yy = date.getFullYear();

      var dt = new Date(timestamp);
      var h = dt.getHours(), m = dt.getMinutes().toString();

      var _time;
      // two digit figure check
      if (parseInt(m) < 10) {
        m = '0' + m;
      }
      // 24 hrs to 12hrs clock
      if (h == 0) {
        _time = '12' + ':' + m + ' AM';
      }
      else if (h >= 1 && h < 12) {
        if (h < 10) {
          _time = '0' + h + ':' + m + ' AM';
        }
        else {
          _time = h + ':' + m + ' AM';
        }
      }
      else if (h >= 13 && h < 24) {
        let hr = h - 12;
        if (hr < 10) {
          _time = '0' + hr + ':' + m + ' PM';
        }
        else {
          _time = hr + ':' + m + ' PM';
        }
      }
      ele.event_start_time = _time + ',' + dd + " " + mm + " " + yy;
      return ele;
    });
  }

  tagadd(tag) {
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

  // Check for active nav link
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

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');    
  }



  // show more tags
  alltags() {
    this.tags = this.Alltags;
    this.isalltags = true;
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