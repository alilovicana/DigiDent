import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AccountService } from 'src/app/services/account.service';
import { CorrelationService } from 'src/app/services/correlation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public $account : AccountService,
    private $functions : AngularFireFunctions,
    private $coorelation : CorrelationService,
    public $firestore : AngularFirestore
  ) { }

  ngOnInit(): void {
  }
  
  // doIt(){
  //   console.log("started...")
  //   this.$firestore.collection(`forms/XYoc37bGqhpTHc8xbaMs/submissions`).get().toPromise().then(async data => {
  //     console.log("got data...")
  //     let res = data.docs.map(d => d.data());

  //     for (let i = 0; i < res.length; i++) {
  //       console.log(i)
  //       const element = res[i] as any;
  //       element.id = 20000 + i;
  //       element.date = (new Date(new Date(element.date).getTime() + 360000)).toISOString();
  //       element.questions[2].value = (+element.questions[2].value + 1).toString();
  //       element.questions[2].code = +element.questions[2].value + 1;
  //       await this.$firestore.doc(`forms/XYoc37bGqhpTHc8xbaMs/submissions/${element.id}`).set(element)
  //     }
  //   })
  // }
}
