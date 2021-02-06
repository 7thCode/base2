import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlogDescriptionComponent} from './description.component';

describe('ProductComponent', () => {
	let component: BlogDescriptionComponent;
	let fixture: ComponentFixture<BlogDescriptionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlogDescriptionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlogDescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
