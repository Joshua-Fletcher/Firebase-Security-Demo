import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { CommonService } from '../shared/shared.service';
import { IUser, IUserData } from '../shared/models/user.model';
import { ViewWillEnter } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore'
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-page',
  templateUrl: 'admin-page.page.html',
  styleUrls: ['admin-page.page.scss'],
})
export class AdminPage implements OnInit, ViewWillEnter {

    user: IUser;
    activeUserData: IUserData = null;
    allUsers: IUser[] = [];
    errorMessage: string = null;
    insideErrorMessage: string = null;

    constructor(
        public angularFire: AngularFireAuth,
        public router: Router,
        private ngZone: NgZone,
        private authService: FirebaseAuthService,
        public commonService: CommonService,
        private db: AngularFirestore
    ) {}

    ngOnInit(): void {
    }

    ionViewWillEnter(): void {
        const storageItem = this.commonService.localStorageGet('user');
        if (storageItem) {
            this.user = JSON.parse(this.commonService.localStorageGet('user')) as IUser;
        } else {
            this.user = {   
                email: null,
                role: null,
                id: null

            } as IUser;
        }

        this.commonService.getAllUsers().then((user) => {
            _.each(user.docs, (doc) => {
                this.allUsers.push(doc.data());
            });
        }).catch((err) => {
            this.errorMessage = err;
        });

        // this.commonService.getAllUserData().then((users) => {
        //     _.each(users.docs, (doc) => {
        //         var data = doc.data();
        //         this.allUsers.push(data);
        //     });
        // }).catch((err) => {
        //     this.errorMessage = err;
        // });
    }

    goToUserList(): void {
        this.activeUserData = null;
        this.insideErrorMessage = null;
    }

    displayUser(id: string): void {
        this.db.collection('UserData').doc(id).ref.get().then((user) => {
            this.activeUserData = user.data() as IUserData;
        }).catch((err) => {
            this.insideErrorMessage = err;
        });
    }

    navigateToHomePage(): void {
        this.router.navigate(['user/home']);
    }
    

    logout(): void {
        this.authService.signOut();
        this.ngZone.run(() => {
            this.router.navigate(['']);
        });
    }

}
