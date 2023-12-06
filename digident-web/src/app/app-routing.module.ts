import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { FormsComponent } from './pages/forms/forms.component';
import { FormEditComponent } from './pages/form-edit/form-edit.component';
import { FormStatsComponent } from './pages/form-stats/form-stats.component';
import { FormFillComponent } from './pages/form-fill/form-fill.component';
import { RegisterComponent } from './pages/register/register.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);;

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'form-fill/:formId', component: FormFillComponent },
  { path: 'form-fill/:formId/:submissionId', component: FormFillComponent },
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: 'forms', component: FormsComponent },
    { path: 'form-edit/:id', component: FormEditComponent },
    { path: 'form-stats/:id', component: FormStatsComponent }
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
