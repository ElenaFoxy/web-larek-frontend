import { Model } from './base/model';
import {
	FormErrors,
	IAppState,
	ICard,
	IOrder,
	Payment,
	Events,
	IContactsForm,
	IOrderForm,
} from '../types';

export class AppState extends Model<IAppState> {
	private _cart: string[] = [];
	private _catalog: ICard[];
	private _order: IOrder = {
		payment: Payment.online,
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};

	preview: string | null;
	formErrors: FormErrors = {};

	get cart(): string[] {
		return this._cart;
	}

	set cart(value: string[]) {
		this._cart = value;
	}

	get catalog(): ICard[] {
		return this._catalog;
	}

	set catalog(value: ICard[]) {
		this._catalog = value;
	}

	get order(): IOrder {
		return this._order;
	}

	set order(value: IOrder) {
		this._order = value;
	}

	getTotal(): number {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	getCount(): number {
		return this.cart.length;
	}

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges(Events.CARDS_DISPLAY, { catalog: this._catalog });
	}

	getAddedCards(): ICard[] {
		return this.catalog.filter((item) => this.cart.includes(item.id));
	}

	clear() {
		this.order.items = [];
		this.cart = [];
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit(Events.ORDER_ERROR, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		const regEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
		const regPhone = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regEmail.test(this.order.email)) {
			errors.email = 'Необходимо указать корректный email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!regPhone.test(this.order.phone)) {
			errors.email = 'Необходимо указать корректный телефон';
		}
		this.formErrors = errors;
		this.events.emit(Events.CONTACTS_ERROR, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setOrderField(value: string) {
		this.order.address = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}
}
