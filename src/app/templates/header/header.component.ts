import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalStorageServiceService } from '../../services/LocalStorageService.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.sass'],
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  providers: [LocalStorageServiceService]
})
export class HeaderComponent {

  constructor(private localStorageService: LocalStorageServiceService) {
    this.localStorageService.clearIfExpired();
  }

  // Method to either display Profile or Login in the header
  isUserLoggedIn(): boolean {
    // Check if the user has a token in local storage, this does not check if the token is valid, just if it exists
    return !!this.localStorageService.get('token') || (new Date(this.localStorageService.get('expirationDate') || new Date(Date.now() + 10000000000)) < new Date());
  }


}
