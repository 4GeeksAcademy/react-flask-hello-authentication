const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null
		},
		actions: {
			userSignUp: (user) => {
				console.log("User recived to signup: " + JSON.stringify(user));
				return fetch('https://alopez022-crispy-palm-tree-gjx6g66vx64394x6-3001.preview.app.github.dev/api/signup', {
						method: 'POST',
						headers: {
							'Content-type': 'application/json'
						},
						body: JSON.stringify(user)
					})
			},
			userLogin: (user) => {
				console.log("User recived to login: " + JSON.stringify(user));
					return fetch('https://alopez022-crispy-palm-tree-gjx6g66vx64394x6-3001.preview.app.github.dev/api/token', {
						method: 'POST',
						headers: {
							'Content-type': 'application/json'
						},
						body: JSON.stringify(user)
					})
			},
			getAllCharacters() {
				return fetch('https://alopez022-crispy-palm-tree-gjx6g66vx64394x6-3001.preview.app.github.dev/api/get_all_characters', {
						method: 'GET',
						headers: {
							'Content-type': 'application/json',
						}
					})
			},
			getProtected: () => {
				const token = localStorage.getItem('jwt-token');
				if(!token) return false;
				
				return fetch('https://alopez022-crispy-palm-tree-gjx6g66vx64394x6-3001.preview.app.github.dev/api/private', {
						method: 'GET',
						headers: {
							'Content-type': 'application/json',
							'Authorization': 'Bearer ' + token
						}
					})
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			}
		}
	};
};

export default getState;
