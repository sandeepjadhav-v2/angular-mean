import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent {
  public gridApi;
  public gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public defaultColGroupDef;
  public columnTypes;
  public rowData: any;

   constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'Athlete',
        field: 'athlete'
      },
      {
        headerName: 'Sport',
        field: 'sport'
      },
      {
        headerName: 'Age',
        field: 'age',
        type: 'numberColumn'
      },
      {
        headerName: 'Year',
        field: 'year',
        type: 'numberColumn'
      },
      {
        headerName: 'Date',
        field: 'date',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 200
      },
      {
        headerName: 'Medals',
        groupId: 'medalsGroup',
        children: [
          {
            headerName: 'Gold',
            field: 'gold',
            type: 'medalColumn'
          },
          {
            headerName: 'Silver',
            field: 'silver',
            type: 'medalColumn'
          },
          {
            headerName: 'Bronze',
            field: 'bronze',
            type: 'medalColumn'
          }
        ]
      }
    ];
    this.defaultColDef = {
      width: 150,
      editable: true,
      filter: 'agTextColumnFilter'
    };
    this.defaultColGroupDef = { marryChildren: true };
    this.columnTypes = {
      numberColumn: {
        width: 83,
        filter: 'agNumberColumnFilter'
      },
      medalColumn: {
        width: 100,
        columnGroupShow: 'open',
        filter: false
      },
      nonEditableColumn: { editable: false },
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: function(filterLocalDateAtMidnight, cellValue) {
            const dateParts = cellValue.split('/');
            const day = Number(dateParts[0]);
            const month = Number(dateParts[1]) - 1;
            const year = Number(dateParts[2]);
            const cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.http
      .get('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json')
      .subscribe(data => {
        this.rowData = data;
      });
  }

}
