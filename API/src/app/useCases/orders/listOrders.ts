import { Request, Response } from 'express';

import { Order } from '../../models/Order';

export async function listOrders(req: Request, res: Response){
	try{
		const orders= await Order.find().sort({createdAt: 1}).populate('products.product');
		//sort -> ordernar comecando do pedido mais velho para o mais novo( ao contrario usa o -1)
		//populate para pegar as infos do produto, como colocamos a ref em models
		res.json(orders);

	}  catch(error){
		console.log(error);
	}
}

