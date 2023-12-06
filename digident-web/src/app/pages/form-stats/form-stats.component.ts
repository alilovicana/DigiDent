import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoaderService } from 'src/app/services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { CorrelationService } from 'src/app/services/correlation.service';
import { CsvService } from 'src/app/services/csv.service';

@Component({
  selector: 'app-form-stats',
  templateUrl: './form-stats.component.html',
  styleUrls: ['./form-stats.component.scss']
})
export class FormStatsComponent {

  constructor(
    public $route : ActivatedRoute,
    public $firestore : AngularFirestore,
    public $loader : LoaderService,
    public $correlation : CorrelationService,
    public $csv : CsvService,
    public $router : Router
  ) {
    this.formId = this.$route.snapshot.paramMap.get('id') as string;
    this.$firestore.doc(`forms/${this.formId}`).get().toPromise().then(doc => {
      this.form = doc.data();
      this.formName = this.form.name;
      this.questions = this.form.questions;
    })
    this.$firestore.collection(`forms/${this.formId}/submissions`).get().toPromise().then(snaps => {
      this.submissions = snaps.docs.map(doc => doc.data());

      this.displayedColumns = this.questions.map((q : any) => `#${q.number + 1} - ${q.label}`);
      this.displayedColumns.unshift('Submitted');
      this.displayedColumns.push('Heart Rate');
      this.displayedColumns.push('Blood Oxygenation');
      this.displayedColumns.push('Skin Temperature');
      this.displayedColumns.push('Edit');

      let data = this.submissions.map((sub : any) => {
        let res = {} as any;
        sub.questions.forEach((q : any) => {
          res[`#${q.number + 1} - ${q.label}`] = q.value;
        });
        res['id'] = sub.id;
        res[`Submitted`] = new Date(sub.date).toLocaleDateString();
        res['Heart Rate'] = sub.biometrics.heartRate == -1 ? 'Not measured' : sub.biometrics.heartRate  + ' BPM';
        res['Blood Oxygenation'] = sub.biometrics.bloodOxygenation == -1 ? 'Not measured' : sub.biometrics.bloodOxygenation + ' %';
        res['Skin Temperature'] = sub.biometrics.skinTemperature == -1 ? 'Not measured' : sub.biometrics.skinTemperature + ' °C';
        return res;
      })

      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.correlations = this.$correlation.calculateCorrelationMatrix(this.submissions.map(s => {
          let data = s.questions.map(q => q.code)
          data.push(s.biometrics.heartRate);
          data.push(s.biometrics.bloodOxygenation);
          data.push(s.biometrics.skinTemperature);
          return data;
        }));
    })
   }

   public formId : any;
   public form : any;
   public formName : any;
   public formSubmissions : any;
   public submissions : any;
   public questions : any;





  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  public barChartOptions: ChartOptions = { responsive: true, showLines: false, defaultColor: '#1fc9f2'};
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', backgroundColor: '#1fc9f2' }
  ];

  correlations : any;

  selectedQuestion : any;
  questionAnalyzeable = false;
  updateTable(selectedQuestionIndex){
    if(['range', 'dropdown', 'radio', 'check'].includes(this.form.questions[selectedQuestionIndex].type)){
      this.questionAnalyzeable = true
      let options;
      let data;
      if(this.form.questions[selectedQuestionIndex].type == 'check'){
        options = ['yes', 'no'];
        data = [0, 0];
      } else {
        options = this.form.questions[selectedQuestionIndex].options.split(",").map(s => s.trim());
        data = Array(options.length).fill(0);
      }
      this.submissions.map(submission => {
        return submission.questions[selectedQuestionIndex];
      }).forEach(answer => {
        if(this.form.questions[selectedQuestionIndex].type == 'check')
          data[answer.value] = data[answer.value] + 1;
        else
          data[options.indexOf(answer.value)] = data[options.indexOf(answer.value)] + 1;
      });

      this.barChartLabels = options;
      this.barChartData = [{data, label: 'submissions', backgroundColor: '#1fc9f2'}]
    } else {
      this.questionAnalyzeable = false;
    }
  }

  edit(row){
    this.$router.navigate([`/form-fill/${this.form.id}/${row.id}`]);
    console.log(row);
  }

  exportBarChartAsCSV(){
    this.$csv.exportCsv([
      this.barChartLabels,
      this.barChartData[0].data
    ])
  }

  exportCorrelationMatrixAsCSV(){
    this.$csv.exportCsv(
      this.correlations
    )
  }

  exportDataTableAsCSV(){
    this.$csv.exportCsv([
      this.displayedColumns,
      ...this.dataSource.data.map(obj => Object.values(obj))
     ])
  }
}
