import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from '../services/commonservice.service';

@Component({
  selector: 'app-tagsidebar',
  templateUrl: './tagsidebar.component.html',
  styleUrls: ['./tagsidebar.component.css']
})
export class TagsidebarComponent implements OnInit {

  tags: any = [];
  Alltags: any = [];
  isalltags: boolean = false;

  eventCategory: any;
  eventSubCategory: any;
  tagList: any;
  page: any;

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

  // show more tags
  alltags() {
    this.tags = this.Alltags;
    this.isalltags = true;
  }

}
