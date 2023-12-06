import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartwatchService {

  constructor(
    private $functions : AngularFireFunctions,
    private $firestore : AngularFirestore
  ) {
    this.smartwatches$ = this.$firestore.collection('smartwatches').valueChanges()
  }

  public smartwatches$ : Observable<any[]>;

  public readBiometrics(id : string){
    return this.$functions.httpsCallable('getSmartwatchData')({smartwatchId: id}).toPromise()
  }
}
