/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuCountsService } from './menu-counts.service';

describe('Service: MenuCounts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuCountsService]
    });
  });

  it('should ...', inject([MenuCountsService], (service: MenuCountsService) => {
    expect(service).toBeTruthy();
  }));
});
