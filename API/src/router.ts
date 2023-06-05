import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';

import { createCategories } from './app/useCases/categories/createCategory';
import { listCategories } from './app/useCases/categories/listCategories';
import { listProductsByCategory } from './app/useCases/categories/listProductsByCategory';
import { changeOrderStatus } from './app/useCases/orders/changeOrderStatus';
import { createOrder } from './app/useCases/orders/createOrder';
import { listOrders } from './app/useCases/orders/listOrders';
import { cancelOrder } from './app/useCases/orders/cancelOrder';
import { createProducts } from './app/useCases/products/createProduct';
import { listProducts } from './app/useCases/products/listProducts';

export const router= Router();

// obs: upload nao pode ficar na mesma pasta de src, ja que o src vai ser compilado diversas vezes,
// isso iria apagar as imagens ja salvas

const upload = multer({ //storage para salvar os arquivos na maquina que esta rodando
	storage: multer.diskStorage({
		destination(req, file, callback){
			callback(null, path.resolve(__dirname,'..', 'uploads')); //__dirname é uma variavel global para pegar todo o caminho ate chegar no router (arquivo atual)
		},
		filename(req, file, callback){// determinar um nome default
			callback(null, `${Date.now()}-${file.originalname}`);// nome seria a data + nome original do arquivo enviado
		}
	})
});

// List categories
router.get('/categories', listCategories);

// Create category
router.post('/categories', createCategories);

// List prodocts
router.get('/products', listProducts);

// create produtcs
router.post('/products',upload.single('image'), createProducts);
// upload.sigle para fazer upload de apenas 1 unico arquivo

// get products by category
router.get('/categories/:categoryId/products', listProductsByCategory);

// List order
router.get('/orders', listOrders);

//  create order
router.post('/orders', createOrder);

// Change order status
// router.put -> seria para uma alteracao completa no 'order'
// router.patch -> alteracao incompleta, nesse caso, alterando apenas o status
router.patch('/orders/:orderId', changeOrderStatus);

// Delete/cancel order
router.delete('/orders/:orderId', cancelOrder);
