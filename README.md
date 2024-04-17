# Проектная работа "Веб-ларек"
[Ссылка на репозиторий](https://github.com/ElenaFoxy/web-larek-frontend.git)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss— корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

### Карточка товара
\```
export interface ICard {
	id: string;
    description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
\```
### Перечисление способов оплаты
`enum Payment { online = 'Онлайн', offline = 'При получении'};`

### Перечисление категорий товаров
\```
export enum Category {
	softskills = 'софт-скил',
	hardskills = 'хард-скил',
	plusone = 'дополнительное',
	button = 'кнопка',
	other = 'другое',
}
\```

### Корзина с товарами
\```
export interface ICart {
    list: ICard[];
    total: number;
	add(item: ICard): void;
	remove(itemId: ICard): void;
	sumTotal(): number;
}
\```
### Информация о заказе
\```
export interface IOrder {
        payment: Payment;
        email: string;
        phone: string;
        address: string;
        total: number;
        items: string[];
}
\```
### Тип для описания объекта, содержащий ошибки формы
`export type FormErrors = Partial<Record<keyof IOrder, string>>;` 

### Методы работы с API
`export interface IWebLarekAPI {`
	`getProductList(): Promise<ICard[]>;` - получить список товаров
	`getProduct(id: number): Promise<ICard>;` - получить товар по идентификатору
	`sendOrder(order: IOrder): Promise<IOrderStatus>;}` - отправить заказ


### Типы состояния приложения
\```
export interface IAppState {
    catalog: ICard[];
    cart: string[];
    order: IOrder | null;
}
\```
### Главная страница
\```
interface IPage {
    counter: number; счетчик корзины
    catalog: HTMLElement[]; каталог
    locked: boolean; блокировщик на главной странице
}
\```
### Статусы заказа
\```
export interface IOrderStatus {
	status: string;
	totalPrice: number;
}
\```
### Действия с карточкой товара
\```
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
\```
### Данные о контенте модального окна
\```
interface IModalData {
content: HTMLElement;
}
\```
### Типы состояния полей
\```
interface IFormState {
    valid: boolean;
    errors: string[];
}
\```
### Тип итоговой суммы при успешном оформлении заказа
\```
interface ISuccess {
    total: number;
}
\```
### Возможные действия в случае удачной покупки
\```
interface ISuccessActions {
    onClick: () => void;
}
\```
### Описывает методы обработки событий
\```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void; - подписка на событие
    emit<T extends object>(event: string, data?: T): void; - инициализация события
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   
}
\```
## Архитектура приложения
## Об архитектуре 

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код
#### Класс EventEmitter
`export class EventEmitter implements IEvents`  
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.     
`constructor() {this._events = new Map<EventName, Set<Subscriber>>();}` - конструктор класса, он использует Map для хранения обработчиков событий, ключ - это имя события, а значение - это набор функций-обработчиков.    
Методы:
`on<T extends object>(eventName: EventName, callback: (event: T) => void)`  - устанавливает обработчик на событие.    
`off(eventName: EventName, callback: Subscriber)`  - снимает обработчик с события.    
`emit<T extends object>(eventName: string, data?: T)` - инициирует событие с данными.    
`onAll(callback: (event: EmitterEvent) => void)` - слушает все события.    
`offAll()` - сбрасывает все обработчики.    
`trigger<T extends object>(eventName: string, context?: Partial<T>)` - коллбек триггер, генерирующий событие при вызове.    
#### Класс Api
Содержит в себе базовую логику отправки запросов.   
`constructor(baseUrl: string, options: RequestInit = {})` - конструктор класса принимает baseUrl и options, которые используются для инициализации свойств класса.  
Свойства:
`readonly baseUrl: string;` - базовый адрес сервера.   
`protected options: RequestInit;` - настройки для запросов к API.   
Методы: 
`get(uri: string)` - выполняет GET запрос для получения объекта сервера.    
`post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.    
`protected handleResponse**(response: Response): Promise<object>` - обработчик ответа сервера.   

#### Класс WebLarekApi
`export class WebLarekAPI extends Api implements IWebLarekAPI`
Для работы с Api магазина. Наследуется от базового класса Api.
Методы:
Все методы используют асинхронные операции для взаимодействия с сервером, это позволяет избежать блокировки выполнения кода.    
`getProduct(id: string): Promise<ICard>` - получение данных о товаре по id.     
`getProductsList(): Promise<ICard[]>` - получение всего каталога товаров;    
`sendOrder(order: IOrder): Promise<IOrderStatus>` - отправка оформленного заказа.    
Методы getProductList и getProduct выполняют GET-запросы к серверу, а метод sendOrder выполняет POST-запрос.

### Слой отображения View
#### Класс Component 
`export abstract class Component<T>` 
Класс для создания компонентов, содержит основные методы для работы с DOM.    
`protected constructor(protected readonly container: HTMLElement)` - конструктор класса, принимает контейнер, который будет использоваться для отображения компонента.    
Методы:
`toggleClass(element: HTMLElement, className: string, force?: boolean)` переключает класс className у элемента element.    
`protected setText(element: HTMLElement, value: unknown)` - устанавливает текст value в элемент element.    
`setDisabled(element: HTMLElement, state: boolean)` - меняет статус блокировки.    
`protected setHidden(element: HTMLElement)` - скрывает элемент.    
`protected setVisible(element: HTMLElement)` - отображает элемент.     
`protected setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение из src и альтернативный текст alt для element.    
`render(data?: Partial<T>): HTMLElement` - обновляет данные компонента данными из data, возвращает корневой DOM-элемент.    

### Слой данных
#### Класс Model 
`export abstract class Model<T>`
Базовый абстрактный класс для создания моделей.    
`constructor(data: Partial<T>, protected events: IEvents)` - в конструкторе класса Model, данные из data копируются в экземпляр класса.    
`emitChanges(event: string, payload?: object)` - сообщает всем, что поменялось и какие данные связаны с этим изменением.    
Функция `isModel` используется для проверки, является ли переданный объект экземпляром класса Model.

#### Класс AppState 
Представляет собой состояние приложения, наследуется от Model.    
`export class AppState extends Model<IAppState>`     
Свойства:
`private _cart: string[]` - товары в корзине. 
`private _catalog: ICard[];` - каталог товаров.  
`private _order: IOrder = ` - заказ.  

	{   payment: Payment.online,
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};    
 Методы:   
`get cart(): string[]` - получить список товаров в корзине для cart.   
`set cart(value: string[])` - установить список товаров в корзине для cart.   
`get catalog(): ICard[]` -  получить каталог для catalog.   
`set catalog(value: ICard[])` - установить каталог для catalog.   
`get order(): IOrder` - получить данные заказа для order.    
`set order(value: IOrder)` - установить данные заказа для order. 
`getTotal(): number` - получить сумму заказа.
`getCount(): number` -  получить количество товаров в корзине 
`setCatalog(items: ICard[])` - установить каталог, вызывает свойство 'cards:display'
`getAddedCards(): ICard[]` - получить отфильтрованный список продуктов, которые есть в корзине.
`clear()` - очистить корзину и заказ
`validateOrder()` - проверить на корректность форму с адресом
`validateContacts()` - проверить на корректность форму с контактами
`setContactsField(field: keyof IContactsForm, value: string)` - установить текст ошибки для формы с контактами
`setOrderField(value: string)` - установить текст ошибки для формы с адресом

### Слой представления
#### Класс MainPage
`export class MainPage extends Component<IPage>`
Отвечает за отображение главной страницы, компонент, который управляет визуальной частью страницы, такой как счетчик, каталог и состояние блокировки.    
`constructor(container: HTMLElement, protected events: IEvents)` - инициализирует элементы страницы, настраивает обработчик события для клика по корзине, который вызывает событие cart:open.    
Свойства:
`protected _counter: HTMLElement;` элемент - счётчик корзины.    
`protected _catalog: HTMLElement;` элемент - каталог товаров.    
`protected _wrapper: HTMLElement;` элемент - элемент, оборачивающий страницу.    
`protected _basket: HTMLElement`; элемент - корзина.    
Методы:
`set counter(value: number)` - устанавливает счетчик корзины.    
`set catalog(cards: HTMLElement[])` - определяет каталог товаров.    
`set block(value: boolean)` - блокирует страницу при открытом модальном окне.    

#### Класс Modal
`export class Modal extends Component<IModalData>` 
Отвечает за работу модального окна.    
`constructor(container: HTMLElement, protected events: IEvents)` - принимает в конструкторе контейнер, в котором будет размещаться модальное окно, и объект events для обработки событий.   
Свойства: 
`protected _closeButton: HTMLButtonElement;` - кнопка закрытия окна.    
`protected _content: HTMLElement;` - контейнер контента.    
Методы:
`set content(value: HTMLElement)` - устанавливает содержимое окна.     
`open()` - открывает модальное окно, вызывает событие popup:open.    
`close()` - закрывает модальное окно, вызывает событие popup:close.    
`render(content: IModalData): HTMLElement` - отрисовка модального окна.    

#### Класс Cart
`export class Cart extends Component<ICartView>` 
Отвечает за отображение корзины.    
`constructor(container: HTMLElement, protected events: EventEmitter)` - инициализирует элементы корзины, так же настраивается обработчик события для клика по кнопке, который вызывает событие order:open.  
Свойства:   
`protected _list: HTMLElement;` - товары в корзине.    
`protected _total: HTMLElement;` - сумма товаров в корзине.    
`protected _button: HTMLElement;` - элемент кнопки. 
Методы:
`set total(total: number)` - сеттер для total.    
`set items(items: HTMLElement[])` - сеттер для list.       
`setButtonDisabled(state: boolean)` - обновляет состояния кнопки.    

#### Класс Form
export class Form<T> extends Component<IFormState>
Класс, который отвечает за отображение формы заказа.    
`constructor(protected container: HTMLFormElement, protected events: IEvents)` - конструктор класса принимает контейнер формы container и объект events для обработки событий.  
Свойства:  
`protected _submit: HTMLButtonElement;` - кнопка отправки формы.   
`protected _errors: HTMLElement;` - контейнер для отображения ошибок валидации.   
Методы:
`set errors(value: string)` - устанавливает текст ошибок.   
`set valid(value: boolean)` - управляет состоянием кнопки(активное-неактивное).    
`render(state: Partial<T> & IFormState)` - отображение формы заказа.     

#### Класс Order extends Form
Класс для работы с формой заказа, пользователь выбирает способ оплаты, вводит адрес для оформления заказа.    
`constructor(container: HTMLFormElement, events: IEvents)`
Свойства:
`protected _online: HTMLButtonElement;` - элемент выбора оплаты онлайн.
`protected _offline: HTMLButtonElement;` - элемент выбора оплаты при получении.
`protected _button: HTMLButtonElement;` - кнопка для продолжения оформления заказа.
`protected _address: HTMLInputElement;` - элемент для ввода адреса доставка.
Методы:  
`set address(value: string)` - устанавливает адрес доставки заказа.    

#### Класс Contacts extends Form 
Класс для работы с формой заказа, пользователь вводит личные данные - телефон и email.    
`constructor(container: HTMLFormElement, events: IEvents)`   
Свойства:
`protected _email: HTMLButtonElement;` - элемент для ввода email.
`protected _phone: HTMLButtonElement;` - элемент для ввода телефона.
`protected _button: HTMLButtonElement;` - кнопка для оформления заказа.
Методы: 
`set email(value: string)` - устанавливает значение почты пользователя.    
`set phone(value: string)` - устанавливает значение номера телефона пользователя.    

#### Класс Success
`export class Success extends Component<ISuccess>`
Класс выводит сообщение об успешном оформлении заказа.    
`constructor(container: HTMLElement, actions: ISuccessActions)`    
`_close: HTMLElement;` - установка кнопки   
`_total: HTMLElement` - общая сумма заказа.       
`set total(value: string)` - установить итоговую стоимость.    

#### Класс Card, который создаёт карточку товара
`export class Card<T> extends Component<ICard<T>>`
Класс представляет собой компонент - карточку, она может отображать данные о товаре - название товара, фото, описание, кнопку добавления в корзину, категорию и цену.     
`constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)`
 Свойства:
`protected _title: HTMLElement;` - название товара.    
`protected _image: HTMLImageElement;` - картинка товара.    
`protected _description: HTMLElement;` - описание товара.   
`protected _button: HTMLButtonElement;` - кнопка для добавления в корзину.   
`protected _category: HTMLButtonElement;` - категория товара
`protected _price: HTMLElement;` - стоимость товара
`set title(value: string)`  - устанавливает название товара.     
`get title(): string` - получить название товара.     
`set image(value: string)` - устанавливает картинку товара.    
`set description(value: string)` - устанавливает описание товара. 
`set category(value: string)`  - устанавливает категорию товара
`set price(price: number)` - устанавливает цену товара
`set button(isAdd: boolean)` - устанавливает текст кнопки (В корзину/ купить)
`addButtonAction(actions?: ICardActions): void` - добавляет событие кнопке.    

## Cобытия в проекте "Веб-ларек"
`enum Events` {    
CARDS_DISPLAY = 'cards:display', - обновление каталога товаров на странице. Для каждого товара создается новая карточка, которая отображается на странице.     
CARDS_SHOW = 'cards:show',  - генерируется при выборе товара. Генерирует класс Card. При нажатии на карточку выбранного товара происходит открытие модального окна с этим товаром. Model -> open(), а затем render().     
ORDER_OPEN = 'order:open', - событие происходит при нажатии кнопки оформления заказа. Открывается форма для заполнения полей заказа - выбор оплаты и адрес.    
CONTACTS_OPEN = 'contacts:open', - открывается форма для заполнения контактов для заказа.     
ORDER_SUBMIT = 'order:submit', - событие подтверждения оформления заказа. Данные заказа после проверки отправляются на сервер.     
CART_OPEN = 'cart:open', - событие происходит при нажатии на корзину (открыть корзину).     
POPUP_OPEN = 'popup:open', - модальное окно открыто, страница блокируется.    
POPUP_CLOSE = 'popup:close', - модальное окно закрыто, страница разблокирована.    
CARD_ADD = 'card:add', - событие добавления товара в корзину.    
CARD_DELETE = 'card:delete' - событие удаления товара из корзины.    
ORDER_ERROR = 'formOrderErrors:change', //проверка полей формы с адресом.     
CONTACTS_ERROR = 'formErrors:change', //проверка полей формы с контактами.     
};
