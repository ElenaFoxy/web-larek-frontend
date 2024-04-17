import { Form } from './common/forms';
import { IOrderForm, IContactsForm, Payment, Events } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
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

		this._online.classList.add('button_alt-active');
		this._offline.addEventListener('click', () => {
			if (this.payOnline) {
				this._online.classList.remove('button_alt-active');
				this._offline.classList.add('button_alt-active');
				this.payOnline = false;
			}
		});
		this._online.addEventListener('click', () => {
			if (!this.payOnline) {
				this._online.classList.add('button_alt-active');
				this._offline.classList.remove('button_alt-active');
				this.payOnline = true;
			}
		});
		if (this._address.value != '') {
			this._button.removeAttribute('disabled');
		} else {
			this._button.setAttribute('disabled', '');
		}

		this._address.addEventListener('input', () => {
			if (this._address.value != '') {
				this._button.removeAttribute('disabled');
			} else {
				this._button.setAttribute('disabled', '');
			}
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
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
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
			if (this._phone.value != '' && this._email.value != '') {
				this._button.removeAttribute('disabled');
			} else {
				this._button.setAttribute('disabled', '');
			}
		});

		this._phone.addEventListener('input', () => {
			if (this._phone.value != '' && this._email.value != '') {
				this._button.removeAttribute('disabled');
			} else {
				this._button.setAttribute('disabled', '');
			}
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
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
