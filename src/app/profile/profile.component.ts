import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/Auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { CustomHttpResponseError } from '../../models/CustomHttpResponseError.model';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { HttpClientService } from '../services/HttpClient.service';
import { LocalStorageService } from '../services/LocalStorage.service';
import { PostListItemComponent } from '../templates/post-list-item/post-list-item.component';
import { CustomNavigationService } from '../services/CustomNavigation.service';
import { ImageService } from '../services/Image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  standalone: true,
  imports: [RouterLink, CommonModule, PostListItemComponent],
  providers: []
})
export class ProfileComponent implements OnInit {

  // error variable to store error messages
  errorMessage: string = '';

  // make a data variable to store the user data
  userData = {
    name: '',
    email: '',
    id: ''
  }

  // make a variable to store the latest posts
  latestPosts: ClassifiedAdsItem[] = [];

  // The token is stored in the local storage
  token: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService,
    private customNavigationService: CustomNavigationService,
    private location: Location,
    private imageService: ImageService
  ) {
    this.checkCanGoBack();
  }

  ngOnInit() {
    this.token = this.localStorageService.get('token') ?? '';
    this.populateProfile();
  }

  populateProfile() {
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
        this.userData.id = response.id;
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
      },
      complete: () => {
        // do nothing
        this.populateLatestPosts();
      }
    });
  }

  populateLatestPosts() {
    this.httpClientService.getWithToken('posts/by-user', this.token)
      .subscribe({
        next: (response: any) => {
          // if errorMessage is present, display it, delete the success message and delete the cookie
          if (!response.data) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 400);
          }

          // Set the user data
          this.latestPosts = response.data;
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
        },
        complete: () => {
          // do nothing
        }
    });
  }

  checkCanGoBack() {
    return this.customNavigationService.checkCanGoBack();
  }

  goBack(): void {
    this.location.back();
  }

  getPostThumbnail(fileName: string) {
    return this.imageService.getPostThumbnailUrl(fileName);
  }

}

