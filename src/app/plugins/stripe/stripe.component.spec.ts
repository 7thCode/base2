import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {StripeComponent} from "./articles.component";

describe("ArticlesComponent", () => {
	let component: StripeComponent;
	let fixture: ComponentFixture<StripeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StripeComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StripeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
