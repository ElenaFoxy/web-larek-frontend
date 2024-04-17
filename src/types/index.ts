//карточка товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number;
}

//Перечисление способов оплаты
export enum Payment {
	online = 'Онлайн',
	offline = 'При получении',
}

//Перечисление категорий товаров
export enum Category {
	softskills = 'софт-скил',
	hardskills = 'хард-скил',
	plusone = 'дополнительное',
	button = 'кнопка',
	other = 'другое',
}

//Корзина с товарами
export interface ICart {
	list: ICard[];
	total: number;
	add(item: ICard): void;
	remove(itemId: ICard): void;
	sumTotal(): number;
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

export interface IOrderForm {
	address: string;
	payment: Payment;
}

export interface IContactsForm {
	phone: string;
	email: string;
}

//Тип для описания объекта, содержащий ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Методы работы с API
export interface IWebLarekAPI {
	getProductList(): Promise<ICard[]>; //получить список товаров
	getProduct(id: number): Promise<ICard>; //получить товар по идентификатору
	sendOrder(order: IOrder): Promise<IOrderStatus>; //отправить заказ
}

// Типы состояния приложения
export interface IAppState {
	catalog: ICard[];
	basket: string[];
	order: IOrder | null;
	formErrors: FormErrors[];
}

//Главная страница
export interface IPage {
	counter: number; //счетчик
	catalog: HTMLElement[]; //каталог
	locked: boolean; //блокировщик
}

// Статусы заказа
export interface IOrderStatus {
	status: string;
	totalPrice: number;
}

// Данные о контенте модального окна
export interface IModalData {
	content: HTMLElement;
}

export enum Events {
	CARDS_DISPLAY = 'cards:display', // обновление каталога товаров на странице. Для каждого товара создается новая карточка, которая отображается на странице.
	CARDS_SHOW = 'cards:show', //генерируется при выборе товара. Генерирует класс Card. При нажатии на карточку выбранного товара происходит открытие модального окна с этим товаром. Model -> open(), а затем render().
	ORDER_OPEN = 'order:open', // событие происходит при нажатии кнопки оформления заказа. Открывается форма для заполнения полей заказа - выбор оплаты и адрес.
	CONTACTS_OPEN = 'contacts:open', //открывается форма для заполнения контактов для заказа.
	ORDER_SUBMIT = 'order:submit', // событие подтверждения оформления заказа. Данные заказа после проверки отправляются на сервер.
	CART_OPEN = 'cart:open', //событие происходит при нажатии на корзину (открыть корзину).
	POPUP_OPEN = 'popup:open', // модальное окно открыто, страница блокируется.
	POPUP_CLOSE = 'popup:close', // модальное окно закрыто, страница разблокирована.
	CARD_ADD = 'card:add', // событие добавления товара в корзину.
	CARD_DELETE = 'card:delete', // событие удаления товара из корзины.
	ORDER_ERROR = 'formOrderErrors:change', //проверка полей формы с адресом
	CONTACTS_ERROR = 'formErrors:change', //проверка полей формы с контактами
}
