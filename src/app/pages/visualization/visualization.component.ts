import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanService } from '../loan.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';




@Component({
  selector: 'app-chart',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})


export class VisualizationComponent implements OnInit {
  isLoader: boolean = true
  schedule: any = []
  chart: Chart | undefined;
  constructor(
    private loanService: LoanService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loanService.loanSchedule$.subscribe((res: any) => {
      this.schedule = res;
      this.isLoader = true
      if (this.schedule?.length) {
        setTimeout(() => {
          this.getChart();
        }, 1000);
        this.isLoader = false;

      } else {
        this.router.navigate(['loan']);
        this.isLoader = false;
      }
    })
  }

  back() {
    this.router.navigate(['loan'])

  }

  getChart() {
    Chart.register(...registerables);
    const labels = this.schedule.map((payment: any) => `Month ${payment.month}`);
    const principalData = this.schedule.map((payment: any) => this.parseNumber(payment.principalPayment));
    const interestData = this.schedule.map((payment: any) => this.parseNumber(payment.interestPayment));
    const remainingBalanceData = this.schedule.map((payment: any) => this.parseNumber(payment.remainingBalance));

    const ctx = (document.getElementById('loanChart') as HTMLCanvasElement).getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Principal Payment',
              data: principalData,
              backgroundColor: "#FF692E",
              borderWidth: 1
            },
            {
              label: 'Interest Payment',
              data: interestData,
              backgroundColor: "#008FFB",
              borderWidth: 1
            },
            {
              label: 'Remaining Balance',
              data: remainingBalanceData,
              backgroundColor: "#00E396",
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    }

    this.isLoader = false
  }


  parseNumber(value: any): number {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
