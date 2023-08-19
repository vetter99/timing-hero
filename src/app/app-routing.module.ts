import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { FillScheduleComponent } from './fill-schedule/fill-schedule.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: '', component: CreateComponent},
  { path: ':id', component: FillScheduleComponent },
  { path: ':id/result', component: ResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }