/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientServiceService } from './HttpClientService.service';

describe('Service: HttpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientServiceService]
    });
  });

  it('should ...', inject([HttpClientServiceService], (service: HttpClientServiceService) => {
    expect(service).toBeTruthy();
  }));
});
