import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';
import { HttpClientServiceService } from '../services/HttpClientService.service';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';

import { PostListItemComponent } from '../templates/post-list-item/post-list-item.component';

// Make a data structure for the posts items


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AsyncPipe, PostListItemComponent],
  providers: [LocalStorageServiceService, HttpClientServiceService]
})
export class PostsComponent implements OnInit {

  constructor(
    private httpClientService: HttpClientServiceService,
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

}
