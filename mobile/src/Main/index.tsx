import { ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

import {
	Container, CategoriesConstainer, MenuConstainer,
	Footer, FooterContainer, CenteredContainer,
} from './styles';

import { Text } from '../components/Text';
import { Header } from '../components/Header';
import { Categories } from '../components/Categories';
import { Menu } from '../components/Menu';
import { Button } from '../components/Button';
import { TableModal } from '../components/TableModal';
import { Cart } from '../components/Cart';
import { Empty } from '../components/Icons/Empty';

import { CartItem } from '../types/CartItem';
import { Product } from '../types/Product';
import { Category } from '../types/Category';

import { api } from '../utils/api';



export function Main(){
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingProducts, setIsLoadingProducts] = useState(false);
	const [products, setPrducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(()=> {
		Promise.all([ //Promise all usado para carregar todos os itens juntos
			api.get('/categories'),
			api.get('/products'),
		]).then(([categoriesResponse, productsResponse])=>{
			setCategories(categoriesResponse.data);
			setPrducts(productsResponse.data);
			setIsLoading(false);
		});
	},[]);

	async function handleSelectCategory(categoryId: string){ //funcao para filtrar os produtos pela categoria
		const route= !categoryId //se nao houver um ID, no caso se o a categoria for desselecionada
			? '/products' //retorna a rota de todos os products
			: `/categories/${categoryId}/products`; //caso contrario, retorna a rota do ID selecionado

		setIsLoadingProducts(true); //loading para carregar somenete os produtos
		const {data}= await api.get(route);
		setPrducts(data);
		setIsLoadingProducts(false);
	}


	function handleSaveTable(table: string){
		setSelectedTable(table);
	}

	function handleResetlOrder(){
		setSelectedTable('');
		setCartItems([]);
	}


	function handleAddToCart(product: Product){
		if(!selectedTable){
			setIsTableModalVisible(true);
		}
		setCartItems((prevState)=> {
			const itemIndex = prevState.findIndex(cartItems=> cartItems.product._id === product._id);

			if(itemIndex < 0){
				return prevState.concat({
					quantity:1,
					product,
				});
			}

			const newCartItems= [...prevState];
			const item = newCartItems[itemIndex];

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity +1,
			};

			return newCartItems;
		});
	}


	function handleDecrementCartItem(product: Product){
		setCartItems((prevState)=> {
			const itemIndex = prevState.findIndex(cartItems=> cartItems.product._id === product._id);

			const item= prevState[itemIndex];
			const newCartItems= [...prevState];

			if (item.quantity ===1){
				newCartItems.splice(itemIndex, 1);

				return newCartItems;
			}

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity -1,
			};

			return newCartItems;

		});
	}


	return(
		<>
			<Container>

				<Header
					selectedTable= {selectedTable}
					onCancelOrder= {handleResetlOrder}
				/>

				{isLoading ? (
					<CenteredContainer>
						<ActivityIndicator color='#D73035' size='large' />
					</CenteredContainer>
				): (
					<>
						<CategoriesConstainer>
							<Categories
								categories={categories}
								onSelectCategory={handleSelectCategory}
							/>
						</CategoriesConstainer>

						{isLoadingProducts ? ( // verifica o IsloadingProduct, caso for true retorna a pagina de carregamento. Usado para mostrar o loading ao alterar a categoria
							<CenteredContainer>
								<ActivityIndicator color='#D73035' size='large' />
							</CenteredContainer>
						):(//isLoadingProducts por padrao é false, entao renderiza os produtos cadastrados
							<>

								{products.length> 0 ? ( //verifica se ha produtos cadastrados no cardapio e os renderiza
									<MenuConstainer>
										<Menu
											onAddToCart={handleAddToCart}
											products={products}/>
									</MenuConstainer>
								): ( // caso contrario retorna a imagem de cardapio vazio
									<CenteredContainer>
										<Empty/>
										<Text color='#666' style={{marginTop: 24}} >
									Nenhum produto foi encontrado!
										</Text>
									</CenteredContainer>
								)}
							</>

						)}

					</>
				)}



			</Container>

			<Footer>
				<FooterContainer>
					{!selectedTable && ( //esconde o botao de novo pedido se ja tiver selecionado uma mesa
						<Button
							onPress={()=> setIsTableModalVisible(true)}
							disabled={isLoading}>
							Novo Pedido
						</Button>
					)}
					{selectedTable && (
						<Cart
							cartItems={cartItems}
							onAdd={handleAddToCart}
							onDecrement={handleDecrementCartItem}
							onConfirmOrder={handleResetlOrder}
							selectedTable={selectedTable}
						/>
					)}


				</FooterContainer>
			</Footer>

			<TableModal
				visible={isTableModalVisible}
				onClose={()=>setIsTableModalVisible(false)}
				onSave={handleSaveTable}
			/>
		</>
	);
}
