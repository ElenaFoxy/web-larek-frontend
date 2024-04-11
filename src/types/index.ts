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
  enum Payment {
    online = "Онлайн",
    offline = "При получении",
  }
  
  //Перечисление категорий товаров
  enum Category {
    softskills,
    hardskills,
    plusone,
    button,
    other,
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
  interface IPage {
    counter: number; //счетчик
    catalog: HTMLElement[]; //каталог
    locked: boolean; //блокировщик
  }
  
  // Статусы заказа
  export interface IOrderStatus {
    status: string;
    totalPrice: number;
  }
  
  // Действия с карточкой товара
  interface ICardActions {
    onClick: (event: MouseEvent) => void;
  }
  
  // Данные о контенте модального окна
  interface IModalData {
    content: HTMLElement;
  }
  
  // Типы состояния полей
  interface IFormState {
    valid: boolean;
    errors: string[];
  }
  
  // Тип итоговой суммы при успешном оформлении заказа
  interface ISuccess {
    total: number;
  }
  
  // Возможные действия в случае удачной покупки
  interface ISuccessActions {
    onClick: () => void;
  }
  