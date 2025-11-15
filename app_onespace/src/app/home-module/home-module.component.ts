import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
	selector: 'app-home-module',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule],
	templateUrl: './home-module.component.html',
	styleUrl: './home-module.component.scss',
	encapsulation: ViewEncapsulation.None,
	schemas: [CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA]
})
export class HomeModuleComponent implements OnInit {

	constructor(public _base: BaseServiceHelper,
		private _webDService: WebDService,
		private _cdr: ChangeDetectorRef
	) { }

	bannerList: any = [];
	clientList: any = [];
	TypeMaster: any = [];

	goToProduct() {
		this._base._router.navigate(['/product']);
	}
	public BannerSwiper: SwiperConfigInterface = {
		autoplay: {
			delay: 3000, // Slide every 3 seconds (3000ms)
			disableOnInteraction: false, // Keeps autoplay running even after user interaction
		},
		slidesPerView: 1,
		loop: true,
	};
	public ClientSwiper: SwiperConfigInterface = {
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
		this.gettypecategory();
		this.getBanner().then((Res: any) => {
			if (Res) {
				this.getClientBanner();
			}
		})

	}

	getBanner() {
		return new Promise((resolve, rejects) => {
			this._webDService.getbanner('all', 0, 0, 'home_banner').subscribe((resbannerMaster: any) => {
				this.bannerList = [];
				this.bannerList = Array.isArray(resbannerMaster.data) ? resbannerMaster.data : [];
				resolve(true)
				this._cdr.detectChanges();
			}, error => {
				resolve(false)
			});
		});
	}
	getClientBanner() {
		this._webDService.getbanner('all', 0, 0, 'client_logo').subscribe((resTypeMaster: any) => {
			this.clientList = [];
			this.clientList = Array.isArray(resTypeMaster.data) ? resTypeMaster.data : [];
			this._cdr.detectChanges();
		});
	}

	gettypecategory() {
		this._webDService.getcategory('all', 0, 'vehicle_type', 0, 'null', false, 0, 'null', 0, 0).subscribe((resCategory: any) => {
			this.TypeMaster = resCategory.data;
			this.TypeMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
			this.TypeMaster = this.TypeMaster.map((item: any) => ({
				...item,          // keep existing properties
				isChecked: false  // add new key
			}));
			this._cdr.detectChanges();
		});
	}
}
