import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomNavigationService {

  canGoBack: boolean = false;

  constructor(
    private router: Router,
  ) { }

  checkCanGoBack() {
    this.router.events.subscribe((event) => {
      // If there are pages in the history, then the user can go back, even after refreshing the page
      if (event instanceof NavigationEnd) {
        this.canGoBack = event.urlAfterRedirects !== undefined;
      }
    });

    return this.canGoBack;
  }

}
