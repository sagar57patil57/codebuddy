import { Component, OnInit } from '@angular/core';
import { ContestService } from "../services/contest.service";
import { ToasterService } from '../services/toast.service';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css']
})
export class ContestsComponent implements OnInit {

  contests = [];
  constructor(
    private _contestService: ContestService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {

    this._contestService.getContests().subscribe(response => {
      if (response.success) {
        this.contests = response.data;
        console.log(this.contests)
      }
    });

  }

  getContestLink (link: string) {
    if (!link) {
      return;
    }
    window.open(link, "_blank");
  }

  getColor (link: string) {
    if (link === 'codeforces') {
      return 'mediumpurple';
    } else if (link === 'hackerrank') {
      return 'green';
    } else if (link === 'hackerearth') {
      return '#6495ED';
    }
  }

  isValidDate (date) {
    return !isNaN(new Date(date).getTime());
  }

  reminder (site, title, link, schedule, length) {
    const payload = {
      site,
      title,
      link,
      schedule,
      length
    }
    this._contestService.setReminder(payload).subscribe(response => {
      console.log(response)
      if (response.success) {
        this.toasterService.showSuccess(response.message, '');
      } else {
        this.toasterService.showError(response.message, '');
      }
    });
  }

}
