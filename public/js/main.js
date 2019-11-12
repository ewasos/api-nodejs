// 
var list = new Array();
var api = "http://localhost:3001";//"https://pure-tundra-14882.herokuapp.com";
var productos = new Array();

$().ready(function(){

	if(sessionStorage.listPanier){
		list = JSON.parse(sessionStorage.listPanier);
		renderPanierInfo();
	}

	renderMoinCher();

	$('[data-toggle="popover"]').popover()

	$('#menu a[href="#homme"]').on('click', function(){
		$( this ).parent().toggleClass('active');
		$('#menu a[href="#femme"]').parent().removeClass('active');
		$('#menu a[href="#enfant"]').parent().removeClass('active');
		$('#menu a[href="index.html"]').parent().removeClass('active');
		renderArticle(0,2,1,'homme');
	});
	$('#menu a[href="#femme"]').on('click', function(){
		$( this ).parent().toggleClass('active');
		$('#menu a[href="#homme"]').parent().removeClass('active');
		$('#menu a[href="#enfant"]').parent().removeClass('active');
		$('#menu a[href="index.html"]').parent().removeClass('active');
		renderArticle(0,2,1,'femme');
	});
	$('#menu a[href="#enfant"]').on('click', function(){
		$( this ).parent().toggleClass('active');
		$('#menu a[href="#femme"]').parent().removeClass('active');
		$('#menu a[href="#homme"]').parent().removeClass('active');
		$('#menu a[href="index.html"]').parent().removeClass('active');
		renderArticle(0,2,1,'enfant');
	});

});

function renderArticle(index, puntero, activePagination, category){

	// Objetos del DOM 
	var $articleContainer = $("#produits");
	var $pagination = $('#pagination');

	// Vaciar el div de los productos
	$articleContainer.empty();

	// Variables para crear nuevos objetos
	var titleHeader = $('#headerCategory');
	titleHeader.empty();
	titleHeader.append(category);

	var contentPagination = `<li class=":active1:"><a href="#" onclick="renderArticle(0,2,1,'${category}')">1</a></li>
							  <li class=":active2:"><a href="#" onclick="renderArticle(3,5,2,'${category}')">2</a></li>
							  <li class=":active3:"><a href="#" onclick="renderArticle(6,8,3,'${category}')">3</a></li>
							  <li class=":active4"><a href="#" onclick="renderArticle(9,9,4,'${category}')">4</a></li>`;
	
	$pagination.empty();
	if(activePagination == 1){
		var auxP = contentPagination.replace(':active1:', 'active')
		$pagination.append(auxP);
	}else if(activePagination == 2) {
		var auxP = contentPagination.replace(':active2:', 'active')
		$pagination.append(auxP);

	}else if(activePagination == 3) {
		var auxP = contentPagination.replace(':active3:', 'active')
		$pagination.append(auxP);
	}else if(activePagination == 4) {
		var auxP = contentPagination.replace(':active4:', 'active')
		$pagination.append(auxP);
	}

	var thumbnail = `<div class="col-sm-6 col-md-4">
						<div class="thumbnail cuadrado">
					      <img src=":img:" alt=":alt:">
					      <div class="caption">
					        <h3>:name:</h3>
					        <div class="dotdotdot">:description:</div>
					        <div class="row">
					        	<div class="col-md-8">
					        		<a href="#" class="btn btn-default cuadrado" role="button" onclick="afficherModal(':idModal:');"> Afficher produit</a>
					        	</div>
					        	<div class="col-md-4">
					        		<h4 class="centrer">:price:  €</h4>
					        	</div>
					        </div>
					        <p><button type="submit" class="btn btn-primary btn-lg btn-block cuadrado" onclick="ajouterPanier(':id:');">Ajouter au panier</button></p>
					      </div>
					    </div>
					</div>`;
	console.log(category);
	$.ajax(`${api}/api/product/${category}`,{
		success: function(data){
			$(data.products).each(function(i, product){
				
				if(i >= index && i<= puntero ){
					var article = thumbnail
						.replace(':name:', product.name)
						.replace(':img:', product.picture)					
						.replace(':alt:', product.name)
						.replace(':price:', product.price)
						.replace(':description:', product.description)
						.replace(':id:', product._id)
						.replace(':idModal:', product._id)
							
					var $article = $(article);
					$articleContainer.append($article);
				}
			});
		}
	});
	setTimeout(function(){
	  	$('div.dotdotdot').dotdotdot({
			after: "a.readmore"
		});
	}, 1000);
}

