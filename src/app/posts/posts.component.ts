import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
  standalone: true,
  imports: [],
  providers: []
})
export class PostsComponent implements OnInit {

  constructor() { }

  adsList = [
    {
      id: 1,
      title: 'Ad 1',
      description: 'Description 1',
      price: 100,
      thumbnail: 'https://placehold.co/400x300',
      location: 'New York, NY',
    },
    {
      id: 2,
      title: 'Ad 2',
      description: 'Description 2',
      price: 200,
      thumbnail: 'https://placehold.co/400x300',
      location: 'Los Angeles, CA',
    },
    {
      id: 3,
      title: 'Ad 3',
      description: 'Description 3',
      price: 300,
      thumbnail: 'https://placehold.co/400x300',
      location: 'Chicago, IL',
    },
    {
      id: 4,
      title: 'Ad 4',
      description: 'Description 4',
      price: 400,
      thumbnail: 'https://placehold.co/400x300',
      location: 'Houston, TX',
    },
    {
      id: 5,
      title: 'Ad 5',
      description: 'Description 5',
      price: 500,
      thumbnail: 'https://placehold.co/400x300',
      location: 'Phoenix, AZ',
    },
    {
      id: 6,
      title: 'Ad 6',
      description: 'Description 6',
      price: 600,
      thumbnail: 'https://placehold.co/400x300',
      location: 'Philadelphia, PA',
    },
    {
      id: 7,
      title: 'Ad 7',
      description: 'Description 7',
      price: 700,
      thumbnail: 'https://placehold.co/400x300',
      location: 'San Antonio, TX',
    },
    {
      id: 8,
      title: 'Ad 8',
      description: 'Description 8',
      price: 800,
      thumbnail: 'https://placehold.co/400x300',
      location: 'San Diego, CA',
    },
    {
      id: 9,
      title: 'Ad 9',
      description: 'Description 9',
      price: 900,
      thumbnail: 'https://placehold.co/400x300',
      location: 'Dallas, TX',
    },
    {
      id: 10,
      title: 'Ad 10',
      description: 'Description 10',
      price: 1000,
      thumbnail: 'https://placehold.co/400x300',
      location: 'San Jose, CA',
    }
  ];

  ngOnInit() {
  }

}
