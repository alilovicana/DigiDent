import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Route, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoaderService } from 'src/app/services/loader.service';
import { NgxMatFileInputComponent } from '@angular-material-components/file-input';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Form } from 'src/app/models/form';
import { Question } from 'src/app/models/question';
import { style } from 'd3';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss'],
})
export class FormEditComponent implements OnInit {
  constructor(
    private $route: ActivatedRoute,
    private $firestore: AngularFirestore,
    private $loader: LoaderService,
    private $storage: AngularFireStorage
  ) {
    this.$route.params.subscribe((params) => {
      this.formId = params['id'];
      this.initialiseState(); // reset and set based on new parameter this time
   
    });
  }

  initialiseState() {
    this.$firestore
      .doc(`forms/${this.formId}`)
      .get()
      .toPromise()
      .then((doc) => {
        this.form = doc.data() as Form;
        this.questions = this.form.questions;
        this.steps = [];
        Array.from(Array(this.form.steps)).forEach(() => {
          this.steps.push([]);
        });
        this.questions.forEach((question) => {
          this.steps[question.step].push(question);
        });
      });
  }

  public formId: string;
  public form: Form;

  ngOnInit(): void {
  
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.recalculateQuestionNumbers();
  }
  recalculateQuestionNumbers() {
    let number = 0;
    this.steps.forEach((data, step) => {
      data.forEach((question) => {
        question.step = step;
        question.number = number;
        number++;
      });
    });
  }

  public questions: Question[];
  public steps: Question[][];
  public disable: boolean = false;
  public active: boolean;

  addStep() {
    this.steps.push([]);
  }
  toggleBoxBreathing() {
      this.disable = !this.disable;
      if (this.disable) {
        alert('You successfully added Box Breathing step');
        this.form.boxbreathing = true;
      } else {
        alert('You successfully removed Box Breathing step');
        this.form.boxbreathing = false;
      }
  }

  addField(i: number) {
      let question = {
        number: this.questions.length,
        step: i,
        label: '',
        description: '',
        placeholder: '',
        type: '',
        required: false,
      } as Question;
      this.questions.push(question);
      this.steps[i].push(question);
      this.recalculateQuestionNumbers();
  }

  removeStep(i: number) {
    this.steps[i].forEach((question) => {
      this.questions.splice(question.number, 1);
    });
    this.steps.splice(i, 1);
  }

  removeField(i: number, j: number) {
    this.questions.splice(this.steps[i][j].number);
    this.steps[i].splice(j, 1);
  }

  publish() {
    this.$loader.start();
    this.form.status = 'open';
    this.$firestore
      .doc(`forms/${this.formId}`)
      .update({
        status: 'open',
      })
      .then(() => {
        this.$loader.stop();
      });
  }

  close() {
    this.$loader.start();
    this.form.status = 'closed';
    this.$firestore
      .doc(`forms/${this.formId}`)
      .update({
        status: 'closed',
      })
      .then(() => {
        this.$loader.stop();
      });
  }

  save() {
    this.$loader.start();
    this.$firestore
      .doc(`forms/${this.formId}`)
      .update({
        name: this.form.name,
        steps: this.steps.length,
        questions: this.steps.reduce((acc, cur) => {
          return acc.concat(cur);
        }, []),
        boxbreathing: this.form.boxbreathing? true: false,
      })
      .then(() => {
        this.$loader.stop();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  file: any;
  @ViewChild('fileInput') fileInput: NgxMatFileInputComponent;
  upload(file: any) {
    this.$loader.start();
    const randomId = Math.random().toString(36).substring(2);
    let ref = this.$storage.ref(randomId);
    let task = ref.put(this.file);
    let uploadProgress = task.then((res) => {
      ref
        .getDownloadURL()
        .toPromise()
        .then((url) => {
          this.$firestore
            .doc(`forms/${this.formId}`)
            .update({
              compliance: url,
            })
            .then(() => {
              this.form.compliance = url;
              this.$loader.stop();
            });
        });
    });
  }
}
