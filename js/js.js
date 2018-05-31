var sampler = {
	player:{
		audio:null,
		initAudio:function(src){
			sampler.player.audio = new Audio(src);

			// Cross Origin prevents CORS restriction
			sampler.player.audio.crossOrigin = "anonymous";
		}
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
		renderFrame:function(){
			// Updates by frames
			sampler.kitt.updateTick = requestAnimationFrame(sampler.kitt.renderFrame);

			sampler.kitt.analyser.getByteFrequencyData(sampler.kitt.frequencyData);

			// The for loop should only go up to just under half.
			var barMax = sampler.kitt.barsM.length;
			var forMax = Math.floor(barMax / 2);

			var freq = sampler.kitt.frequencyData[50];
			var percentile = 0.60;

			// Center divs
			$(sampler.kitt.barsL[forMax]).css("background-color","rgb("+Math.round(0 + (freq * percentile))+",0,0)");
			$(sampler.kitt.barsM[forMax]).css("background-color","rgb("+Math.round(0 + (freq))+",0,0)");
			$(sampler.kitt.barsR[forMax]).css("background-color","rgb("+Math.round(0 + (freq * percentile))+",0,0)");

			// All divs expanding out from the center divs are updated in inverse pairs
			for(var i = 1; i < forMax; i++){
				$(sampler.kitt.barsL[forMax - i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");
				$(sampler.kitt.barsL[forMax + i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");

				$(sampler.kitt.barsM[forMax - i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax)))+",0,0)");
				$(sampler.kitt.barsM[forMax + i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax)))+",0,0)");

				$(sampler.kitt.barsR[forMax - i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");
				$(sampler.kitt.barsR[forMax + i]).css("background-color","rgb("+Math.round(0 + (freq * ((forMax - i) / forMax) * percentile))+",0,0)");
			}
		},
		createVisualizer:function(calledFrom){
			// Get the bars
			sampler.kitt.barsL = $("#kittL").children();
			sampler.kitt.barsM = $("#kittM").children();
			sampler.kitt.barsR = $("#kittR").children();

			// Background color, black is a good color.
			var bgColor = "rgb(0,0,0)";

			// Set the color of all the divs
			for(var i = 0; i < sampler.kitt.barsM.length; i++){
				$(sampler.kitt.barsL[i]).css("background-color",bgColor);
				$(sampler.kitt.barsM[i]).css("background-color",bgColor);
				$(sampler.kitt.barsR[i]).css("background-color",bgColor);
			}

			// Variables for visualizer
			sampler.kitt.ctx = new AudioContext();
			sampler.kitt.audioSrc = sampler.kitt.ctx.createMediaElementSource(sampler.kitt.audio);
			sampler.kitt.analyser = sampler.kitt.ctx.createAnalyser();

			sampler.kitt.audioSrc.connect(sampler.kitt.analyser);

			sampler.kitt.frequencyData = new Uint8Array(sampler.kitt.analyser.frequencyBinCount);

			// Play the audio, start animating the visualizer
			sampler.kitt.audio.play();
			sampler.kitt.updateTick = requestAnimationFrame(sampler.kitt.renderFrame);
		},
		initAudio:function(src){
			sampler.kitt.audio = new Audio(src);

			// Cross Origin prevents CORS restriction
			sampler.kitt.audio.crossOrigin = "anonymous";
		}
	},
	init:function(){

	}
}

$(document).ready(function(){
	sampler.init();
});
