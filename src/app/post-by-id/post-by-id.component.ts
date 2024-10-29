import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../templates/header/header.component';
import { FooterComponent } from '../templates/footer/footer.component';
import { CommonModule } from '@angular/common';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';
import { HttpClientServiceService } from '../services/HttpClientService.service';
import { ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { AuthService } from '../services/AuthService.service';
import e from 'express';

@Component({
  selector: 'app-post-by-id',
  templateUrl: './post-by-id.component.html',
  styleUrls: ['./post-by-id.component.sass'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, FooterComponent, CommonModule],
  providers: [LocalStorageServiceService, HttpClientServiceService]
})
export class PostByIdComponent implements OnInit {
  title: string = '';

  errorMessage: string = '';

  // This is a empty object that will be populated with the data from the API
  adPost: ClassifiedAdsItem = <ClassifiedAdsItem>{};

  constructor(
    private httpClientService: HttpClientServiceService,
    private localStorageService: LocalStorageServiceService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.title = 'Post by title';
    this.populateClassifiedAd();

  }

  populateClassifiedAd() {
    this.httpClientService.get("posts/by-id/1")
      .subscribe({
        next: (response: any) => {
          this.adPost = response.data;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          // console.log('complete');
        }
      });
  }

  deletePost() {}
}
