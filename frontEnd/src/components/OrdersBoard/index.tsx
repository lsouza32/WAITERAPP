import { useState } from 'react';
import { toast } from 'react-toastify';

import { Order } from '../../types/Order';
import { OrderModal } from '../OrderModal';
import { Board, OrdersContainer } from './styles';
import { api } from '../../utils/api';

interface OrdersBoardProps{ // tambem poderia usar o type
	icon: string;
	title: string;
	orders: Order[];
	onCancelOrder: (orderId: string) => void;
	onChangeOrderStatus : (orderId: string, status: Order['status'])=> void;
}

export function OrdersBoard({icon, title, orders, onCancelOrder, onChangeOrderStatus}: OrdersBoardProps){

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedOrder, setSelectedOrder]= useState<Order | null>(null); // dessa forma fica denifido que o selected pode ter 2 formados, null ou Order
	const  [isLoading, setIsLoading]= useState(false);

	function handleOpenModal(order: Order){
		setIsModalVisible(true);
		setSelectedOrder(order);
	}

	function handleCloseModal(){
		setIsModalVisible(false);
		setSelectedOrder(null);
	}

	async function handleChangeOrderStatus(){// alterar o status do pedido (waiting, inproduction, done)
		setIsLoading(true);

		const status= selectedOrder?.status === 'WAITING'
			? 'IN_PRODUCTION'
			: 'DONE';

		await api.patch(`/orders/${selectedOrder?._id}`, { status }); // short sintaxe status: status

		toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`);

		onChangeOrderStatus(selectedOrder!._id, status);
		setIsLoading(false);
		setIsModalVisible(false);
	}

	async function handleCancelOrder(){
		setIsLoading(true);

		await api.delete(`/orders/${selectedOrder?._id}`);

		toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado!`);

		onCancelOrder(selectedOrder!._id);// ! = non-null
		setIsLoading(false);
		setIsModalVisible(false);
	}

	return(
		<Board>
			<OrderModal
				visible={isModalVisible}
				order={selectedOrder}
				onClose={handleCloseModal}
				onCancelOrder={handleCancelOrder}
				isLoading={isLoading}
				onChangeOrderStatus= {handleChangeOrderStatus}
			/>

			<header>
				<span>{icon}</span>
				<strong>{title}</strong>
				<span>({orders.length})</span>
			</header>

			{orders.length > 0 && ( // condicional, nao renderiza o container se ele estiver vazio
				<OrdersContainer>
					{orders.map((order)=> ( //gera um novo array para utilizar como button
						<button type='button' key={order._id} onClick={()=> handleOpenModal(order)}>
							<strong>Mesa {order.table}</strong>
							<span>{order.products.length} itens</span>
						</button>
					))}
				</OrdersContainer>
			)}
		</Board>
	);
}

