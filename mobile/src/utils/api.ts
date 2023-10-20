import axios from 'axios';

import { myIP } from './ipconfig';

export const api= axios.create({
	baseURL: `${myIP}:3001`,
});
