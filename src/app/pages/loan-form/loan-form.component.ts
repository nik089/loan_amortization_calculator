import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../loan.service';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent implements OnInit {
  loanForm!: FormGroup;
  submitted: boolean = false;
  loanSchedule: any[] = [];
  showLoader: boolean = false;


  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    public loanService: LoanService ) { }

  ngOnInit() {
    this.loanForm = this.formbuilder.group({
      loanAmount: ['', [Validators.required]],
      interestRate: ['', [Validators.required]],
      loanTerm: ['', [Validators.required]],
      startDate: [''],
      extraPayment: [''],
      paymentFrequency: ['monthly']
    });
  }

  get lf() {
    return this.loanForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanForm.valid) {
      this.submitted = false;
      this.showLoader = false;
      if (this.loanForm.valid) {
        this.showLoader = true;
        const resData = this.loanForm.value;
        this.loanSchedule = this.loanService.generateAmortizationSchedule(resData.loanAmount, resData.interestRate, resData.loanTerm, resData.extraPayment);
        this.loanSchedule = this.changeFormat(this.loanSchedule);
        this.loanForm.reset()
        if (this.loanSchedule?.length) {
          this.router.navigate(['loan', 'schedule-list'])
          this.loanService.setLoanScheduleData(this.loanSchedule);
        }
        this.showLoader = false;
      }
    }
  }

  changeFormat(schedule: any) {
    return schedule.map((data: any) => ({
      month: data.month,
      monthlyPayment: data.monthlyPayment.toFixed(2),
      principalPayment: data.principalPayment.toFixed(2),
      interestPayment: data.interestPayment.toFixed(2),
      remainingBalance: data.remainingBalance.toFixed(2)
    }));
  }

  scheduleList() {
    this.router.navigate(['loan', 'schedule-list'])
  }

  loanChart() {
    this.router.navigate(['loan', 'chart'])

  }
}

