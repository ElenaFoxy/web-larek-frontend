import { Api, ApiListResponse } from './base/api';
import { IWebLarekAPI, IOrder, IOrderStatus, ICard } from '../types';

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	//получить список товаров
	getProductList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	//получить товар по идентификатору
	getProduct(id: number): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	//отправить заказ
	sendOrder(order: IOrder): Promise<IOrderStatus> {
		return this.post('/order', order).then((data: IOrderStatus) => data);
	}
}
