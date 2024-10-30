import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  baseUrl = environment.baseAPIUrl;

  constructor() { }

  // This method is used to get thumbnails
  getPostThumbnailUrl(fileName: string) {
    // If no file name is provided, return a placeholder image
    if (!fileName) {
      return environment.placeholderImage;
    }

    // attempt to make an url from the file name, if it can then return the url, else continue
    try {
      new URL(fileName);
      return fileName;
    } catch {}

    return `${this.baseUrl}/posts/thumbnails/${fileName}`;
  }

}
