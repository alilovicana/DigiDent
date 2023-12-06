import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoaderService } from 'src/app/services/loader.service';
import { CdkStepper } from '@angular/cdk/stepper';
import { Guid } from 'guid-typescript';
import { FormControl, Validators } from '@angular/forms';
import { SmartwatchService } from 'src/app/services/smartwatch.service';
import { Question } from 'src/app/models/question';
import { Submission } from 'src/app/models/submission';
import { BoxBreathingService } from 'src/app/services/box-breathing.service';

@Component({
  selector: 'app-form-fill',
  templateUrl: './form-fill.component.html',
  styleUrls: ['./form-fill.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: FormFillComponent }],
})
export class FormFillComponent implements OnInit {
  constructor(
    public $route: ActivatedRoute,
    public $firestore: AngularFirestore,
    public $loader: LoaderService,
    public $smartwatch: SmartwatchService,
    public $playAudio: BoxBreathingService
  ) {
    this.$loader.start();

    this.formId = this.$route.snapshot.paramMap.get('formId') as string;
    this.submissionId = this.$route.snapshot.paramMap.get(
      'submissionId'
    ) as string;

    if (!this.submissionId) {
      this.submissionId = Guid.create().toString();
      this.$firestore
        .doc(`forms/${this.formId}`)
        .get()
        .toPromise()
        .then((doc) => {
          this.form = doc.data();
          this.processQuestions();
          this.$loader.stop();
        });
    } else {
      this.editing = true;
      this.$firestore
        .doc(`forms/${this.formId}`)
        .get()
        .toPromise()
        .then((doc) => {
          this.form = doc.data();
          this.$firestore
            .doc(`forms/${this.formId}/submissions/${this.submissionId}`)
            .get()
            .toPromise()
            .then((doc) => {
              this.submission = doc.data() as Submission;
              this.biometrics = this.submission.biometrics;
              this.processQuestions();
              this.$loader.stop();
            });
        });
    }

    if (this.formId == '640e2httCHXe9Xgd1t6M') {
      this.isBoxBreathing = true;
    }
  }
  isBoxBreathing: boolean = false;
  boxBreathingStepMark: boolean = false;
  middleIndex: any;
  editing = false;
  processQuestions() {
    this.steps = [];
    Array.from(Array(this.form.steps)).forEach(() => {
      this.steps.push([]);
    });
    this.questions = this.form.questions;
    this.form.questions.forEach((question, index) => {
      if (this.editing) {
        question.value = this.submission.questions[index].value;
        question.code = this.submission.questions[index].code;
        question.customValue = this.submission.questions[index].customValue;
      }
      if (question.options)
        question.options = question.options
          .split(',')
          .map((s) => s.trim()) as any;
      this.steps[question.step].push(question);
    });
    this.$loader.stop();
    if (this.isBoxBreathing) {
      this.totalSteps = this.steps.length + 6;
    } else {
      this.totalSteps = this.steps.length + 3;
    }
  }

  ngOnInit(): void {
    this.boxBreathing();
    this.valid = false;
  }

  currentStep = 0;
  totalSteps = 0;
  form: any;
  formId: any;
  submissionId: string;
  submission: any;
  formName: any;
  questions: any;
  steps: any;
  showComponent: boolean = true;
  valid;

  complied = false;
  showMessage: boolean = false;
  boxBreathingStep: number | null;

  boxBreathing() {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      this.showComponent = true;
      this.showMessage = false;
      setTimeout(() => {
        this.valid = true;
      }, 142000);
    } else {
      this.showComponent = false;
      this.showMessage = true;
      this.valid = true;
    }
  }

  //Box breathing  forma

  nextStep() {
    if (this.isBoxBreathing) {
      console.log('current Step ' + this.currentStep);
      if (this.currentStep == 0) {
        console.log("usa u situaciju 1")
        this.currentStep++;
        this.valid = false;
      } else if (this.currentStep == 1) {
        console.log("usa u situaciju 2")
        this.currentStep++;
      } else if (
        this.currentStep > 1 &&
        this.currentStep < 7
      ) {
        console.log("usa u situaciju 3")
        let currentQuestions = this.steps[this.currentStep - 2];
        let valid = true;
        currentQuestions.forEach((question) => {
          if (question.required && !question.value) valid = false;
        });

        if (!valid) {
          alert('Please fill out all required questions');
          this.dirty = true;
        } else {
          if (this.currentStep <= 6) {
            this.currentStep++;
            // if (this.currentStep == this.totalSteps - 1) {
            //   this.valid = false;
            //   if (!this.biometrics) this.getBiometrics();
            // }
          }
        }
        if (this.currentStep == this.steps.length / 2 + 2) {
          this.valid = false;
        }
      } else if (this.currentStep == 7) {
        console.log("usa u situaciju 4")
        this.currentStep++;
        this.valid = false;
        this.complied = false;
      } else if (this.currentStep == 8) {
        console.log("usa u situaciju 5")
        this.valid = false;
        this.currentStep++;
      } else if (this.currentStep == 9) {
        console.log("usa u situaciju 6")
        this.valid = true;
        this.currentStep++;
      } else if (
        this.currentStep > 9 &&
        this.currentStep < 15
      ) {
        console.log("usa u situaciju 7")
        //dinamičko posatvljanje currentQuestions
        let currentQuestions =
          this.steps[this.currentStep - (this.steps.length/2 + 5)];
        let valid = true;
        currentQuestions.forEach((question) => {
          if (question.required && !question.value) valid = false;
        });

        if (!valid) {
          alert('Please fill out all required questions');
          this.dirty = true;
        } else {
          this.currentStep++;
          if (this.currentStep == this.totalSteps - 1) {
            this.valid = false;
            if (!this.biometrics) this.getBiometrics();
          }
        }
      } else if (this.currentStep == this.totalSteps - 1) {
        this.submit();
        this.currentStep++;
      }
    }
    //ako nije boxBreathing
    else{
      if(this.currentStep == 0) {
        this.currentStep ++;
        this.valid = false;
      } else if(this.currentStep == 1 ){
        this.currentStep++;
      } else if(this.currentStep > 1 && this.currentStep < this.totalSteps - 1){
        let currentQuestions = this.steps[this.currentStep - 2];
        let valid = true;
        currentQuestions.forEach(question => {
          if(question.required && !question.value)
            valid = false;
        });
        if(!valid){
          alert("Please fill out all required questions")
          this.dirty = true;
        } else {
          this.currentStep ++;
          if(this.currentStep == this.totalSteps - 1){
            this.valid = false;
            if(!this.biometrics) this.getBiometrics();
          }
        }
      } else if (this.currentStep  == this.totalSteps - 1){
        this.submit()
        this.currentStep++;
      }
    }
  }

  textOpacity5 = false;
  AudioTimer5() {
    this.textOpacity5 = true;
    setTimeout(() => {
      console.log('dvadeset sekundi');
      this.$playAudio.playAudio();
      this.valid = true;
    }, 1000 * 1);
  }
  textOpacity8 = false;
  AudioTimer8() {
    this.textOpacity8 = true;
    setTimeout(() => {
      console.log('dvadeset sekundi');
      this.$playAudio.playAudio();
      this.valid = true;
    }, 1000 * 1);
  }

  public selectedSmartwatch: any;
  public biometrics: any;
  getBiometrics() {
    this.biometrics = undefined;
    this.$smartwatch
      .readBiometrics(this.selectedSmartwatch)
      .then((results) => {
        console.log(results);
        this.biometrics = results;
      })
      .catch(() => {
        alert('error');
      });
  }

  submit() {
    this.$loader.start();

    let questions = this.steps.reduce((acc: any, cur: any) => {
      return acc.concat(cur);
    }, []);
    questions = questions.map((question: any) => {
      if (question.options)
        if (question.value == 'other') {
          question.code = question.options.length;
        } else {
          console.log('heres the problem');
          console.log(question.options);
          console.log(question.value);
          console.log(question.options.indexOf(question.value));
          question.code = question.options.indexOf(question.value);
        }
      if (question.type == 'check') question.code = question.value ? 1 : 0;

      let q = {
        value: question.value ? question.value : 'Not Answered',
        label: question.label,
        number: question.number,
        code: question.code,
      } as any;
      if (question.code === undefined) q.code = -1;
      if (question.customValue) q.customValue = question.customValue;
      return q;
    });

    this.$firestore.doc(`forms/${this.formId}`).update({
      submissions: this.form.submissions + 1,
    });

    console.log(questions);
    this.$firestore
      .doc(`forms/${this.formId}/submissions/${this.submissionId}`)
      .set({
        id: this.submissionId,
        questions: questions,
        biometrics: this.biometrics,
        date: new Date().toISOString(),
      })
      .then(() => {
        this.$loader.stop();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  setValid() {
    this.valid = true;
  }

  measuring = false;
  measurementSubmitted = false;

  dirty = false;

  end() {
    window.close();
  }

  formatSliderLabelFactory(field: any) {
    return function formatSliderLabel(value: number) {
      return `${value} - ${field.values[value]}`;
    };
  }
}
