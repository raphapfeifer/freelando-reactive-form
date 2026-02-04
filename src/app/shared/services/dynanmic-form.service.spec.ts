import { TestBed } from '@angular/core/testing';

import { DynanmicFormService } from './dynanmic-form.service';

describe('DynanmicFormService', () => {
  let service: DynanmicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynanmicFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
