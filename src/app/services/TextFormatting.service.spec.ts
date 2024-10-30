/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TextFormattingService } from './TextFormatting.service';

describe('Service: TextFormattingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextFormattingService]
    });
  });

  it('should ...', inject([TextFormattingService], (service: TextFormattingService) => {
    expect(service).toBeTruthy();
  }));
});
