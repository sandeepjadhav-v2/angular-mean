import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  faCoffee = faCoffee;
  appitems = [
    {
      label: 'Home',
      link: '/home',
      icon: 'star_rate'
    },
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'star_rate'
    }, {
      label: 'Master',
      faIcon: 'fab fa-500px',
      items: [
        {
          label: 'School Details',
          link: '/settings/school-details',
          faIcon: 'fab fa-accusoft'
        }, {
          label: 'Academic Year',
          link: '/settings/academic-year',
          faIcon: 'fab fa-accusoft'
        }, {
          label: 'Courses',
          link: '/settings/courses',
          faIcon: 'fab fa-accusoft'
        }, {
          label: 'Designations',
          link: '/settings/designations',
          faIcon: 'fab fa-accusoft'
        }, {
          label: 'Time Table',
          link: '/settings/time-table',
          faIcon: 'fab fa-accusoft'
        }, {
          label: 'Classes',
          link: '/settings/classes',
          faIcon: 'fab fa-accusoft'
        }, {
          label: 'Sections',
          link: '/settings/sections',
          faIcon: 'fab fa-accusoft'
        }
      ]
    }, {
      label: 'Manage Staff',
      icon: 'alarm',
      items: [
        {
          label: 'Staff',
          link: '/settings',
          icon: 'favorite'
        },

        {
          label: 'Attendance',
          link: '/settings',
          icon: 'favorite'
        }
      ]
    }, {
      label: 'Manage Student',
      icon: 'alarm',
      items: [
        {
          label: 'Student',
          link: '/settings',
          icon: 'favorite'
        },

        {
          label: 'Attendance',
          link: '/settings',
          icon: 'favorite'
        }
      ]
    }, {
      label: 'Item 3',
      link: '/item-3',
      icon: 'offline_pin'
    },
    {
      label: 'Item 4',
      link: '/item-4',
      icon: 'star_rate'
    }
  ];

  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,
    classname: 'sidebar',
    backgroundColor: `#ffffff`,
    selectedListFontColor: `#3f51b5`,
    highlightOnSelect: true,
    collapseOnSelect: true,
    rtlLayout: false
  };




  constructor() { }

  ngOnInit() {
  }
}
