import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from '../shared/models/user.model';
import { CommonService } from '../shared/shared.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.page.html',
  styleUrls: ['sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  signInForm: FormGroup;
  submitError: string;
  authRedirectResult: Subscription;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor(
    public angularFire: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,
    private authService: FirebaseAuthService,
    private db: AngularFirestore,
    public commonService: CommonService
  ) {
    this.signInForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    const visits = this.incrementVisits();
  }

  incrementVisits(): void {
    this.db.collection('Visits').doc('AAHvwOr2z3XYTjcD3QhJ').update({
      total_visits: firebase.firestore.FieldValue.increment(1)
    });
  }

  redirectToUserHomePage() {
    this.ngZone.run(() => {
      this.router.navigate(['user/home']);
    });
  }

  resetData() {
    this.signInForm.value['email'] = '';
    this.signInForm.value['password'] = '';
  }

  signUpWithEmail() {
    this.authService.signUpWithEmail(this.signInForm.value['email'].toString(), this.signInForm.value['password'].toString())
    .then(user => {
      const newUser: IUser = {
        id: user.user.uid,
        role: 'admin',
        email: this.signInForm.value['email'].toString(),
        department: 1
      };
      this.db.collection("Users").doc(user.user.uid).set(newUser);

      this.commonService.localStorageSet('user', JSON.stringify(newUser));
      this.resetData();
      this.redirectToUserHomePage();
    }).catch(error => {

    });
  }

  signInWithEmail() {
    this.authService.signInWithEmail(this.signInForm.value['email'].toString(), this.signInForm.value['password'].toString())
    .then(user => {
      this.db.collection("Users").doc(user.user.uid).ref.get().then(doc => {
        const existingUser: IUser = {
          email: doc.data().email.toString(),
          id: user.user.uid.toString(),
          role: doc.data().role.toString(),
          department: doc.data().department.toString()
        };


        this.commonService.localStorageSet('user', JSON.stringify(existingUser));
        this.resetData();
        this.redirectToUserHomePage();
      });
    }).catch(error => {

    });
  }

  fillInfo(email: string): void {
    this.signInForm.get('email').setValue(email);
    this.signInForm.get('password').setValue('Test123456!');
  }

}
