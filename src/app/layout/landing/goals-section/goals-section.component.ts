import { Component } from '@angular/core';

@Component({
  selector: 'app-goals-section',
  standalone: false,
  templateUrl: './goals-section.component.html',
  styleUrl: './goals-section.component.scss'
})
export class GoalsSectionComponent {

  isContentVisible = false;
  isLeftContentVisible = false;
  isRightContentVisible = false;
  isClicked = false;
  isLeftClicked = false;
  isRightClicked = false;


  onMouseEnter() {
    if (!this.isClicked) {
      this.isContentVisible = true;
    }

    if(!this.isRightClicked){
      this.isRightContentVisible = true;
    }

    if(!this.isLeftClicked){
      this.isLeftContentVisible = true;
    }
  }

  onLeftMouseEnter() {

    if(!this.isLeftClicked){
      this.isLeftContentVisible = true;
    }
  }

  onRightMouseEnter() {
    
    if(!this.isRightClicked){
      this.isRightContentVisible = true;
    }

  }

  onLeftMouseLeave() {

    if(!this.isLeftClicked){
      this.isLeftContentVisible = false;
    }
  }

  onRightMouseLeave() {

    if(!this.isRightClicked){
      this.isRightContentVisible = false;
    }

  }

  onTouchStart(event: TouchEvent) {
    event.stopPropagation(); // Prevents the event from bubbling up
    this.isClicked = !this.isClicked;
    this.isContentVisible = this.isClicked;


  }

  onLeftTouchStart(event: TouchEvent){
    event.stopPropagation();

    this.isLeftClicked = !this.isLeftClicked;
    this.isLeftContentVisible = this.isLeftClicked;
  }

  onRightTouchStart(event: TouchEvent){
    event.stopPropagation();
    
    this.isRightClicked = !this.isRightClicked;
    this.isRightContentVisible = this.isRightClicked;
  }

}
