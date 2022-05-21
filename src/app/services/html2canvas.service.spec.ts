import { TestBed } from '@angular/core/testing';

import { Html2canvasService } from './html2canvas.service';

describe('Html2canvasService', () => {
  let service: Html2canvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Html2canvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
