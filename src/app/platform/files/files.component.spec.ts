import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {beforeEach, describe, expect, it} from "@angular/core/testing/src/testing_internal";

import {FilesComponent} from "./files.component";

describe("FilesComponent", () => {
	let component: FilesComponent;
	let fixture: ComponentFixture<FilesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FilesComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FilesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
