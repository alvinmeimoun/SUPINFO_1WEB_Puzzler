var img_full_size = 240;
var img_piece_size = 80;
var tbl_size_x = 3;
var tbl_size_y = 3;

var chrono_centi = 0;
var chrono_sec = 0;
var chrono_min = 0;
var chrono_c;

var last_image = "";

window.onload = function(){
	recreateImageBody();
}

// Efface toutes les infos du jeu
function clearGame(){
	stopChrono();
	recreateImageBody();
}

function recreateImageBody(){
	//on efface l'image d'origine
	$('#img_full').attr("src", "");
	
	//on vide toutes les tables
	$('#game_table_game').empty();
	$('#game_table_toolbox').empty();
	
	var i = 0;
	var j = 0;
	for (i = 1; i <= tbl_size_x; i++) 
	{ 
		//on recrée les tables
		$('#game_table_game').append("<tr></tr>");
		$('#game_table_toolbox').append("<tr></tr>");
	   	for (j = 1; j <= tbl_size_y; j++) 
		{ 
			$('#game_table_toolbox').children().children().eq(i-1)
				.append('<td id="toolbox_pid_'+i+'_'+j+'"></td>');
			$('#game_table_game').children().children().eq(i-1)
				.append('<td id="gametable_pid_'+i+'_'+j+'"></td>');
		} 
	}
	
	//redéfinition des tailles
	$('#game_toolbox tr').css("height", img_piece_size);
	$('#game_toolbox td').css("width", img_piece_size);
	$('#game_toolbox div').css("width", img_piece_size)
		.css("height", img_piece_size)
		.css("max-width", img_piece_size+"px")
		.css("max-height", img_piece_size+"px");
	$('#game_gametable tr').css("height", img_piece_size)
		.css("width", img_piece_size)
		.css("max-width", img_piece_size+"px")
		.css("max-height", img_piece_size+"px");
	$('#game_gametable img').css("width", img_piece_size)
		.css("height", img_piece_size)
		.css("max-width", img_piece_size+"px")
		.css("max-height", img_piece_size+"px");
}

//change l'image finale affichée
function setImage(imgSrc){
	$('#img_full').attr("src", imgSrc);
	
	var arrPosRandomCouple = new Array();
	var i = 0; var j = 0; //compteurs
	for (i = 0; i < tbl_size_x; i++) 
	{ 
	   	for (j = 0; j < tbl_size_y; j++) 
		{ 
			//random
			var posX; var poxY;
			//validation de l'utilisation unique du couple
			do{
				var valid1 = true;
				posX = Math.floor((Math.random()*tbl_size_x)+1);
				posY = Math.floor((Math.random()*tbl_size_y)+1);
				
				arrPosRandomCouple.forEach(function(item){
					if(item == "s"+posX+";"+posY+"e"){
						valid1 = false;
					}
				});
				
			} while(valid1 == false) ;
			//enregistrement du couple
			arrPosRandomCouple.push("s"+posX+";"+posY+"e")
			
			//création de la div
			var piid = (tbl_size_x*i)+j;
			$('#toolbox_pid_'+posX+'_'+posY).append(
				$('<div id="piid'+piid+'"></div>')
				.css("width", img_piece_size+"px")
				.css("height", img_piece_size+"px")
				.css("max-width", img_piece_size+"px")
				.css("max-height", img_piece_size+"px")
				.css("background-image", 'url('+imgSrc+')')
				.css("background-size", img_full_size+"px, "+img_full_size+"px")
				.css("background-position", "-"+(img_piece_size*j)+"px -"+(img_piece_size*i)+"px"));
				
			//initialisation de draggable
			$('#piid'+piid+'').draggable({
				containment : '#game_wrap_dragdrop1',
				revert : "invalid"
			});
			
			//initialisation du droppable
			$('#toolbox_pid_'+(i+1)+'_'+(j+1)).droppable({
				drop: function( event, ui ) {
					$(ui.draggable).appendTo($(this));
					$(ui.draggable).css("top","0px")
						.css("left", "0px");
				}
			});
			
			$('#gametable_pid_'+(i+1)+'_'+(j+1)).droppable({
				drop: function( event, ui ) {
					$(ui.draggable).appendTo($(this));
					$(ui.draggable).css("top","0px")
						.css("left", "0px");
					checkPuzzle();
				}
			});
		} 
	} 
}

function checkPuzzle(){
	var testValidate = true;
	var i = 0; var j = 0;
	for(i = 1; i <= tbl_size_x; i++){
		for(j = 1; j <= tbl_size_y; j++){
			var piid = "piid"+(tbl_size_x*(i-1)+(j-1));
			
			var testElement = document.getElementById('gametable_pid_'+i+'_'+j);
			if(testElement.hasChildNodes()){
				var testID = testElement.firstChild.getAttribute("id");
				if(testID != piid){
					testValidate = false;
				}
			} else {
				testValidate = false;
			}
		}
	}
	
	//resultat du jeu
	if(testValidate == true){
		puzzleCompleted();
	}
}

function setDifficulty(difID){
	if(difID == "0"){
		tbl_size_x = 3;
		tbl_size_y = 3;
	}
	else if(difID == "1"){
		tbl_size_x = 4;
		tbl_size_y = 4;
	}
	else if(difID == "2"){
		tbl_size_x = 5;
		tbl_size_y = 5;
	}
	img_piece_size = img_full_size/tbl_size_x;
}


function actionNewGame(){
	clearGame();
	setDifficulty(document.getElementById('sel_difficulty').value);
	recreateImageBody();
	setImage(randomImage()); //TODO image random
	startChrono();
}

function startChrono(){
	chrono_centi++;
	if (chrono_centi>9){
		chrono_centi=0;
		chrono_sec++;
	}
	if (chrono_sec>59){
		chrono_sec=0;
		chrono_min++;
	}
	chrono_c = setTimeout('startChrono()',100)
	$('#chrono_p').html(chrono_min+" : "+chrono_sec);
}

function stopChrono(){
	clearTimeout(chrono_c);
	chrono_centi=0;
	chrono_sec=0;
	chrono_min=0;
}

function puzzleCompleted(){
	var savedMin = chrono_min;
	var savedSec = chrono_sec;
	stopChrono();
	alert("Bravo vous avez réussi le puzzle !");
}

function randomImage(){
	do{
		var valid = false;
		var randomID = Math.floor((Math.random()*3)+1);
		var selectedImage = "";
		
		switch(randomID){
		case 1:
			selectedImage = "img/img01.jpg";
			break;	
		case 2:
			selectedImage = "img/img02.jpg";
			break;	
		case 3:
			selectedImage = "img/img03.jpg";
			break;	
		}
		
		if(selectedImage != last_image){
			valid == true;
			last_image = selectedImage;
			return selectedImage;
		}
	} while (valid == false);
}