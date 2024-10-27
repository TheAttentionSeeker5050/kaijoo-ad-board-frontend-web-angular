import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../models/Login.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/AuthService.service';
import { Observable } from 'rxjs';
import { CustomHttpResponseError } from '../../models/CustomHttpResponseError.model';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass', '../global/styles/forms.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AsyncPipe],
  providers: [LocalStorageServiceService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  // error variable to store error messages
  errorMessage: string = '';

  // the success message to display
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    // Build the login form with validators
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = new LoginModel(
        this.loginForm.value.email,
        this.loginForm.value.password
      );

      // use the service to authenticate the user
      this.authService.authenticate(loginData.email, loginData.password)
      .subscribe({
        next: (response: any) => {
          // if errorMessage is present, display it, delete the success message and delete the cookie
          if (response.errorMessage) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 200);
          }

          // Set cookie
          document.cookie = `token=${response.authToken};`;

          // Set local storage
          this.localStorageService.set('token', response.authToken);

        },
        error: (error) => {
          // Return the error message depending on the status code
          if (error.status == 401 || error.status == 403) {
            this.errorMessage = 'Invalid email or password';
          } else if (error instanceof CustomHttpResponseError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = "Something went wrong. We were unable to log you in.";
          }

          // delete the success message
          this.successMessage = '';

          // delete the cookie
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

          // delete the local storage
          this.localStorageService.remove('token');
        },
        complete: () => {
          this.successMessage = 'Login successful!';


          // redirect to home after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      });

    } else {
      this.errorMessage = 'Please fill in all fields';
    }
  }
}
