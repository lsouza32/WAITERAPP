import { Overlay, ModalBody, OrderDetails, Actions } from './styles';

import { Order } from '../../types/Order';
import closeIcon from '../../assets/images/close-icon.svg';
import { OrdersContainer } from '../OrdersBoard/styles';
import { formatCurrency } from '../../utils/formatCurrency';
import { useEffect } from 'react';
import { myIP } from '../../utils/ipconfig';

interface OrderModalProps{
	visible: boolean;
	order: Order | null;
	onClose: () => void; // passar funcao por propriedade
	onCancelOrder: ()=> Promise<void>;
	isLoading: boolean;
	onChangeOrderStatus : ()=> void;
}

export function OrderModal({visible, order, onClose, onCancelOrder, isLoading, onChangeOrderStatus}: OrderModalProps){

	useEffect(()=>{// fechar o modal com a tecla esc
		function handleKeyDown(event: KeyboardEvent){
			if(event.key==='Escape'){
				onClose();
			}
		}
		document.addEventListener('keydown', handleKeyDown);

		return()=>{
			document.removeEventListener('keydown', handleKeyDown); //boa pratica sempre remover listener
		};

	},[onClose]);

	if(!visible || !order){ //visible = false ou sem pedidos
		return null;
	}

	// let total=0;
	// order.products.forEach(({product, quantity})=>{ // for each para percorrer o vetor, pegando o valor e multiplicando pela quantidade
	// 	total += product.price*quantity;
	// });


	// reduce, funciona como o foreach, 1 parametro seria o acumulador, segundo seria a funcao, e  terceiro o valor inicial
	const total = order.products.reduce((total, {product, quantity})=> {
		return total+ (product.price*quantity);
	}, 0);


	return (
		<Overlay>
			<ModalBody>
				<header>
					<strong>Mesa {order.table}</strong>

					<button type='button' onClick={onClose}>
						<img src={closeIcon} alt='Icone de fechar'/>
					</button>
				</header>

				<div className="status-container">
					<small>Status do pedido</small>
					<div>
						<span>
							{order.status==='WAITING' && '🕐'/* se for waiting rederiza o icone*/ }
							{order.status==='IN_PRODUCTION' && '👨‍🍳'}
							{order.status==='DONE' && '✅'}
						</span>

						<strong>
							{order.status==='WAITING' && 'Fila de espera'/* se for waiting rederiza o icone*/ }
							{order.status==='IN_PRODUCTION' && 'Em produção'}
							{order.status==='DONE' && 'Pronto'}
						</strong>
					</div>
				</div>

				<OrderDetails>
					<strong>Itens</strong>

					<div className="order-items">
						{order.products.map(({_id, product, quantity})=>(
							<div className="item" key={_id}>
								<img
									src={`${myIP}:3001/uploads/${product.imagePath}`}
									alt= {product.name}
									width='56'
									height='28.51'
								/>

								<span className="quantity">{quantity}x</span>

								<div className="product-details">
									<strong>{product.name}</strong>
									<span>{formatCurrency(product.price)}</span>
								</div>
							</div>
						))}
					</div>

					<div className="total">
						<span>Total</span>
						<strong>{formatCurrency(total)}</strong>
					</div>
				</OrderDetails>

				<Actions>
					{order.status !== 'DONE' &&(
						<button
							type='button'
							className='primary'
							disabled={isLoading}
							onClick={onChangeOrderStatus}
						>
							<span>
								{order.status === 'WAITING' && '👨‍🍳'}
								{order.status === 'IN_PRODUCTION' && '✅'}
							</span>
							<strong>
								{order.status === 'WAITING' && 'Iniciar Produção'}
								{order.status === 'IN_PRODUCTION' && 'Concluir Pedido'}
							</strong>
						</button>
					)}

					<button
						type='button'
						className='secondary'
						disabled={isLoading}
						onClick={onCancelOrder}
					>
						Cancelar Pedido
					</button>
				</Actions>
			</ModalBody>
		</Overlay>
	);
}
