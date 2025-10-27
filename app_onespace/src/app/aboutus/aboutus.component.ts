import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss'
})
export class AboutusComponent implements OnInit, AfterViewInit {

  activeIndex: number | null = null;
  innerHeights: string[] = [];

  @ViewChildren('inner') innerElements!: QueryList<ElementRef>;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.innerHeights = this.innerElements.map(inner => inner.nativeElement.scrollHeight + 'px');
  }

  faqList = [
    {
      question: "Best Price Guarantee", answer: `Ensuring maximum reach at the most competitive rates.`
    },
    { question: "Real-Time Ad Control", answer: "Update your campaign instantly from anywhere." },
    { question: "Maximum Brand Visibility", answer: "Get noticed across busy streets and crowded hubs." },
    { question: "Advanced LED Technology", answer: "Deliver bright, high-quality visuals that capture attention." },
    { question: "Flexible Booking Options", answer: "Choose vehicle, route, screen, and time—your way." }
  ];


  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

}

