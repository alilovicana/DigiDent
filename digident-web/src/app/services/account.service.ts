import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  loggedIn : boolean = false;

  constructor(
    private $router: Router,
    private $auth: AngularFireAuth,
    private $loader : LoaderService
  ) {

  }

  registerForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.email]),
    password : new FormControl('',[Validators.minLength(6),Validators.required]),
    confirmPassword : new FormControl('',[Validators.minLength(6),Validators.required])
  }, { validators : (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { notSame: true }
  } });

  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.email]),
    password : new FormControl('',[Validators.minLength(6),Validators.required])
  })

  register(){
    if(this.registerForm.valid){
      this.$loader.start();
      let email = this.registerForm.get('email')!.value;
      let password = this.registerForm.get('password')!.value
      this.$auth.createUserWithEmailAndPassword(email, password).then(user => {
        this.$loader.stop();
        alert("Registration successfull!");
        this.$router.navigate(['login'])
      }).catch(() => {
        this.$loader.stop()
        this.registerForm.reset();
        this.registerForm.markAllAsTouched();
      })
    }
    return false;
  }

  login(){
    if(this.loginForm.valid) {
      this.$loader.start()
      let email = this.loginForm.get('email')!.value;
      let password = this.loginForm.get('password')!.value
      this.$auth.signInWithEmailAndPassword(email, password).then(account => {
        this.$router.navigate(['dashboard/forms'])
        this.$loader.stop();
        this.loggedIn = true;
      }).catch(() => {
        this.$loader.stop()
        this.loginForm.reset();
        this.loginForm.markAllAsTouched();
      })
    }
  }

  logout(){
    this.$auth.signOut();
    this.loggedIn = false;
  }
}
