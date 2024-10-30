import { Component, OnInit } from '@angular/core';
import { ClassifiedAdForm, ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../services/LocalStorage.service';
import { HttpClientService } from '../services/HttpClient.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

// Import environment variables
import { environment } from '../../environments/environment';
import { CustomHttpResponseError } from '../../models/CustomHttpResponseError.model';
import { ImageService } from '../services/Image.service';


@Component({
  selector: 'app-add-or-edit-post',
  templateUrl: './add-or-edit-post.component.html',
  styleUrls: ['./add-or-edit-post.component.sass'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, EditorComponent, CommonModule, ReactiveFormsModule],
  providers: [LocalStorageService, HttpClientService, ImageService]
})
export class AddOrEditPostComponent implements OnInit {
  title: string = '';

  errorMessage: string = '';

  tinyMCEApiKey: string = environment.tinyMCEAPIKey;

  canGoBack: boolean = false;

  addOrEditPostForm!: FormGroup;

  token: string = '';

  init: EditorComponent['init'] = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    height: 350,
    resize: false,
  };

  postId: number | null = null; // Post ID from the route

  // To upload the thumbnail
  selectedFile: File | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,

  ) {
    this.checkCanGoBack();
  }

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));

    this.initializeForm();
  }

  initializeForm() {
    this.addOrEditPostForm = this.formBuilder.group({
      title: [''],
      description: [''],
      address: [''],
      thumbnail: [''],
      phone: [''],
      price: [''],
      email: [''],
    });

    // Get the token from the local storage
    this.token = this.localStorageService.get("token") || '';

    // call the populate data if the post id is not null
    if (this.postId) {
      this.populateData();
    }
  }

  goBack(): void {
    this.location.back();
  }

  // populate the form with the data from the server
  populateData() {
    // use http service to get the data from /posts/by-id/:id
    this.httpClientService.get(`posts/by-id/${this.postId}`)
      .subscribe({
        next: (response: any) => {

          // if errorMessage is present, display it
          if (!response.data) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 200);
          }

          this.addOrEditPostForm.patchValue({
            title: response.data.title,
            description: response.data.description,
            address: response.data.address,
            price: response.data.price,
            email: response.data.email,
            phone: response.data.phone,
          });
        },
        error: (error) => {
          // Return the error message depending on the status code
          if (error.status == 401 || error.status == 403) {
            this.errorMessage = 'Could not get the post. Please try again.';
          } else if (error instanceof CustomHttpResponseError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = "Something went wrong. We were unable to add the post.";
          }
        },
        complete: () => {
          // Set the title
          this.title = this.postId
            ? `Edit Classified Ad: ${this.addOrEditPostForm.value.title}`
            : 'Add New Classified Ad';
        }
      });
  }

  submitForm() {
    // if no token, redirect to login
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.addOrEditPostForm.valid) {
      const formData: ClassifiedAdsItem = <ClassifiedAdsItem>{
        title: this.addOrEditPostForm.value.title,
        description: this.addOrEditPostForm.value.description,
        address: this.addOrEditPostForm.value.address,
        phone: this.addOrEditPostForm.value.phone,
        price: this.addOrEditPostForm.value.price,
        email: this.addOrEditPostForm.value.email,
      };

      // send the form data to the server
      // Make an http POST request to the server
      const request = this.postId
        ? this.httpClientService.put(`posts/by-id/${this.postId}`, formData, this.token)
        : this.httpClientService.post("posts", formData, this.token)
        request.subscribe({
          next: (response: any) => {
            // if errorMessage is present, display it
            if (response.errorMessage) {
              // throw an error using custom error class, this is to prevent unwanted errors from being thrown
              // so only get the error message when this error class is thrown
              throw new CustomHttpResponseError(response.errorMessage, 200);
            }

            // If a file was selected, send the multipart request to upload the thumbnail
          if (this.selectedFile && this.postId) {
            const fileData = new FormData();
            fileData.append('thumbnail', this.selectedFile);

            this.httpClientService.postMultipart(`posts/by-id/${this.postId}/edit-thumbnail`, fileData, this.token)
              .subscribe({
                next: () => {
                  this.router.navigate(['/posts']);
                },
                error: (error) => {
                  this.handleError(error);
                }
              });
          } else {
            this.router.navigate(['/posts']);
          }
          },
          error: (error) => {
            this.handleError(error);
          },
          complete: () => {
            // Redirect to the browse ads page /posts
            this.router.navigate(['/posts']);
          }
        });
    }
  }

  checkCanGoBack() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.canGoBack = event.urlAfterRedirects !== undefined;
      }
    });
  }

  // Capture the file from the input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  private handleError(error: any) {
    if (error.status === 401 || error.status === 403) {
      this.errorMessage = 'You are not authorized to add or edit this post. Please login and try again.';
    } else if (error instanceof CustomHttpResponseError) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Something went wrong. We were unable to add the post.';
    }
  }

}
