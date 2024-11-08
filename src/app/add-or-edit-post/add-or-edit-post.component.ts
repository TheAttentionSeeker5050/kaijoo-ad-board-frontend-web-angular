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
import { CustomNavigationService } from '../services/CustomNavigation.service';
import { CategoryRelation } from '../../models/Category.model';
import { SubCategoryRelation } from '../../models/SubCategory.model';
import { TagRelation } from '../../models/Tag.model';


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

  // Categories and subcategories
  categories: CategoryRelation[] = [];
  subCategories: SubCategoryRelation[] = [];
  tags: TagRelation[] = [];
  selectedTags: TagRelation[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private imageService: ImageService,
    private customNavigationService: CustomNavigationService

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
      category: [''],
      subCategory: [''],
      tags: ['']
    });

    // Get the token from the local storage
    this.token = this.localStorageService.get("token") || '';

    // call the populate data if the post id is not null
    if (this.postId) {
      this.populateData();
    } else {
      this.populateCategories();
      this.onCategoryChange({ target: { value: this.addOrEditPostForm.value.category } });
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
            category: response.data.category.id,
            subCategory: response.data.subCategory.id,
          });

          // Set the selected tags
          this.selectedTags = response.data.tags.map((tag: any) => {
            return <TagRelation>{
              id: tag.id,
              name: tag.name
            };
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

          this.populateCategories();
          this.onCategoryChange({ target: { value: this.addOrEditPostForm.value.category } });
        }
      });
  }

  populateCategories() {
    // use http service to get the data from /categories
    this.httpClientService.get('categories/autocomplete-list')
      .subscribe({
        next: (response: any) => {
          // if errorMessage is present, display it
          if (response.errorMessage) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 200);
          }

          // Set the categories
          this.categories = response.data.map((category: any) => {
            return <CategoryRelation>{
              id: category.id,
              name: category.name
            };
          });
        },
        error: (error) => {
          // Return the error message depending on the status code
          if (error.status == 401 || error.status == 403) {
            this.errorMessage = 'Could not get the categories. Please try again.';
          } else if (error instanceof CustomHttpResponseError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = "Something went wrong. We were unable to get the categories.";
          }
        }
    });
  }


  populateTags(tagFilterName: string = '') {
    // use http service to get the data from /tags
    this.httpClientService.get(`tags/autocomplete-list${tagFilterName ? `?name=${tagFilterName}` : ''}`)
      .subscribe({
        next: (response: any) => {
          // if errorMessage is present, display it
          if (response.errorMessage) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 200);
          }

          // Set the tags
          this.tags = response.data.map((tag: any) => {
            return <TagRelation>{
              id: tag.id,
              name: tag.name
            };
          });
        },
        error: (error) => {
          // Return the error message depending on the status code
          if (error.status == 401 || error.status == 403) {
            this.errorMessage = 'Could not get the tags. Please try again.';
          } else if (error instanceof CustomHttpResponseError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = "Something went wrong. We were unable to get the tags.";
          }
        }, complete: () => {
          // the tags that are already selected should not be in the tags list
          this.tags = this.tags.filter((tag) => !this.selectedTags.find((selectedTag) => selectedTag.id === tag.id));
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
        category: {
          id: this.addOrEditPostForm.value.category
        },
        subCategory: {
          id: this.addOrEditPostForm.value.subCategory
        },
        tags: this.selectedTags.map((tag) => {
          return {
            id: tag.id,
            // name: tag.name
          };
        })
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
            if (!this.postId) {
              this.postId = response.itemId;
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

  onCategoryChange(event: any) {
    if (!event.target.value) {
      return;
    }

    // Get the id of the selected category
    const categoryId = event.target.value;

    // Make the request to get the subcategories sub-categories/by-category-id/:id
    this.httpClientService.get(`sub-categories/by-category-id/${categoryId}`)
      .subscribe({
        next: (response: any) => {
          // if errorMessage is present, display it
          if (response.errorMessage) {
            // throw an error using custom error class, this is to prevent unwanted errors from being thrown
            // so only get the error message when this error class is thrown
            throw new CustomHttpResponseError(response.errorMessage, 200);
          }

          // Set the subcategories
          this.subCategories = response.data.map((subCategory: any) => {
            return <SubCategoryRelation>{
              id: subCategory.id,
              name: subCategory.name
            };
          });
        },
        error: (error) => {
          // Return the error message depending on the status code
          if (error.status == 401 || error.status == 403) {
            this.errorMessage = 'Could not get the subcategories. Please try again.';
          } else if (error instanceof CustomHttpResponseError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = "Something went wrong. We were unable to get the subcategories.";
          }
        },
        complete: () => {
        }
      });
  }

  checkCanGoBack() {
    return this.customNavigationService.checkCanGoBack();
  }

  // Capture the file from the input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Resize the selected file before setting it as selectedFile
      this.imageService.resizeImage(file).then((resizedFile) => {
        this.selectedFile = resizedFile;
      }).catch((error) => {
        console.error('Error resizing image:', error);
      });
    }
  }

  onTagInputChange(event: any) {
    // use the populate tags function to get the tags
    this.populateTags(event.target.value);
  }

  addTag(tag: TagRelation) {

    // Push the tag if tag exist and is not already in the selected tags
    if (tag && !this.selectedTags.find((selectedTag) => selectedTag.id === tag.id)) {
      this.selectedTags.push(tag);
    }

    // clear the input field
    this.addOrEditPostForm.patchValue({
      tags: ''
    });

    // Delete the tag from the tags list
    this.tags = this.tags.filter((tagItem) => tagItem.id !== tag.id);

  }

  removeTag(tag: number) {
    // Filter out the tag from the selected tags
    this.selectedTags = this.selectedTags.filter((selectedTag) => selectedTag.id !== tag);
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
