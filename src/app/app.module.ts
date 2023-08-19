import '../polyfills';
import {Injectable, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CreateComponent } from './create/create.component';
import { FillScheduleComponent } from './fill-schedule/fill-schedule.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from './material-module';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { NameDialogComponent } from './fill-schedule/name-dialog/name-dialog.component';
import { ResultsComponent } from './results/results.component';
import { RespondantsDialogComponent } from './results/respondants-dialog/respondants-dialog.component';

@NgModule({ 
  declarations: [
    AppComponent,
    CreateComponent,
    FillScheduleComponent,
    NameDialogComponent,
    ResultsComponent,
    RespondantsDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  entryComponents: [AppComponent,NameDialogComponent, RespondantsDialogComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
