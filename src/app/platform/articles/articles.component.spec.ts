import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {beforeEach, describe, expect, it} from "@angular/core/testing/src/testing_internal";


import {ArticlesComponent} from "./articles.component";

describe("ArticlesComponent", () => {
	let component: ArticlesComponent;
	let fixture: ComponentFixture<ArticlesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ArticlesComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ArticlesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
