import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

/*
*
* 送り側
* 
* constructor(private interactionService: InteractionService)
*
* this.interactionService.publish('Login');
*
*
* 受け側
*
* constructor(private interactionService: InteractionService)
*
* this.interactionService.event$.subscribe((text) => this.handler(text));
*
*/

@Injectable({
	providedIn: "root",
})

export class InteractionService {

	private subject = new Subject<any>();

	public event$ = this.subject.asObservable();

	public publish(change: any) {
		this.subject.next(change);
	}
}
