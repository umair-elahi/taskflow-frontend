import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor(private http: HttpClient) { }

  // Coupon
  getCountries(): Promise<any> {
    return this.http.get(`/assets/static-data/countries.json`, {
      params: {
        isWithoutBase: 'yes'
      }
    }).toPromise();
  }

  getStatesByCountryId(countyId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/assets/static-data/states.json`, {
        params: {
          isWithoutBase: 'yes'
        }
      })
      .toPromise()
      .then((res: any) => {
        const states = _.filter(res.states, (o) => o.country_id === countyId);
        return resolve(states);
      })
      .catch(() => reject);
    });
  }

  getCitiesByStateId(stateId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/assets/static-data/cities.json`, {
        params: {
          isWithoutBase: 'yes'
        }
      })
      .toPromise()
      .then((res: any) => {
        const cities = _.filter(res.cities, (o) => o.state_id === stateId);
        return resolve(cities);
      })
      .catch(reject);
    });
  }

}
