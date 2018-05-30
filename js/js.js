var sampler = {
	player:{

	},
	kitt:{
		analyser:null,
		audio:null,
		audioSrc:null,
		barsL:[],
		barsM:[],
		barsR:[],
		ctx:null,
		frequencyData:null,
		updateTick:null,
		container:null,
		renderFrame:function(){
			// Updates by frames
			kitt.updateTick = requestAnimationFrame(kitt.renderFrame);

			kitt.analyser.getByteFrequencyData(kitt.frequencyData);

			// The for loop should only go up to just under half.
			var barMax = kitt.barsM.length;
			var forMax = Math.floor(barMax / 2);

			var freq = kitt.frequencyData[50];
			var percentile = 0.60;

			// Center divs
			$(kitt.barsL[forMax]).css("background-color","rgb("+Math.round(0 + (freq * percentile))+",0,0)");
			$(kitt.barsM[forMax]).css("background-color","rgb("+Math.round(0 + (freq))+",0,0)");
			$(kitt.barsR[forMax]).css("background-color","rgb("+Math.round(0 + (freq * percentile))+",0,0)");

			// All divs expanding out from the center divs are updated in inverse pairs
			for(var i = 1; i < forMax; i++){
				$(kitt.barsL[forMax - i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");
				$(kitt.barsL[forMax + i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");

				$(kitt.barsM[forMax - i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax)))+",0,0)");
				$(kitt.barsM[forMax + i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax)))+",0,0)");

				$(kitt.barsR[forMax - i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");
				$(kitt.barsR[forMax + i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");
			}
		},
		createVisualizer:function(calledFrom){
			// If statement determines what visualizer to initialise
			if($(calledFrom).attr("id") == "visualKitt"){
				// Get the bars
				kitt.barsL = $("#kittL").children();
				kitt.barsM = $("#kittM").children();
				kitt.barsR = $("#kittR").children();

				// Background color, black is a good color.
				var bgColor = "rgb(0,0,0)";

				// Set the color of all the divs
				for(var i = 0; i < kitt.barsM.length; i++){
					$(kitt.barsL[i]).css("background-color",bgColor);
					$(kitt.barsM[i]).css("background-color",bgColor);
					$(kitt.barsR[i]).css("background-color",bgColor);
				}

				// Audio creation and readying for visualisation
				// Audio object; source taken from dropbox
				kitt.audio = new Audio("https://dl.dropboxusercontent.com/s/mw28fr4lt64mhzt/Getting%20Stronger%20-%20Michelle%20Creber%20Black%20Gryph0n%20Baasik.mp3");

				// Cross Origin prevents CORS restriction
				kitt.audio.crossOrigin = "anonymous";

				// Variables for visualizer
				kitt.ctx = new AudioContext();
				kitt.audioSrc = kitt.ctx.createMediaElementSource(kitt.audio);
				kitt.analyser = kitt.ctx.createAnalyser();

				kitt.audioSrc.connect(kitt.analyser);

				kitt.frequencyData = new Uint8Array(kitt.analyser.frequencyBinCount);

				// Play the audio, start animating the visualizer
				kitt.audio.play();
				kitt.updateTick = requestAnimationFrame(kitt.renderFrame);
			}
		},
		init:function(){
			$(".runVisualizer").click(function(){
				kitt.createVisualizer($(this).parent());
			});
		}
	}
}
