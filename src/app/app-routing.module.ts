import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LangCheckComponent } from '../app/lang-check/lang-check.component';

const routes: Routes = [
  {
    path: '',
    component: LangCheckComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
