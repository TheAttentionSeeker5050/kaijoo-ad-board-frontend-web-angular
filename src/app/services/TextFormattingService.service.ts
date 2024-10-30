import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TextFormattingServiceService {

constructor(
  private sanitizer: DomSanitizer  // Inject DomSanitizer
) { }

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
