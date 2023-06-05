export function formatCurrency(value:number){
	return new Intl.NumberFormat(
		'pt-br',
		{style: 'currency', currency: 'BRL'}).format(value);
}
// funcao para converter o valor para o formado da moeda BR
