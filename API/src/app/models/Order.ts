import { model, Schema } from 'mongoose';

export const Order= model('Order', new Schema({

	table: {
		type: String,
		required: true,
	},
	status:{ //Enum e usado para definir apenas 1 dos estados citados, ou seja, nao pode usar outro valor alem dos citados.
		type: String,
		enum:['WAITING', 'IN_PRODUCTION', 'DONE'],
		default: 'WAITING',
	},
	createdAt:{
		type: Date,
		default: Date.now,
	},
	products:{
		required: true,
		type:[{
			product:{
				type: Schema.Types.ObjectId ,
				require: true,
				ref: 'Product'
			},
			quantity:{
				type: Number,
				default:1,
			}
		}],
	},
}));


