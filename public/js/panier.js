var list = JSON.parse(sessionStorage.listPanier);
var api = "http://localhost:3001";//"https://pure-tundra-14882.herokuapp.com";
var TOTAL = 0.0;

$().ready(function () {

    renderPanier();
    renderPanierInfo();
    
    // Passer au formulaire
    $('#valider').on('click', function(){
        if(list.length != 0){
            $('#myTabs a[href="#profile"]').tab('show')
        }
    });

    // Valider le formulaire
    $("#formConfirmation").submit(function(event){
        event.preventDefault();
        valide = true;
        if($("#inputNom").val() == ""){
            $("#inputNom").next(".help-block").fadeIn().text("Veuillez entrer votre nom");
                valide =false;
        }else if(!$("#inputNom").val().match(/^[a-z]+$/i)){
            $("#inputNom").next(".help-block").fadeIn().text("Veuillez entrer votre nom valide");
            valide =false;
        }else{
            $("#inputNom").next(".help-block").fadeOut();
        }
                      
        if($("#inputPrenom").val() == ""){
            $("#inputPrenom").next(".help-block").fadeIn().text("Veuillez entrer votre nom");
            valide =false;
        }else if(!$("#inputPrenom").val().match(/^[a-z]+$/i)){
            $("#inputPrenom").next(".help-block").fadeIn().text("Veuillez entrer votre nom valide");
            valide =false;
        }else{
            $("#inputPrenom").next(".help-block").fadeOut();
        }
                
        if($("#inputEmail").val() == ""){
            $("#inputEmail").next(".help-block").fadeIn().text("Veuillez entrer votre emal");
            valide =false;
        }else if(!$("#inputEmail").val().match('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i')){
            $("#inputEmail").next(".help-block").fadeIn().text("Veuillez entrer votre email valide");
            valide =false;
        }
        else{
            $("#inputEmail").next(".help-block").fadeOut();
        }

        if($("#inputAdresse").val() == ""){
            $("#inputAdresse").next(".help-block").fadeIn().text("Veuillez entrer votre adresse");
            valide =false;
        }else if($("#inputAdresse").val().length < 20){
            $("#inputAdresse").next(".help-block").fadeIn().text("Veuillez entrer au moin 20 caractères");
            valide =false;
        }else{
            $("#inputAdresse").next(".help-block").fadeOut();
        }
                                  
        if(valide==true){
            var messageConfirmation = `${$("#inputNom").val()} ${$("#inputPrenom").val()}, 
            <br>Merci pour votre commande. 
            Nous l'avons recue et traiterons dans les plus brefs delais. 
            <br>Votre numero de commande est le 7458626.`;
            console.log(messageConfirmation);   
            $('#messageConfi').append(messageConfirmation);

            $('#myTabs a[href="#messages"]').tab('show')
            sessionStorage.removeItem('listPanier');
            list.splice(0,list.length)
            sessionStorage['listPanier'] = JSON.stringify(list);
            renderPanierInfo();
        }  
    }); 
    
});

function deleteArticulo(id){
    list.splice(id,1);
    console.log(id);
    renderPanierInfo();
    renderPanier();
    if (list.length == 0) {
        TOTAL = 0.00;
        renderInfo(TOTAL);
    }
    if(sessionStorage.listPanier){
        sessionStorage.removeItem('listPanier');
        sessionStorage['listPanier'] = JSON.stringify(list);
    }else{
        sessionStorage['listPanier'] = JSON.stringify(list);
    }
}

function renderPanierInfo(){
    var $badge = $('span#badgePanier');

    $badge.empty();
    $badge.append(list.length);
    console.log(list.length);

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

function renderPanier(){

    var templatePanier = `<tr>
                            <td><img class="ip" src=":img:" alt=""</td>
                            <td>
                                <dl>
                                <dt>Description</dt>
                                <dd>:description:</dd>
                                </dl>
                            </td>
                            <td>
                                <select class="form-control cuadrado qte-size">
                                  <option value=":x1:">1</option>
                                  <option value=":x2:">2</option>
                                  <option value=":x3:">3</option>
                                  <option value=":x4:">4</option>
                                  <option value=":x5:">5</option>
                                </select>
                            </td>
                            <td><p class="prix-size">:precio: €</p></td>
                            <td><button class="btn btn-default btn-xs btn-table-delete" onclick="deleteArticulo(':id:');"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td>
                        </tr>`;
    

    var $panier = $('#panier');
    $('#header-table').siblings('tr').remove();

    $(list).each(function (index, element){
        //console.log('index : ', index, ' elemt : ',element);
        $.ajax(`${api}/api/product/${element}`, {
            success : function (data){
                var article = templatePanier 
                    .replace(':img:', data.product.picture)
                    .replace(':description:', data.product.description)  
                    .replace(':id:', data.product._id)
                    .replace(':precio:', data.product.price)

                TOTAL = TOTAL + parseFloat(data.product.price);
                console.log(data.product.price);
                renderInfo(TOTAL);
                $panier.append(article);         
            }
        });
    });
}

function renderInfo(subTotal){

    var $sousTotal = $('dd.sous-total').empty();
    $sousTotal.append(`${subTotal.toFixed(2)} €`);
    console.log(subTotal);
    var $ttc = $('h4.ttc').empty();
    $ttc.append(`${subTotal.toFixed(2)} €`)

}