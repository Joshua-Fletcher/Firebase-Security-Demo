import { Component, NgZone, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { CommonService } from '../shared/shared.service';
import { IUser } from '../shared/models/user.model';
import { AngularFirestore } from '@angular/fire/firestore'
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-documents',
  templateUrl: 'documents.page.html',
  styleUrls: ['documents.page.scss'],
})
export class DocumentsPage implements OnInit, ViewWillEnter {

    user: IUser;

    documents: any[] = [];

    allUsers: IUser[] = [];

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

    accessUpdate(doc: any): void {
        console.log(doc);
        this.db.collection('Documents').doc(doc.id).update({
            Access: doc.Access
        });
    }

    ionViewWillEnter(): void {
        this.documents = [];
        const storageItem = this.commonService.localStorageGet('user');
        if (storageItem) {
            this.user = JSON.parse(this.commonService.localStorageGet('user')) as IUser;
        } else {
            this.user = {   
                email: null,
                role: null,
                id: null,
                department: null
            } as IUser;
        };

        this.commonService.getAllUsers().then((user) => {
            _.each(user.docs, (doc) => {
                this.allUsers.push(doc.data());
            });
        }).catch((err) => {
            console.log(err);
        });

        this.db.collection('Documents').doc('jkdJKW8XpKujCg5vYU8D').get().toPromise().then(doc => {
            this.documents.push(doc.data());
        }).catch((error) => {
            this.documents.push({
                error: error
            } as any);
        });

        this.db.collection('Documents').doc('u8bIc8tgpFhRwuZgPvEt').get().toPromise().then(doc => {
            this.documents.push(doc.data());
        }).catch((error) => {
            this.documents.push({
                error: error
            } as any);
        });

        console.log(this.documents);
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
