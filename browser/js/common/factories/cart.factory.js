app.factory('CartFactory', function($http){
	var cachedCartItems = [];
	return {

		getCart: function () {
			return $http.get('/api/v1/cart')
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
				return cachedCartItems;
			});
		},

		addToCart: function(song, quantity){

			return $http.post('/api/v1/cart', {song: song, quantity: quantity})
			.then(function(response) {
				cachedCartItems.push(response.data);
				return response.data;
			});
		

		},

		updateCart: function(song, quantity){

			return $http.put('/api/v1/cart', {song: song, quantity: quantity})
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
				return response.data;
			});
		

		},


		removeFromCart: function(item) {
			return $http.delete('/api/v1/cart/' + item.song.id)
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
			})
		},

		getCartTotal: function() {
			if (!cachedCartItems.length) return null;
			else if (cachedCartItems.length < 2) return cachedCartItems[0].song.price * cachedCartItems[0].quantity;
			// else return cachedCartItems.reduce( (a,b) => {
			// 	console.log(a);
			// 	(+a.song.price * a.quantity) + (+b.song.price * b.quantity)
			// });
			else {
				var sum = 0;
				for(var i = 0; i < cachedCartItems.length; i++){
					sum += (+cachedCartItems[i].song.price * cachedCartItems[i].quantity);
				}
				return sum;
			}

		}
	};

});