import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { VerifyEmailComponent } from './auth/verify-email.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './admin/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { StagiairesComponent } from './admin/stagiaires.component';
import { UniversitesComponent } from './admin/universites.component';
import { TypesStageComponent } from './admin/types-stage.component';
import {AffectationsComponent} from './admin/affectations.component'
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/stagiaires', component: StagiairesComponent, canActivate: [AuthGuard] },
  { path: 'admin/universites', component: UniversitesComponent, canActivate: [AuthGuard]  },
  { path: 'admin/types-stage', component: TypesStageComponent, canActivate: [AuthGuard] },
  { path: 'admin/affectations', component: AffectationsComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
