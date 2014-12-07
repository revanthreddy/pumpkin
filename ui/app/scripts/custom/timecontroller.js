(function(){
	var app = angular.module('countdown', []);
	app.controller("TimeController", function($scope){
			var self = this;
			//minimum and maximum time values
			this.min = 1;
			this.max = 60;
			//default color for text
			this.customStyle = {};
			this.customStyle.style = {"color" : "black"};
			
			this.currentTime = '';
			this.counting = false;
			this.intervalID = 0;
			
			//Starts the countdown loop if the input is valid
			this.start_countdown = function(){	
				if(self.isValid()){
					self.set_color(self.currentTime);
					self.intervalID = setInterval(self.run_countdown, 1000);
					self.counting = true;
				}
			};
			//stops the coundown loop
			this.stop_countdown = function(){	
				clearInterval(self.intervalID);
				self.counting = false;
			};
			
			//countdown loop
			this.run_countdown = function() { 
				//countdown stops at zero
				if(self.currentTime > 0){
					//decrement time
					self.currentTime--;
					//set new color
					self.set_color(self.currentTime);
					//apply new values
					$scope.$apply();
				} else {
					self.stop_countdown();
				}
			};
			
			this.set_color = function(time){
				//set color based on basic mod function
				var fontcolor = "";
				switch(time % 5){
					case 0: 
						fontcolor = "blue";
						break;
					case 1:
						fontcolor = "green";
						break;
					case 2:
						fontcolor = "pink";
						break;
					case 3: 
						fontcolor = "yellow";
						break;
					case 4: 
						fontcolor = "orange";
						break;
					default: 
						fontcolor = "red";
				};
				//set new style
				self.customStyle.style = {"color" : fontcolor};
			};
			//checks if input is a number, and if so if it is within min/max bounds
			this.isValid = function(){
				var isNumber = !isNaN(parseFloat(self.currentTime));
					isInBounds = self.currentTime >= self.min && 
									self.currentTime <= self.max;
				return isNumber && isInBounds;
			}
			
	});
})();