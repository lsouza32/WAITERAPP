export interface Order{ //tipagem do pedido
	_id: string;
	table: string;
	status: 'WAITING' | 'IN_PRODUCTION' | 'DONE'; // define que o status precisa ser um dos 3 casos
	products: {
		_id: string;
		quantity: number;
		product: {
			name: string;
			imagePath: string;
			price: number;
		};
	}[];
}
