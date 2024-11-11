import { Injectable } from '@angular/core';
import { MenuConstants } from '../menu-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  loginUser(userObj: any) {
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', userObj.accessToken);
  }

  logoutUser() {
    localStorage.clear();
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  getUserName() {
    const userObj = this.getUser();
    return userObj ? userObj.firstName + ' ' + userObj.lastName : null;
  }

  getProfilePicture() {
    const user = this.getUser();
    return user ? user.pictureUrl : null;
  }

  hasUserLoggedIn() {
    return this.getUser();
  }

  getCurrentModule() {
    const moduleName = localStorage.getItem('currentModule');
    if (moduleName) {
      return moduleName;
    }
    return MenuConstants[0].Name;
  }

  setCurrentModule(moduleName: string) {
    localStorage.setItem('currentModule', moduleName);
  }

  generateRandomString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
