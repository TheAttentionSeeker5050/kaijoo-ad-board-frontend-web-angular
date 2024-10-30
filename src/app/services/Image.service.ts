import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

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


  // Resizes the image file to fit within maxWidth and maxHeight constraints
  resizeImage(file: File, maxWidth: number = 600, maxHeight: number = 500): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const reader = new FileReader();
      reader.onload = (event: any) => {
        img.src = event.target.result;
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image.'));
          }
        }, file.type);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

}
