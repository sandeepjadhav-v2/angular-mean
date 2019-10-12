import { Component, OnInit } from '@angular/core';
import { faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faSearch = faSearch;
  faBell = faBell;
  faUser = faUser;
  constructor() { }

  ngOnInit() {
  }

}
