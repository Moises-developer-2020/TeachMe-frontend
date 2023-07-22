import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//use form
import { FormsModule } from "@angular/forms";

//router
import { Routes, RouterModule } from '@angular/router';
//http module service
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LearningComponent } from './components/learning/learning.component';
import { SafePipe } from './components/learning/safe.pipe';

//routers config
const router:Routes=[
  {
    path:'',pathMatch:'full', component:MainComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    FooterComponent,
    LearningComponent,
    SafePipe
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(router),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
