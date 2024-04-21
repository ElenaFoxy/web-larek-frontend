import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/webLarekAPI';
import { AppState } from './components/appData';
import {
	Events,
	ICard,
	Payment,
	IOrderForm,
	IContactsForm,
	IOrderStatus,
} from './types';
import { MainPage } from './components/mainPage';
import { Card, CardInBasket } from './components/card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/modal';
import { OrderForm, Contacts } from './components/order';
import { Basket } from './components/common/basket';
import { Success } from './components/common/success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const mainPage = new MainPage(document.body, events);
const popup = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const cardInBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		popup.close();
		events.emit(Events.CARDS_DISPLAY);
	},
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on(Events.CARDS_DISPLAY, () => {
	mainPage.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.CARDS_SHOW, item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыть карточку товара
events.on(Events.CARDS_SHOW, (item: ICard) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			card.button = true;
			card.addButoonAction({
				onClick: () => {
					events.emit(Events.BASKET_OPEN, item);
				},
			});
			if (!appData.basket.includes(item.id)) {
				events.emit(Events.CARD_ADD, item);
			}
		},
	});

	if (!appData.basket.includes(item.id)) {
		card.button = false;
	} else {
		card.addButoonAction({
			onClick: () => events.emit(Events.BASKET_OPEN, item),
		});
	}

	popup.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		}),
	});
	events.emit(Events.POPUP_OPEN, item);
});

//добавить товар в корзину
events.on(Events.CARD_ADD, (item: ICard) => {
	appData.basket.push(item.id);
	appData.order.items.push(item.id);
	mainPage.counter = appData.getCount();
});

//удалить товар из корзины
events.on(Events.CARD_DELETE, (item: ICard) => {
	appData.basket = appData.basket.filter((basketItem) => basketItem !== item.id);
	appData.order.items = appData.order.items.filter(
		(orderItem) => orderItem !== item.id
	);
	events.emit(Events.BASKET_OPEN);
	mainPage.counter = appData.getCount();
});

//открыть корзину
events.on(Events.BASKET_OPEN, () => {
	popup.render({
		content: basket.render(),
	});
	basket.total = appData.getTotal();
	basket.items = appData.getAddedCards().map((item, num) => {
		const cardInBasket = new CardInBasket(
			'card',
			cloneTemplate(cardInBasketTemplate),
			{
				onClick: () => events.emit(Events.CARD_DELETE, item),
			}
		);
		cardInBasket.index = (num + 1).toString();
		return cardInBasket.render({
			title: item.title,
			price: item.price,
		});
	});
	//if (appData.getCount() == 0) {
		basket.setButtonDisabled(appData.getCount() == 0);
/*	} else {
		basket.setButtonDisabled(false);
	}*/
});

// Открыть форму заказа
events.on(Events.ORDER_OPEN, () => {
	popup.render({
		content: order.render({
			payment: Payment.online,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму заказа c контактами
events.on(Events.CONTACTS_OPEN, (data: IOrderForm) => {
	appData.order.payment = data.payment;
	appData.order.address = data.address;
	popup.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//оформить заказ
events.on(Events.ORDER_SUBMIT, (data: IContactsForm) => {
	appData.order.email = data.email;
	appData.order.phone = data.phone;
	appData.order.total = appData.getTotal();
	const total = appData.order.total;
	api
		.sendOrder(appData.order)
		.then((result: IOrderStatus) => {
			appData.clear();
			mainPage.counter = 0;
			popup.render({
				content: success.render({ total: total }),
			});
			appData.order.total = 0;
		})
		.catch(console.error);
});

// Блокируем прокрутку страницы если открыта модалка
events.on(Events.POPUP_OPEN, () => {
	mainPage.block = true;
});

// ... и разблокируем
events.on(Events.POPUP_CLOSE, () => {
	mainPage.block = false;
});

// Изменилось состояние валидации формы с контактами
events.on(Events.CONTACTS_ERROR, (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы c адресом
events.on(Events.ORDER_ERROR, (errors: Partial<IOrderForm>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.value);
	}
);
