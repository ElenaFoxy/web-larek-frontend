import { Component } from './base/component';
import { bem, ensureElement } from '../utils/utils';
import { Category } from '../types';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	id: string;
	image: string;
	price: number;
	title: string;
	button: boolean;
	category: string;
	description: string;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);

		if (actions.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	setCategory(nameCategory: string) {
		this.toggleClass(
			this._category,
			bem(this.blockName, 'category', nameCategory).name
		);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = this._category.className.split(' ')[0];
		switch (value) {
			case Category.other:
				this.setCategory('other');
				break;
			case Category.softskills:
				this.setCategory('soft');
				break;
			case Category.hardskills:
				this.setCategory('hard');
				break;
			case Category.plusone:
				this.setCategory('additional');
				break;
			case Category.button:
				this.setCategory('button');
				break;
		}
	}

	set price(price: number) {
		if (price) {
			const value = price;
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'бесценно');
			this.setText(this._button, 'Нельзя купить');
			this.setDisabled(this._button, true);
		}
	}

	set button(isAdd: boolean) {
		if (isAdd) {
			this.setText(this._button, 'В корзину');
		} else {
			this.setText(this._button, 'Купить');
		}
	}

	addButoonAction(actions?: ICardActions): void {
		this._button.addEventListener('click', actions.onClick);
	}
}

export interface ICardinBasket {
	index: number;
}

export class CardInBasket extends Card<ICardinBasket> {
	protected _icon: HTMLElement;
	protected _index: HTMLElement;

	constructor(
		blockname: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(blockname, container, actions);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._icon = ensureElement<HTMLElement>(`.basket__item-delete`, container);
	}

	set index(index: string) {
		this.setText(this._index, index);
	}
}
