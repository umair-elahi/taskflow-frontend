import { Component, OnInit } from '@angular/core';
import { TitleService } from '../helper/services/title.service';
import * as App from '../../../assets/js/theme-fun';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  title: String = 'Dashboard';
  subTitle: String = 'Control Panel';
  constructor(private titleService: TitleService) {

  }

  ngOnInit() {
    App.init();
    this.setTitle();
  }

  setTitle() {
    this.titleService.onSetTitle().subscribe((res) => {
      this.title = res.title;
      this.subTitle = res.subTitle;
    });
  }

}
