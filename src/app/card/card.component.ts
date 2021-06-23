import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from '../services/commonservice.service';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  results: any;

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
  }

  // getdate in format
  getDate(ele_time, type) {
    // seconds to milliseconds
    let timestamp = ele_time * 1000;
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
    let timechange;
    if (type === 'start_time') {
      timechange = _time + ',' + dd + " " + mm + " " + yy;
    }
    else {
      timechange = dd + " " + mm + "," + " " + _time;
    }
    return timechange;
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

      ele.event_start_time = this.getDate(ele.event_start_time, 'start_time');
      ele.registration_end_time = this.getDate(ele.registration_end_time, 'reg_time');
      return ele;
    });
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
}
