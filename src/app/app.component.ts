import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './templates/header/header.component';
import { FooterComponent } from './templates/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Kaijoo: a Kijiji Clone';

  constructor(private router: Router) {}

  // Method to check if the current route matches login or register
  shouldShowHeaderFooter(): boolean {
    // Hide header/footer on login or register routes
    return !(this.router.url === '/login' || this.router.url === '/register');
  }
}
