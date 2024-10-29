import { Routes } from '@angular/router';
// import components to bind to routes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PostsComponent } from './posts/posts.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { PostByIdComponent } from './post-by-id/post-by-id.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Kaijoo: a Kijiji Clone' },
  { path: 'login', component: LoginComponent, title: 'Kaijoo - Login' },
  { path: 'register', component: RegisterComponent, title: 'Kaijoo - Register' },
  { path: 'posts', component: PostsComponent, title: 'Kaijoo - Posts' },
  { path: 'posts/:id', component: PostByIdComponent
    // , title: 'Kaijoo - Post'
  },
  { path: 'categories', component: CategoriesComponent, title: 'Kaijoo - Categories' },
  { path: 'profile', component: ProfileComponent, title: 'Kaijoo - Profile' },
  {path: 'logout', component: LogoutComponent, title: 'Kaijoo - Logout'}

];
