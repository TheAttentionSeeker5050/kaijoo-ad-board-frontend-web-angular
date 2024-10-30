/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomNavigationService } from './CustomNavigation.service';

describe('Service: CustomNavigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomNavigationService]
    });
  });

  it('should ...', inject([CustomNavigationService], (service: CustomNavigationService) => {
    expect(service).toBeTruthy();
  }));
});
