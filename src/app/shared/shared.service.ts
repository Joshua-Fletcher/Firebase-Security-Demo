import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PredefinedColors } from '@ionic/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser, IUserData } from './models/user.model';

type DurationType = 'short' | 'med' | 'long';

/**
 * Commonly used utilities & wrapper actions used across all pages & features
 */
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastr: ToastController,
    private location: Location,
    private db: AngularFirestore
  ) { }

  //#region Toastr
  /**
   *
   * @param color
   * @param message
   * @param header
   * @param duration
   */
  async presentToast(color: PredefinedColors, message: string, header: string, duration: DurationType) {
    const toast = await this.toastr.create({
      color,
      message,
      header,
      duration: this.parseDuration(duration),
      keyboardClose: true,
      position: 'top'
    });

    toast.present();
  }

   //#region Toastr
  /**
   *
   * @param color
   * @param message
   * @param header
   * @param duration
   */
   async presentToast2(color: PredefinedColors, message: string, header: string, duration: DurationType) {
    const toast = await this.toastr.create({
      color,
      message,
      header,
      duration: this.parseDuration(duration),
      keyboardClose: true,
      position: 'bottom'
    });

    toast.present();
  }

  clearToast() {
    return this.toastr.dismiss();
  }

  private parseDuration(duration: DurationType): number {
    switch (duration) {
      case 'long': return 5000;
      case 'med': return 3000;
      case 'short': return 1500;
      default: return 3000; //default;
    }
  }
  //#endregion

  //#region Routing by Location
  navigateBack() {
    this.location.back();
  }
  //#endregion

  //#region LocalStorage

  /**
   * Store values in localStorage
   *
   * @param key identifier
   * @param value value to cache
   */
  localStorageSet(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Retrieve a value from Local Storage
   *
   * @param key identifier
   * @returns value from cache
   */
  localStorageGet(key: string): string {
    return localStorage.getItem(key);
  }


  localStorageClear(): void {
    localStorage.clear();
  }

  getAllUserData(): any {
    return this.db.collection<IUserData>('UserData').ref.get();
  }
  
  getAllUsers(): any {
    return this.db.collection<IUser>('Users').ref.get();
  }
  //#endregion
}
