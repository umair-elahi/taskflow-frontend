import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-location-map-modal',
  templateUrl: './location-map-modal.component.html',
  styleUrls: ['./location-map-modal.component.scss']
})
export class LocationMapModalComponent implements OnInit {

  mapData: any = {
    latitude: null,
    longitude: null,
    title: ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.mapData = {
      latitude: data.latitude,
      longitude: data.longitude,
      title: data.title || 'Map'
    };
  }

  ngOnInit() {
  }
}
