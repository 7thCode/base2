import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GrabberComponent } from "./grabber.component";

describe("GrabberComponent", () => {
  let component: GrabberComponent;
  let fixture: ComponentFixture<GrabberComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ GrabberComponent ],
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(GrabberComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it("should create", () => {
	expect(component).toBeTruthy();
  });
});
