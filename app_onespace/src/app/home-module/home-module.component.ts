import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';

@Component({
  selector: 'app-home-module',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home-module.component.html',
  styleUrl: './home-module.component.scss',
  encapsulation: ViewEncapsulation.None,
  schemas:[  CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class HomeModuleComponent implements OnInit {

	constructor(public _base: BaseServiceHelper,
		private _webDService: WebDService,
		private _cdr: ChangeDetectorRef
	) { }

	bannerList: any = [];

  
	public BannerSwiper: SwiperConfigInterface = {
		autoplay: {
			delay: 3000, // Slide every 3 seconds (3000ms)
			disableOnInteraction: false, // Keeps autoplay running even after user interaction
		},
		slidesPerView: 1,
		loop: true,
	};

  ngAfterViewInit() {
		this.BannerSwiper = {
			autoplay: {
				delay: 3000, // Slide every 3 seconds (3000ms)
				disableOnInteraction: false, // Keeps autoplay running even after user interaction
			},
			slidesPerView: 1,
			loop: true,
		};
	}


	ngOnInit(): void {
		this.getBanner();
	}

	getBanner() {
		this._webDService.getbanner('all').subscribe((resTypeMaster: any) => {
			this.bannerList = [];
			this.bannerList = Array.isArray(resTypeMaster.data) ? resTypeMaster.data : [];
			this._cdr.detectChanges();
		});
	}
}
