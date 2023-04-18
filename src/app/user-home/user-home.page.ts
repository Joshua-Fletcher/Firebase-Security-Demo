import { Component, NgZone, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { CommonService } from '../shared/shared.service';
import { IUser } from '../shared/models/user.model';

@Component({
  selector: 'app-user-home',
  templateUrl: 'user-home.page.html',
  styleUrls: ['user-home.page.scss'],
})
export class UserHomePage implements OnInit, ViewWillEnter {

    user: IUser;

    constructor(
        public angularFire: AngularFireAuth,
        public router: Router,
        private ngZone: NgZone,
        private authService: FirebaseAuthService,
        public commonService: CommonService
    ) {}

    ngOnInit(): void {
        
    }

    ionViewWillEnter(): void {
        const storageItem = this.commonService.localStorageGet('user');
        console.log(storageItem);
        if (storageItem) {
            this.user = JSON.parse(this.commonService.localStorageGet('user')) as IUser;
        } else {
            this.user = {   
                email: null,
                role: null,
                id: null,
                department: null
            } as IUser;
        }
    }

    navigateToAdminPage(): void {
        this.router.navigate(['admin/user-list']);
    }

    navigateToDocumentsPage(): void {
        this.router.navigate(['documents']);
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
