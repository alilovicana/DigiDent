import { Injectable, ɵConsole } from '@angular/core';
//@ts-ignore
import * as calculateCorrelation from 'calculate-correlation';

@Injectable({
  providedIn: 'root'
})
export class CorrelationService {

  constructor() { }

  test = [
    [-1, 0, 3, 1, 1, -1, 4, 2],
    [-1, 0, 2, 0, 3, -1, 3, 2],
    [-1, 1, 1, 1, 2, -1, 4, 2],
    [-1, 0, 3, 0, 1, -1, 4, 3],
    [-1, 1, 2, 1, 2, -1, 1, 2],
  ]

  public calculateCorrelationMatrix(data : number[][]){
    console.log(data);
    let results = [] as number[][];
    let transposition = data[0].map((_, colIndex) => data.map(row => row[colIndex]));

    const x = [2, 5, 4, 1];
    const y = [3, 3, 6, 7];

    const correlation = calculateCorrelation(x, y);
    console.log(correlation)

    let numberOfQuestions = data[0].length;
    for(let i = 0; i < numberOfQuestions; i++){
      results.push([]);
      for(let j = 0; j < numberOfQuestions; j++){
        // if(transposition[i][0] == -1 || transposition[j][0] == -1) {
        //   results[i][j] = -1;
        // } else {
          results[i][j] = +calculateCorrelation(transposition[i], transposition[j]).toFixed(2);
          if(isNaN(results[i][j])) results[i][j] = 'NaN' as any
        // }
      }
    }

    console.log(results)
    return results;
  }

  public mapCorrelationToColor(correlation){
    if(correlation == -1)
      return '#FAFAFA'
    return `#1fc9f2${Math.floor(Math.abs(correlation) * 255).toString(16)}`;
  }
}
