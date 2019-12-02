import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {beforeEach, describe, expect, it} from "@angular/core/testing/src/testing_internal";


import {PagesComponent} from "./pages.component";

describe("FilesComponent", () => {
	let component: PagesComponent;
	let fixture: ComponentFixture<PagesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PagesComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
