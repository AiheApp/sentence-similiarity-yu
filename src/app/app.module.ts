import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ParamService } from './service/param-service';
import { AppRoutingModule } from './app-routing.module';
import { LangCheckComponent } from './lang-check/lang-check.component';
import { SubPage1Component } from './lang-check/sub-page1/sub-page1.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    LangCheckComponent,
    SubPage1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [ParamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