function renderPanierInfo(){

	var $badge = $('span#badgePanier');

	$badge.empty();
    $badge.append(list.length);

	var templateListInfo = `<tr>
                                <td rowspan="2"><img class="i" src=":img:" alt=""></td>
                            	<td colspan="3"><p class="text-capitalize">:name:</p></td>
                            </tr>
                            <tr>
                            	<td>x 1</td>
                                <td>:price:  €</td>
                                <td><button class="btn btn-default btn-xs" onclick="deleteArticulo(':id:');"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td>
                            </tr>`;

    var $listInfo = $('#listInfo');
    $listInfo.empty();

    $(list).each(function (index, element){
        console.log('index : ', index, ' elemt : ',element);
        $.ajax(`${api}/api/product/${element}`, {
            success : function (data){
                var articleList = templateListInfo
                	.replace(':id:', index)
                    .replace(':img:', data.product.picture)
                    .replace(':name:', data.product.name)
                    .replace(':price:', data.product.price)

                $listInfo.append(articleList)       
            }
        }); 
    });                           
}

// Funciones para la lista de articulos en el carrito

// Agregar
function ajouterPanier(id){
	
	if(list.indexOf(id) == -1){
		list.push(id);
		renderPanierInfo();
		//alert('Article ajouté avec success!');
		
		$('#alert').modal({
			show: true
		})

		if(sessionStorage.listPanier){
			sessionStorage.removeItem('listPanier');
			sessionStorage['listPanier'] = JSON.stringify(list);
		}else{
			sessionStorage['listPanier'] = JSON.stringify(list);
		}
	}
	console.log(list);
}
// Eliminar
function deleteArticulo(id){
	list.splice(id,1);
	console.log(id);
	renderPanierInfo();
	if(sessionStorage.listPanier){
		sessionStorage.removeItem('listPanier');
		sessionStorage['listPanier'] = JSON.stringify(list);
	}else{
		sessionStorage['listPanier'] = JSON.stringify(list);
	}
}

function renderMoinCher(){
	var $articleContainer = $("#produits");

	var titleHeader = $('#headerCategory');
	titleHeader.empty();
	titleHeader.append('Les moin chers');

	var thumbnail = `<div class="col-sm-6 col-md-4">
						<div class="thumbnail cuadrado">
					      <img src=":img:" alt=":alt:">
					      <div class="caption">
					        <h3>:name:</h3>
					        <div class="dotdotdot">:description:</div>
					        <div class="row">
					        	<div class="col-md-8">
					        		<a href="#" class="btn btn-default cuadrado" onclick="afficherModal(':idModal:');"> Afficher produit</a>
					        	</div>
					        	<div class="col-md-4">
					        		<h4 class="centrer">:price:  €</h4>
					        	</div>
					        </div>
					        <p><button type="submit" class="btn btn-primary btn-lg btn-block cuadrado" onclick="ajouterPanier(':id:');">Ajouter au panier</button></p>
					      </div>
					    </div>
					</div>`;

	$articleContainer.empty();
	$articleContainer.append(titleHeader);
	$.ajax(`${api}/api/product/moinCher`,{
		success: function(data){
			$(data.products).each(function(index, product){
				var article = thumbnail
					.replace(':name:', product.name)
					.replace(':img:', product.picture)					
					.replace(':alt:', product.name)
					.replace(':price:', product.price)
					.replace(':description:', product.description)
					.replace(':id:', product._id)
					.replace(':idModal:', product._id)
								
				var $article = $(article);
				$articleContainer.append($article);		
			});
		}
	});

	setTimeout(function(){
	  	$('div.dotdotdot').dotdotdot({
			after: "a.readmore"
		});
	}, 1000);
}

function afficherModal(id){
	var information = `<div class="row">
	        		<div class="col-md-10 col-md-offset-1">
	        			<h3>:name:</h3>
	        		</div>
	        	</div>
	        	<div class="row">
	        		<div class="col-md-6 col-md-offset-3">
	        			<img class="sizeImg" src=":img:" alt=":alt:">
	        		</div>
	        	</div>
	        	<div class="row">
	        		<div class="col-md-10 col-md-offset-1">
	        			<p>:description:</p>
	        		</div>
	        	</div>
	        	<div class="row">
	        		<div class="col-md-3 col-md-offset-1">
	        			<h4>Stock : :stock:</h4>
	        		</div>
	        		<div class="col-md-2 col-md-offset-5">
	        			<h4>:price: €</h4>
	        		</div>
	        	</div>`;

	var $modalAffiche = $('#afficheDescrip');
	$modalAffiche.empty();

	$.ajax(`${api}/api/product/${id}`,{
		success: function(data){				
			var article = information
				.replace(':name:', data.product.name)
				.replace(':img:', data.product.picture)					
				.replace(':alt:', data.product.name)
				.replace(':price:', data.product.price)
				.replace(':description:', data.product.description)
				.replace(':stock:', data.product.stock)
							
			var $article = $(article);
			$modalAffiche.append($article);
		}
	});

	$('#myModal').modal({
	 	show: true,
	})
}