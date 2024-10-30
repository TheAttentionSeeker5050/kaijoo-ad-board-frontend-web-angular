import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../services/LocalStorage.service';
import { HttpClientService } from '../services/HttpClient.service';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';

import { PostListItemComponent } from '../templates/post-list-item/post-list-item.component';
import { ImageService } from '../services/Image.service';

// Make a data structure for the posts items


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AsyncPipe, PostListItemComponent],
  providers: [LocalStorageService, HttpClientService]
})
export class PostsComponent implements OnInit {

  constructor(
    private httpClientService: HttpClientService,
    private imageService: ImageService,
  ) { }

  adsList : ClassifiedAdsItem[] = [];

  errorMessage: string = '';

  ngOnInit() {
    this.populateClassifiedAds();
  }

  populateClassifiedAds() {
    // use the http client to populate the classified ads
    this.httpClientService.get("posts")
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

}
