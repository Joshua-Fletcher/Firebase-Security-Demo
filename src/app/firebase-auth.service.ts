import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { User, auth } from 'firebase/app';
import { filter, map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import * as crypto from 'crypto-js';
import { AngularFireStorage } from '@angular/fire/storage';
import { CommonService } from './shared/shared.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Injectable()
export class FirebaseAuthService {

  redirectResult: Subject<any> = new Subject<any>();

  constructor(
    public angularFireAuth: AngularFireAuth,
    public platform: Platform,
    private db: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private commonService: CommonService,
    private router: Router,
    private ngZone: NgZone
  ) {
    
  }

  getRedirectResult(): Observable<any> {
    return this.redirectResult.asObservable();
  }
  signOut(): Observable<any> {
    this.commonService.localStorageClear();
    return from(this.angularFireAuth.signOut());
  }

  signInWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

}
