import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './layout/landing/landing/landing.component';
import { TeamComponent } from './pages/team/team.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { DonationComponent } from './pages/donation/donation.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full'
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'gallery',
    component: GalleryComponent
  },
  {
    path: 'donation',
    component: DonationComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, 
    {
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
