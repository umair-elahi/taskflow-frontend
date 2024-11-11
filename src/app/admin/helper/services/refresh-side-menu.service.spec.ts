/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RefreshSideMenuService } from './refresh-side-menu.service';

describe('Service: RefreshSideMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshSideMenuService]
    });
  });

  it('should ...', inject([RefreshSideMenuService], (service: RefreshSideMenuService) => {
    expect(service).toBeTruthy();
  }));
});
