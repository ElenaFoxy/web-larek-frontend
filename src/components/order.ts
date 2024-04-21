import { Form } from './common/forms';
import { IOrderForm, IContactsForm, Payment, Events } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class OrderForm extends Form<IOrderForm> {
	protected _online: HTMLButtonElement;
	protected _offline: HTMLButtonElement;
	protected _button: HTMLButtonElement;
	protected _address: HTMLInputElement;

	private payOnline = true;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._online = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this._offline = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);
		this._button = this.container.querySelector('button.order__button');
		this._address = this.container.querySelector('input[name="address"]');

		this.toggleCard();
		this._offline.addEventListener('click', () => {
			if (this.payOnline) {
				this.toggleCash();
				this.toggleCard(false);
				this.payOnline = false;
			}
		});
		this._online.addEventListener('click', () => {
			if (!this.payOnline) {
				this.toggleCard();
				this.toggleCash(false);
				this.payOnline = true;
			}
		});
		
		this._address.addEventListener('input', () => {
			this.setDisabled(this._button, this._address.value != '');
		});

		this._button.addEventListener('click', () => {
			const order: IOrderForm = {
				address: this._address.value,
				payment: this.payOnline ? Payment.online : Payment.offline,
			};
			events.emit(Events.CONTACTS_OPEN, order);
		});
	}

	set address(value: string) {
		this._address.value = value;
	}

	toggleCard(state: boolean = true) {
		this.toggleClass(this._online, 'button_alt-active', state);
	}

	toggleCash(state: boolean = true) {
		this.toggleClass(this._offline, 'button_alt-active', state);
	}
}

export class Contacts extends Form<IContactsForm> {
	protected _email: HTMLButtonElement;
	protected _phone: HTMLButtonElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = this.container.querySelector('input[name="email"]');
		this._phone = this.container.querySelector('input[name="phone"]');
		this._button = this.container.querySelector('button');

		this._email.addEventListener('input', () => {
			this.toggleButton(this._phone.value != '' && this._email.value != '');
		});

		this._phone.addEventListener('input', () => {
			this.toggleButton(this._phone.value != '' && this._email.value != '');
		});

		this._button.addEventListener('click', () => {
			const contacts: IContactsForm = {
				email: this._email.value,
				phone: this._phone.value,
			};
			events.emit(Events.ORDER_SUBMIT, contacts);
		});
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
