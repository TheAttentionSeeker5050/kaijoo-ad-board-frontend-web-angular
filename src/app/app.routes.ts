import { Routes } from '@angular/router';
// import components to bind to routes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PostsComponent } from './posts/posts.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Kaijoo: a Kijiji Clone' },
  { path: 'login', component: LoginComponent, title: 'Kaijoo - Login' },
  { path: 'register', component: RegisterComponent, title: 'Kaijoo - Register' },
  { path: 'posts', component: PostsComponent, title: 'Kaijoo - Posts' },
  { path: 'categories', component: CategoriesComponent, title: 'Kaijoo - Categories' },
  { path: 'profile', component: ProfileComponent, title: 'Kaijoo - Profile' },
];
