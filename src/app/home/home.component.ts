import { CommonModule, AsyncPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientService } from '../services/HttpClient.service';
import { LocalStorageService } from '../services/LocalStorage.service';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { ImageService } from '../services/Image.service';
import { CustomNavigationService } from '../services/CustomNavigation.service';
import { PostTileItemComponent } from '../templates/post-tile-item/post-tile-item.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AsyncPipe, PostTileItemComponent],
  providers: [LocalStorageService, HttpClientService]
})
export class HomeComponent implements OnInit {

  constructor(
    private httpClientService: HttpClientService,
    private imageService: ImageService,
    private location: Location,
    private customNavigationService: CustomNavigationService

  ) {
    // Check if can go back
    this.checkCanGoBack();
  }

  adsList : ClassifiedAdsItem[] = [];

  errorMessage: string = '';

  ngOnInit() {
    this.populateClassifiedAds();
  }

  populateClassifiedAds() {
    // use the http client to populate the classified ads
    this.httpClientService.get("posts/random")
      .subscribe({
        next: (response: any) => {
          this.adsList = response.data;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
        }
      })
  }

  getPostThumbnail(fileName: string) {
    return this.imageService.getPostThumbnailUrl(fileName);
  }

  checkCanGoBack() {
    return this.customNavigationService.checkCanGoBack();
  }

  goBack(): void {
    this.location.back();
  }

}
