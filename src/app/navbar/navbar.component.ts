import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from '../services/commonservice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  eventCategory: any;
  eventSubCategory: any;
  tagList: any;
  page: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private commonservice: CommonserviceService) { }

  ngOnInit() {
    this.commonservice.getparams().subscribe(res => {
      // console.log(res);
      this.eventCategory = res.event_category;
      this.eventSubCategory = res.event_sub_category;
      this.tagList = res.tag_list;
      this.page = res.page;

      var AlleventCategory = ["CODING_EVENT", "WEBINAR", "BOOTCAMP_EVENT", "WORKSHOP", "ALL_EVENTS"];
      var check_eventCategory = AlleventCategory.includes(this.eventCategory);

      var AlleventSubCategory = ["Upcoming", "Archived", "All Time Favorites"];
      var check_eventSubCategory = AlleventSubCategory.includes(this.eventSubCategory);

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
      else if (!check_eventSubCategory) {
        this.router.navigate([], {
          queryParams: {
            'event_category': this.eventCategory,
            'event_sub_category': 'Upcoming',
            'tag_list': '',
            'page': '1'
          }
        })
      }
      else if (isNaN(this.page)) {
        this.router.navigate([], {
          queryParams: {
            'event_category': this.eventCategory,
            'event_sub_category': this.eventSubCategory,
            'tag_list': this.tagList,
            'page': '1'
          }
        })
      }


      this.commonservice.getTags().subscribe((res) => {
        let data = res['data'];
        let tags_array = data['tags'];
        let array_tagparams = this.tagList.split(',');
        let tag_exist = true;
        for (let tag of array_tagparams) {
          var check_tags = tags_array.includes(tag);
          if (!check_tags && tag !== '') {
            tag_exist = false;
            break;
          }
        }
        if (!tag_exist) {
          this.router.navigate([], {
            queryParams: {
              'event_category': 'ALL_EVENTS',
              'event_sub_category': 'Upcoming',
              'tag_list': '',
              'page': '1'
            }
          })
        }
      }, (err) => {
        // console.log(err);
      })

    }, err => {
      // console.log('err', err);
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


}
