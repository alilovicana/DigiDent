import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  exportCsv(matrix){
    let csvContent = "data:text/csv;charset=utf-8,";
    matrix.forEach((rowArray) => {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  }
}
