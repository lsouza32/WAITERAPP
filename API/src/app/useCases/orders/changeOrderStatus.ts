import { Request, Response } from 'express';

import { Order } from '../../models/Order';

export async function changeOrderStatus(req: Request, res: Response){
	try{
		const {orderId} = req.params;
		const {status} = req.body;

		if(!['WAITING', 'IN_PRODUCTION', 'DONE'].includes(status)){ // verifica se o status do pedido condiz com um dos 3 citados no array
			return (res.status(400).json({
				error: 'Status fora do padrao definifido'
			}));
		}

		await Order.findByIdAndUpdate(orderId, {status}); //busca o documento por ID e faz um update no status

		res.sendStatus(204); // retorna apenas um sucesso.

	} catch(error){
		console.log(error);
	}
}

