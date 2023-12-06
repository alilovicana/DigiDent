import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoxBreathingService {

  constructor() { }
  //main-canva
  phase_time = 4;
  num_of_repetitions=6;
  stages = ['Udahni', 'Zadrži dah', 'Izdahni', 'Zadrži dah'];
  //first-canva
  content=['"Box breathing" je tehnika disanja koja:<br> <br>-smanjuje stres,<br> <br>-poboljšava raspoloženje, <br><br> -omogućava bolju kontrolu nad emocijama', 'PRAVILA: <br> <br> <br> Čitajte naredbe u sredini kvadrata: <br> <br>1) Udahni-udišite zrak 4 sekunde <br> <br>2) Zadrži dah-zadrži dah 4 sekunde <br> <br>3) Izdahni-Izdišite zrak 4 sekunde <br> <br>4) Zadrži dah-zadrži dah 4 sekunde ','Opustite se :)',]


  playAudio() {
    console.log('sound')
      let audio = new Audio();
      audio.src = '../../assets/alarm_classic.mp3';
      audio.load();
      audio.play();
  }
}
