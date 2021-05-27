import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlogArchiveComponent} from './archive.component';

describe('BlogArchiveComponent', () => {
	let component: BlogArchiveComponent;
	let fixture: ComponentFixture<BlogArchiveComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlogArchiveComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlogArchiveComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
