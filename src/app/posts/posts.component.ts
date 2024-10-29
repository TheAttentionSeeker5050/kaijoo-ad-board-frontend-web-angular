import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';
import { AuthService } from '../services/AuthService.service';
import { HttpClientServiceService } from '../services/HttpClientService.service';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Sanitize the HTML content
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
    // private authService: AuthService,
    // private router: Router,
    private httpClientService: HttpClientServiceService,
    private sanitizer: DomSanitizer  // Inject DomSanitizer
    // private localStorageService: LocalStorageServiceService
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
          // console.log('complete');
        }
      })
  }

  // Use this function to display the tags of the description stored in the database as HTML content
  getTruncatedDescription(description: string): SafeHtml {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const firstParagraph = doc.querySelector('p')?.textContent || '';

    const truncatedText =
      firstParagraph.length <= 250
        ? firstParagraph
        : firstParagraph.substring(0, 250) + '...';

    return this.sanitizer.bypassSecurityTrustHtml(`<p>${truncatedText}</p>`);
  }

}
