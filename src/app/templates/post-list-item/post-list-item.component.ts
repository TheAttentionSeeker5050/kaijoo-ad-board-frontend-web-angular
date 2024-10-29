import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClassifiedAdsItem } from '../../../models/ClassifiedAd.model';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.sass'],
  standalone: true,
  imports: [CommonModule, RouterLink],

})
export class PostListItemComponent implements OnInit {
  @Input() ad!: ClassifiedAdsItem;

  constructor(
    // private authService: AuthService,
    // private router: Router,
    // private httpClientService: HttpClientServiceService,
    private sanitizer: DomSanitizer  // Inject DomSanitizer
    // private localStorageService: LocalStorageServiceService
  ) { }

  ngOnInit() {
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
