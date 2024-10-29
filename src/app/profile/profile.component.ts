import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/AuthService.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomHttpResponseError } from '../../models/CustomHttpResponseError.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: []
})
export class ProfileComponent implements OnInit {

  // error variable to store error messages
  errorMessage: string = '';

  // make a data variable to store the user data
  userData = {
    name: '',
    email: ''
  }

  latestPosts = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.viewProfile()
    .subscribe({
      next: (response: any) => {
        // if errorMessage is present, display it, delete the success message and delete the cookie
        if (response.errorMessage) {
          // throw an error using custom error class, this is to prevent unwanted errors from being thrown
          // so only get the error message when this error class is thrown
          throw new CustomHttpResponseError(response.errorMessage, 400);
        }

        // Set the user data
        this.userData.name = response.name;
        this.userData.email = response.email;
      },
      error: (error: any) => {
        if (error.status == 401 || error.status == 403) {

          this.errorMessage = "You are not authorized to view this page. Will redirect in in 3 seconds ...";

          // wait 3 seconds before redirecting to login page
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);

          return;
        }

        this.errorMessage = error.message;
      }
    });
  }

}
