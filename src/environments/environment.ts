// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBase: 'http://localhost:3000/api/',
  apiImage: 'http://localhost:3000/images/',
  downloadimage: 'http://localhost:3000/upload/',
  appName: 'TaskSkate',
  googleAPIKey: 'AIzaSyAC_Sr8Spc8-D5wjzMGlh0EaPHsLhEtxE0',
  labelsUrl: 'http://localhost:4200/assets/labels.json',
  appVersion: 1.1,
  platform: 'web'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
