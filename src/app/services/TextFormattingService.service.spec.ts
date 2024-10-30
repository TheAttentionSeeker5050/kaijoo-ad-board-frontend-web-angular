/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TextFormattingServiceService } from './TextFormattingService.service';

describe('Service: TextFormattingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextFormattingServiceService]
    });
  });

  it('should ...', inject([TextFormattingServiceService], (service: TextFormattingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
