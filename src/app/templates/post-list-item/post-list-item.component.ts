import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ClassifiedAdsItem } from '../../../models/ClassifiedAd.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TextFormattingService } from '../../services/TextFormatting.service';

@Component({
  selector: 'post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.sass'],
  standalone: true,
  imports: [CommonModule, RouterLink],

})
export class PostListItemComponent implements OnInit {
  @Input() ad!: ClassifiedAdsItem;

  // get the getPostThumbnail
  @Input() thumbnailURL!: string;

  constructor(
    private textFormattingService: TextFormattingService
  ) { }

  ngOnInit() {
  }

  getTruncatedDescription(description: string): SafeHtml {
    return this.textFormattingService.getTruncatedDescription(description);
  }

}
