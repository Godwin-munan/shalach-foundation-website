import { Component } from '@angular/core';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
 selectedImage: GalleryItem | null = null;
  hoveredIndex: number | null = null;

  communityOutreach: any =
  {
    title: "Community Outreach",
      description: "Bringing hope to communities in need",
      icon: "users",
      color: "from-teal-500 to-cyan-600"
    };

  educationPrograms: any =
  {
      title: "Education Programs",
      description: "Empowerment through learning",
      icon: "graduation-cap",
      color: "from-purple-500 to-indigo-600"
    };

  healthcareServices: any =
  {
      title: "Healthcare Services",
      description: "Providing medical care to all",
      icon: "heart-pulse",
      color: "from-pink-500 to-rose-600"
  };

  foodDistribution: any =
  {
      title: "Food Distribution",
      description: "Fighting hunger one meal at a time",
      icon: "utensils",
      color: "from-amber-500 to-orange-600"
  };

  cleanWaterInitiative: any =
  {
      title: "Clean Water Initiative",
      description: "Access to clean water for all",
      icon: "hand-heart",
      color: "from-cyan-500 to-blue-600"
  };

  galleryImages: GalleryItem[] = [
    {
      id: 1,
      image: '/images/gallery/outreach-group-photo.jpg',
      ...this.communityOutreach
    },
    {
      id: 2,
      image: '/images/gallery/man-with-outreach-items.jpg',
      ...this.communityOutreach
    },
    {
      id: 3,
      image: '/images/gallery/man-helping-with-writting-material.jpg',
      ...this.healthcareServices
    },
    {
      id: 4,
      image: '/images/gallery/man-and-woman-by-the-banner.jpg',
      ...this.communityOutreach
    },
    {
      id: 5,
      image: '/images/gallery/woman-one-picking-gift.jpg',
      ...this.healthcareServices
    },
    {
      id: 6,
      image: '/images/gallery/woman-two-handing-out-gift.jpg',
      ...this.healthcareServices
    },
    {
      id: 7,
      image: '/images/gallery/woman-one-picking-gift.jpg',
      ...this.communityOutreach
    },
    {
      id: 8,
      image: '/images/gallery/woman-two-handing-gift-to-nurse.jpg',
      ...this.healthcareServices
    },
    {
      id: 9,
      image: '/images/gallery/men-handing-out-gift.jpg',
      ...this.communityOutreach
    }
  ];

  openLightbox(item: GalleryItem): void {
    this.selectedImage = item;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }

  setHoveredIndex(index: number | null): void {
    this.hoveredIndex = index;
  }

  getGridSpan(index: number): string {
    // All items are the same size now
    return '';
  }

  getAnimationDelay(index: number): string {
    return `${index * 100}ms`;
  }

}
