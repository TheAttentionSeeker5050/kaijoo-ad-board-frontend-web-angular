import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../templates/header/header.component';
import { FooterComponent } from '../templates/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { LocalStorageService } from '../services/LocalStorage.service';
import { HttpClientService } from '../services/HttpClient.service';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { AuthService } from '../services/Auth.service';
import { ModalDeletePostComponent } from '../templates/modal-delete-post/modal-delete-post.component';
import { ImageService } from '../services/Image.service';

@Component({
  selector: 'app-post-by-id',
  templateUrl: './post-by-id.component.html',
  styleUrls: ['./post-by-id.component.sass'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, FooterComponent, CommonModule, ModalDeletePostComponent],
  providers: [LocalStorageService, HttpClientService]
})
export class PostByIdComponent implements OnInit {
  title: string = '';

  errorMessage: string = '';

  // These state variables are to verify if the user is the owner of the post
  userId: number | null = null;
  isOwner: boolean = false;

  // The token is stored in the local storage
  token: string = '';

  postId: number | null = null; // Post ID from the route

  // This is a empty object that will be populated with the data from the API
  adPost: ClassifiedAdsItem = <ClassifiedAdsItem>{};

  // This state variable is to control the visibility of the delete modal
  populateDeleteModal: boolean = false;

  // Check if can go back
  canGoBack: boolean = false;

  constructor(
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private imageService: ImageService,
  ) {
    // Check if can go back
    this.checkCanGoBack();
  }

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));

    if (!this.postId) {
      this.errorMessage = 'Could not find the post';

      return;
    }

    this.populateClassifiedAd();
  }

  populateClassifiedAd() {
    this.httpClientService.get(`posts/by-id/${this.postId}`)
      .subscribe({
        next: (response: any) => {
          this.adPost = response.data;
          this.title = `Classified: ${this.adPost.title}`;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          this.getCurrentUser();
        }
      });
  }

  getCurrentUser() {
    this.authService.viewProfile().subscribe({
      next: (response: any) => {
        this.userId = response.id;
      },
      error: (error) => {
        this.userId = null;
      },
      complete: () => {
        this.checkIfOwner(); // Check ownership after setting userId
      }
    });
  }

  checkIfOwner() {
    this.isOwner = this.userId === this.adPost.owner?.id;
  }

  openDeleteModal(){
    this.populateDeleteModal = true;
  }

  closeDeleteModal() {
    this.populateDeleteModal = false;
  }

  confirmDelete() {
    this.token = this.localStorageService.get('token') || '';
    this.httpClientService.delete(`posts/by-id/${this.adPost.id}`, this.token).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete post';
        this.closeDeleteModal();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  checkCanGoBack() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.canGoBack = event.urlAfterRedirects !== undefined;
      }
    });
  }

  getPostThumbnailUrl() {
    console.log("Thumbnail url: ", this.imageService.getPostThumbnailUrl(this.adPost.thumbnail));
    return this.imageService.getPostThumbnailUrl(this.adPost.thumbnail);
  }
}
