//Перечисление способов оплаты
enum Payment {
	online,
	offline,
}

//Перечисление категорий товаров
enum Category {
	softskills,
	hardskills,
	plusone,
	button,
	other,
}

//Карточка товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number;
}

//Информация о заказе
export interface IOrder {
	payment: Payment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

//Данные товара, используемые на главной странице
export type TCardIcon = Pick<ICard, 'title' | 'image' | 'category' | 'price'>;

//Данные товара, используемые в корзине
export type TCardinCart = Pick<ICard, 'title' | 'price'>;

//Данные о контенте модального окна
export interface IModalData {
	content: HTMLElement;
}
