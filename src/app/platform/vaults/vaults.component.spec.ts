import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {VaultsComponent} from "./vaults.component";

describe("FilesComponent", () => {
	let component: VaultsComponent;
	let fixture: ComponentFixture<VaultsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [VaultsComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VaultsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
