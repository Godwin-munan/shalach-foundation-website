import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './layout/landing/landing/landing.component';
import { VisionSectionComponent } from './layout/landing/vision-section/vision-section.component';
import { HeaderSectionComponent } from './layout/landing/header-section/header-section.component';
import { FooterSectionComponent } from './layout/landing/footer-section/footer-section.component';
import { GoalsSectionComponent } from './layout/landing/goals-section/goals-section.component';
import { ClickOutsideDirectiveDirective } from './directives/click-outside-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VisionSectionComponent,
    HeaderSectionComponent,
    FooterSectionComponent,
    GoalsSectionComponent,
    ClickOutsideDirectiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
