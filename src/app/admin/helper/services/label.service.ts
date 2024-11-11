// // src/app/helper/services/label.service.ts

// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class LabelService {
//   private labelsUrl = environment.labelsUrl;

//   constructor() {}

//   // Save labels to local storage
//   saveLabelsToLocalStorage(labels: any[]) {
//     localStorage.setItem('labels', JSON.stringify(labels));
//   }

//   // Retrieve labels from local storage
//   getLabelsFromLocalStorage() {
//     const labels = localStorage.getItem('labels');
//     return labels ? JSON.parse(labels) : [];
//   }

//   // Sync labels with the server (fetch remote labels)
//   async syncLabels() {
//     try {
//       // Fetch the shared labels.json file (from your server or cloud storage)
//       const response = await fetch(this.labelsUrl);
//       const remoteLabels = await response.json();

//       // Get the labels from local storage
//       const localLabels = this.getLabelsFromLocalStorage();

//       // If the labels differ, update local storage with the remote labels
//       if (JSON.stringify(remoteLabels) !== JSON.stringify(localLabels)) {
//         this.saveLabelsToLocalStorage(remoteLabels);
//       }

//       return remoteLabels;
//     } catch (error) {
//       console.error('Error syncing labels:', error);
//       return this.getLabelsFromLocalStorage(); // Fallback to local storage if fetching fails
//     }
//   }

//   // Add a new label (both to local storage and the server)
//   addLabel(newLabel: { title: string, color: string }) {
//     // Get current labels from local storage
//     let labels = this.getLabelsFromLocalStorage();

//     // Add the new label to the array
//     labels.push(newLabel);

//     // Save the updated labels to local storage
//     this.saveLabelsToLocalStorage(labels);

//     // Optionally, update the server with the new label (if the backend supports it)
//     this.updateLabelsOnServer(labels);
//   }

//   // Simulate updating the labels.json file on the server (You will need an actual API here)
//   async updateLabelsOnServer(labels: any[]) {
//     try {
//       // Assuming you have an endpoint to update the labels on the server
//       await fetch(this.labelsUrl, {
//         method: 'POST', // or PUT depending on your API
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(labels),
//       });
//       console.log('Labels updated on the server');
//     } catch (error) {
//       console.error('Failed to update labels on the server:', error);
//     }
//   }
// }
