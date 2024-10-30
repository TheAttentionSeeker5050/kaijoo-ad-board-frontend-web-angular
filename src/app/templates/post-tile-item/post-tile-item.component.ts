import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextFormattingService } from '../../services/TextFormatting.service';
import { ClassifiedAdsItem } from '../../../models/ClassifiedAd.model';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'post-tile-item',
  templateUrl: './post-tile-item.component.html',
  styleUrls: ['./post-tile-item.component.sass'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class PostTileItemComponent implements OnInit {

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
