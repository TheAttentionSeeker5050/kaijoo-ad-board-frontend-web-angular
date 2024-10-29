import { Component, OnInit } from '@angular/core';
import { ClassifiedAdForm, ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';
import { HttpClientServiceService } from '../services/HttpClientService.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

// Import environment variables
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-add-or-edit-post',
  templateUrl: './add-or-edit-post.component.html',
  styleUrls: ['./add-or-edit-post.component.sass'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, EditorComponent, CommonModule, ReactiveFormsModule],
  providers: [LocalStorageServiceService, HttpClientServiceService]
})
export class AddOrEditPostComponent implements OnInit {
  title: string = '';

  errorMessage: string = '';

  tinyMCEApiKey: string = environment.tinyMCEAPIKey;

  canGoBack: boolean = false;

  addOrEditPostForm!: FormGroup;

  token: string | null = null;

  init: EditorComponent['init'] = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    height: 350,
    resize: false,
  };

  postId: number | null = null; // Post ID from the route



  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageServiceService,
    private httpClientService: HttpClientServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,

  ) {
    this.checkCanGoBack();
  }

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));

    if (!this.postId) {
      return;
    }

    this.initializeForm();
  }

  initializeForm() {
    this.title = 'Add New Classified Ad';

    this.addOrEditPostForm = this.formBuilder.group({
      title: [''],
      description: [''],
      address: [''],
      thumbnail: [''],
      phone: [''],
      price: [0],
      email: [''],
    });

    // Get the token from the local storage
    this.token = this.localStorageService.get("token");
  }

  goBack(): void {
    this.location.back();
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
        thumbnail: this.addOrEditPostForm.value.thumbnail,
        phone: this.addOrEditPostForm.value.phone,
        price: this.addOrEditPostForm.value.price,
        email: this.addOrEditPostForm.value.email,
      };

      // send the form data to the server
    }
  }

  checkCanGoBack() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.canGoBack = event.urlAfterRedirects !== undefined;
      }
    });
  }

}
