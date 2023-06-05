import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import http from 'node:http';
import { Server } from 'socket.io';

import {router} from './router';

const app=express();
const server = http.createServer(app);
export const io = new Server(server);


mongoose.connect('mongodb://localhost:27017')
	.then(()=> {
		const port= 3001;


		app.use((req,res, next)=>{ // metodo para tratar o problema de CORS
			// Para todas as respostas da API vamos setar alguns headers
			// res.setHeader('chave', 'valor') -> USA O * NO VALOR COMO UM CORINGA, OU SEJA, TODAS AS POSSIBILIDADES
			res.setHeader('Access-Control-Allow-Origin', '*'); // Dominios autorizados a consumir a API (poderia usar o localhost no caso de teste 127.0.0.1:porta)
			res.setHeader('Access-Control-Allow-Methods', '*'); // Quais metodos o front end pode fazer (get, post, delete...)
			res.setHeader('Access-Control-Allow-Headers', '*'); // indica quais cabeçalhos HTTP podem ser usados durante a solicitação

			next(); //next usado para nao finalizar a request nessa funcao (finalizar somente pela rota)
		});
		app.use('/uploads', express.static(path.resolve(__dirname,'..', 'uploads')));
		app.use(express.json());
		app.use(router);

		server.listen(port,()=> {
			console.log(`Servidor rodando em http://localhost:${port}`);
		});
	})
	.catch(()=> console.log('Error no mongoDB'));




