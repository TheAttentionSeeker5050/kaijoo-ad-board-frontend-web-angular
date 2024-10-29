import { Component, OnInit } from '@angular/core';
import { LocalStorageServiceService } from '../services/LocalStorageService.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.sass'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [LocalStorageServiceService]
})
export class LogoutComponent implements OnInit {

  constructor(private localStorageService: LocalStorageServiceService, private router: Router) { }

  ngOnInit() {
    // remove the token from the local storage
    this.localStorageService.remove('token');

    // redirect to the login page after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

}
