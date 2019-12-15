import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SitesComponent } from "./grabber.component";

describe("GrabberComponent", () => {
  let component: SitesComponent;
  let fixture: ComponentFixture<SitesComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ SitesComponent ],
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(SitesComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it("should create", () => {
	expect(component).toBeTruthy();
  });
});
