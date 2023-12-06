import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private $firestore : AngularFirestore,
    private $router : Router
  ) {
    // this.$router.routeReuseStrategy.shouldReuseRoute = (future, current) => {
    //   return future.outlet == 'dashboard';
    // };

    this.$router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.formId = event.url.split('/')[event.url.split('/').length - 1];
        console.log(this.formId)
      }
    });
    this.forms = this.$firestore.collection('forms').valueChanges()
    
  }
  @ViewChild('outlet') outlet : RouterOutlet;
  forms : Observable<any[]>;
  formId : string = '';
}
