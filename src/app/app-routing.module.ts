import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LangCheckComponent } from '../app/lang-check/lang-check.component';
import { SubPage1Component } from './lang-check/sub-page1/sub-page1.component';

const routes: Routes = [
  {
    path: 'lang-check',
    component: LangCheckComponent
  },
  {
    path: 'sub-page1',
    component: SubPage1Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
