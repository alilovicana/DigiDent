import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  constructor(
    private $firestore : AngularFirestore,
    private $router : Router,
    private $loader : LoaderService
  ) {
    this.forms$ = this.$firestore.collection('forms').valueChanges();
  }

  ngOnInit(): void {
  }

  public forms$ : any;



  public forms = [
    {
      name: 'Southern BIH form',
      status: 'open',
      submissions: 1212,
    }
  ]

  addForm(){
    this.$firestore.collection('forms').add({
      name: 'New Form',
      status: 'editing',
      submissions: 0,
      steps : 0,
      date : new Date().toISOString(),
      questions : []
    }).then((doc) => {
      this.$firestore.doc(`forms/${doc.id}`).update({
        id: doc.id
      })
    })
  }

  removeForm(id : any){
    if(confirm('Are you sure you want to delete this form?\nThe action is irreversible.')){
      this.$loader.start();
      this.$firestore.doc(`forms/${id}`).delete().then(() => {
        this.$loader.stop();
      });
    }
  }

  fillForm(id : string){
    console.log(window.location.hostname)
    window.open('https://digident-dev.web.app/form-fill/'+id, "_blank");
  }

  editForm(id : string){
    this.$router.navigate([`dashboard/form-edit/${id}`])
  }

  statsForm(id : string){
    this.$router.navigate([`dashboard/form-stats/${id}`])
  }
}
