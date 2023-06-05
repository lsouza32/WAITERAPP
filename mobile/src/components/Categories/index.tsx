import { useState } from 'react';
import { FlatList } from 'react-native';

import {CategoryContainer, Icon} from './styles';
import { Text } from '../Text';
import { Category } from '../../types/Category';

interface CategoriesProps{
	categories: Category[];
	onSelectCategory: (categoryId: string)=> Promise<void>;
}


export function Categories({categories, onSelectCategory}:CategoriesProps){

	const [selectedCategory, setSelectedCategory] = useState('');

	function handleSelectCategory(categoryId: string){
		const category = selectedCategory === categoryId ? '' : categoryId; // se o estado atual for igual a clicada, volta para o inicial. Ou seja, para desselecionar o icone

		onSelectCategory(category); //usado para enviar o ID da categoria selecionada
		setSelectedCategory(category); //usado para desselecionar a categoria
	}

	return(
		<>
			<FlatList
				data={categories}
				keyExtractor={category => category._id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingRight: 24 }}
				renderItem={({item: category})=>{

					const isSelected = selectedCategory === category._id; // controla aopcidade do icone selecionado

					return(
						<CategoryContainer onPress={()=> handleSelectCategory(category._id)}>
							<Icon>
								<Text opacity={isSelected ? 1 : 0.5} >
									{category.icon}
								</Text>
							</Icon>
							<Text size={14} weight='600' opacity={isSelected ? 1 : 0.5} >
								{category.name}
							</Text>
						</CategoryContainer>
					);
				}}
			/>
		</>
	);

}


