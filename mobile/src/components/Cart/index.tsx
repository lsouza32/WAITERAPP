import { FlatList, TouchableOpacity } from 'react-native';
import { CartItem } from '../../types/CartItem';
import { Item, ProductContainer, Actions, Image, QuantityContainer, ProductDetails, Summary, TotalContainer } from './styles';
import { Text } from '../Text';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { MinusCircle } from '../Icons/MinusCircle';
import { Button } from '../Button';
import { Product } from '../../types/Product';
import { OrderConfirmedModal } from '../OrderConfirmedModal';
import { useState } from 'react';
import { api } from '../../utils/api';

interface CartProps{
	cartItems: CartItem[];
	onAdd: (product: Product) => void;
	onDecrement: (product: Product) => void;
	onConfirmOrder: ()=> void;
	selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps){

	const [isLoading, setIsLoading] = useState(false);
	const [isModalVisible, setModalVisible]= useState(false); //modal order conformed

	const total = cartItems.reduce((acc, cartItem)=> {
		return acc+ cartItem.quantity * cartItem.product.price;
	},0);

	async function handleConfirmOrder(){
		setIsLoading(true); // Inicia o loading antes antes de enviar a requisicao
		await api.post('/orders', { // metodo para enviar
			table: selectedTable,
			products: cartItems.map((cartItem)=> ({// usado o map para criar um novo array pegando somente a mesa, produto e quantidade
				product: cartItem.product._id,     // como vamos mandar para a 'cozinha' (pagina web) nao precisamos de mais coisas
				quantity: cartItem.quantity,
			}))
		});
		setIsLoading(false); //apos enviar a requisicao finaliza o loading
		setModalVisible(true);// modal de pedido confirmado (reseta o pedido  e mesa)
	}

	function handleOk(){
		onConfirmOrder();
		setModalVisible(false);
	}

	return (
		<>
			<OrderConfirmedModal
				visible={isModalVisible}
				onOk={handleOk}/>

			{cartItems.length> 0 && (
				<FlatList
					data={cartItems}
					keyExtractor={cartItems => cartItems.product._id}
					showsVerticalScrollIndicator={false}
					style={{marginBottom: 20, maxHeight: 150}}
					renderItem={({item: cartItem}) => (
						<Item>
							<ProductContainer>
								<Image
									source={{
										uri: `http://192.168.0.106:3001/uploads/${cartItem.product.imagePath}`,
									}}
								/>

								<QuantityContainer>
									<Text size={16} color='#666'>{cartItem.quantity}x</Text>
								</QuantityContainer>

								<ProductDetails>
									<Text size={14} weight='600'>{cartItem.product.name}</Text>
									<Text size={14} color='#666' style={{marginTop: 4}} >
										{formatCurrency(cartItem.product.price)}
									</Text>

								</ProductDetails>
							</ProductContainer>

							<Actions>
								<TouchableOpacity
									style={{marginRight: 24}}
									onPress={()=> onAdd(cartItem.product)}>
									<PlusCircle/>
								</TouchableOpacity>

								<TouchableOpacity onPress={()=> onDecrement(cartItem.product)}>
									<MinusCircle/>
								</TouchableOpacity>
							</Actions>
						</Item>
					)}
				/>
			)}

			<Summary>
				<TotalContainer>
					{cartItems.length > 0 ? (
						<>
							<Text color='#666'>Total</Text>
							<Text size={20} weight='600'>{formatCurrency(total)}</Text>
						</>
					): (
						<Text color='#999'>Seu carrinho esta vazio</Text>
					)

					}
				</TotalContainer>

				<Button
					onPress={handleConfirmOrder}
					disabled= {cartItems.length === 0}
					loading={isLoading}
				>Confirmar pedido</Button>
			</Summary>

		</>
	);
}
