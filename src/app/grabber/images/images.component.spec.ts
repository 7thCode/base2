import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ImagesComponent } from "./grabber.component";

describe("GrabberComponent", () => {
  let component: ImagesComponent;
  let fixture: ComponentFixture<ImagesComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ ImagesComponent ],
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(ImagesComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it("should create", () => {
	expect(component).toBeTruthy();
  });
});
