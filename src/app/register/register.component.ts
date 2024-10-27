import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterModel } from '../../models/Register.model';
import { AuthService } from '../services/AuthService.service';
import { CustomHttpResponseError } from '../../models/CustomHttpResponseError.model';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass', '../global/styles/forms.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AsyncPipe],
  providers: [LocalStorageServiceService]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

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
    // Build the register form with validators
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerData = new RegisterModel(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.confirmPassword,
        this.registerForm.value.name
      );

      // check if the password and confirm password match
      if (registerData.password !== registerData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      // use the user service to register the user
      this.authService.registerUser(registerData.name, registerData.email, registerData.password)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // if errorMessage is present, display it, delete the success message and delete the cookie
          if (response.errorMessage) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 200);
          }

          // if successMessage is present, display it, delete the error message and set the cookie
          if (response.message) {
            // set the success message
            this.successMessage = response.message;
            // delete the error message
            this.errorMessage = '';
          }
        },
        error: (error: any) => {
          // Return the error message depending on the status code
          if (error instanceof CustomHttpResponseError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Something went wrong. We were unable to register you.';
          }

          // delete the success message
          this.successMessage = '';

        },
        complete: () => {
          // delete the cookie
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

          // delete the local storage
          this.localStorageService.remove('token');

          // Redirect to the login page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });

    } else {
      this.errorMessage = 'Form is invalid';
    }
  }

}
