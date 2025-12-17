import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanFormComponent } from './loan-form.component';
import { LoanService } from '../loan.service';

/* -------------------- MOCKS -------------------- */

class MockLoanService {
  generateAmortizationSchedule = jasmine
    .createSpy('generateAmortizationSchedule')
    .and.returnValue([
      {
        month: 1,
        monthlyPayment: 1000,
        principalPayment: 800,
        interestPayment: 200,
        remainingBalance: 9200
      }
    ]);

  setLoanScheduleData = jasmine.createSpy('setLoanScheduleData');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockToastrManager {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
  warning = jasmine.createSpy('warning');
  info = jasmine.createSpy('info');
}

/* -------------------- TEST SUITE -------------------- */

describe('LoanFormComponent', () => {
  let component: LoanFormComponent;
  let fixture: ComponentFixture<LoanFormComponent>;
  let loanService: LoanService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoanFormComponent],
      providers: [
        { provide: LoanService, useClass: MockLoanService },
        { provide: Router, useClass: MockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
    loanService = TestBed.inject(LoanService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  /* -------------------- TEST CASES -------------------- */

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.loanForm).toBeTruthy();
    expect(component.loanForm.controls['loanAmount']).toBeDefined();
    expect(component.loanForm.controls['interestRate']).toBeDefined();
    expect(component.loanForm.controls['loanTerm']).toBeDefined();
  });

  it('should show validation errors when form is invalid', () => {
    component.onSubmit();
    expect(component.submitted).toBeTrue();
    expect(component.loanForm.invalid).toBeTrue();
  });

  it('should call generateAmortizationSchedule and navigate on valid form submission', () => {
    component.loanForm.setValue({
      loanAmount: 10000,
      interestRate: 5,
      loanTerm: 10,
      startDate: '',
      extraPayment: 100,
      paymentFrequency: 'monthly'
    });

    component.onSubmit();

    expect(loanService.generateAmortizationSchedule).toHaveBeenCalled();
    expect(loanService.setLoanScheduleData).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['loan', 'schedule-list']);
  });
});
