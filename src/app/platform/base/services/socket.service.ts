import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class SocketService {

	private sock: any = null;
	private messageListener: any = null;

	constructor() {
		const address: string = environment.webSocket;
		this.sock = new WebSocket(address);

		this.sock.addEventListener('open', (e: any) => {
			this.onResponse('open', e);
		});

		this.sock.addEventListener('message', (e: any) => {
			this.onResponse('message', e);
		});

		this.sock.addEventListener('close', (e: any) => {
			this.onResponse('close', e);
		});

		this.sock.addEventListener('error', (e: any) => {
			this.onResponse('error', e);
		});
	}

	public addMessageListener(listener: (name: any, event: any) => void): void {
		this.messageListener = listener;
	}

	public onResponse(name: any, event: any): void {
		if (this.messageListener) {
			this.messageListener(name, event);
		}
	}

	public request(data: any): void {
		this.sock.send(data);
	}

}
