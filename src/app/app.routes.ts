import { Routes } from '@angular/router';
// import components to bind to routes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PostsComponent } from './posts/posts.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'profile', component: ProfileComponent },
];
