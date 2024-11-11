import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReportService {
    constructor(private http: HttpClient) { }

    // my-item
    getMyItemReport(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`report/my-item`).toPromise();
    }

    // user-workload
    getUserWorkloadReport(userId: string): Promise<any> {
        return this.http.get(`report/workload/${userId}`).toPromise();
    }

    // application-timeline
    getApplicationTimelineReport(appId: string, startDate: string, endDate: string): Promise<any> {
        return this.http.get(`report/application/${appId}/time`, { params: { startDate: startDate, endDate: endDate } }).toPromise();
    }

    // application-metrics
    getApplicationMetricsReport(appId: string, startDate: string, endDate: string): Promise<any> {
        return this.http.get(`report/application/${appId}/metrics`, { params: { startDate: startDate, endDate: endDate } }).toPromise();
    }

    // application-location
    getApplicationLocationReport(appId: string, startDate: string, endDate: string): Promise<any> {
        return this.http.get(`report/application/${appId}/location`, { params: { startDate: startDate, endDate: endDate } }).toPromise();
    }

    // user-location
    getUserLocationReport(userId: string, startDate: string, endDate: string): Promise<any> {
        return this.http.get(`user-location-trail`, {
            params: {
                userId: userId,
                startDate: startDate,
                endDate: endDate
            }
        }).toPromise();
    }
}
