import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlogTopComponent} from './top.component';

describe('BlogComponent', () => {
	let component: BlogTopComponent;
	let fixture: ComponentFixture<BlogTopComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlogTopComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlogTopComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
