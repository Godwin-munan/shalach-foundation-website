import { Component } from '@angular/core';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {

  team: any = [
    {
      image: '/images/team/min/adamaka-min.jpg',
      name: 'Adamaka Umeh M.D',
      position: 'CEO/Co-Founder'
    },
    {
      image: '/images/team/min/rough_gray_background-min.jpg',
      name: 'Grace Kuyahar',
      position: 'COO/Co-Founder'
    },
    {
      image: 'https://avatars.githubusercontent.com/u/26434144?v=4',
      name: 'Godwin N. Jethro',
      position: 'Software Developer'
    },
    {
      image: '/images/team/min/Daniel-min.jpg',
      name: 'Lester Daniel',
      position: 'Designer'
    },
    {
      image: '/images/team/min/Ella-min.jpg',
      name: 'Emmanuella Aror',
      position: 'Administration'
    },
    {
      image: '/images/team/min/rough_gray_background-min.jpg',
      name: 'Regina Raphael',
      position: 'Administration'
    }
  ]

}
