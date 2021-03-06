
document.addEventListener("DOMContentLoaded", function(event) {

	var isEmpty = false;
	// Validation for empty input in lookupcode search section
	document.getElementById("searchBtn").addEventListener("click", validateForm);

	// Search button action
	if(!isEmpty){
		document.getElementById("searchBtn").addEventListener("click", searchActionClick);
	}

	// Search results click action
	const listItemElements = document.getElementById("createProductList").querySelectorAll("li");
	for(let i = 0; i < listItemElements.length; i++) {
		listItemElements[i].addEventListener("click", onListItemClicked);
	}
});

function validateForm() {
    var lookupCode = document.forms["Search"]["lookupCode"].value;
    	
	if (lookupCode == "") {
		document.getElementById("createProductList").innerHTML="";
		document.getElementById("msg").innerHTML = "The lookup code field must not be empty.";
		isEmpty = true;
		return false;
	}
	document.getElementById("msg").innerHTML = "";

	isEmpty = false;
	return true;
}

function searchActionClick(event) {
	const searchActionElement = event.target;
	searchActionElement.disabled = true;
	const searchActionUrl = ("/api/transaction/?lookupCode=" + getLookupCode());

	if (getLookupCode() != null){

		var searchResults = ajaxGet(searchActionUrl, (callbackResponse) => {
			searchActionElement.disabled = false;
			if (isSuccessResponse(callbackResponse)) {
				if (!callbackResponse.data.isEmpty) { 
					if (callbackResponse.data.length == 0){
						document.getElementById("msg").innerHTML = "Result not found";
					}

					document.getElementById("createProductList").innerHTML="";
					for(var i=0; i < callbackResponse.data.length; i++){						   
						createProductList(callbackResponse.data[i]);
					}							
				}
			}
		});
	}
};

function createProductList(returnLookupCode) {
	const ulElement = document.getElementById("createProductList");
	const liElement = document.createElement("li");
	liElement.addEventListener("click", onListItemClicked);
	const lookupCodeDisplayElement = document.createElement("Span");
	const priseDisplayElement = document.createElement("Span");
	const countDisplayElement = document.createElement("Span");
	var priceText = document.createTextNode("Price: ")
	var countText = document.createTextNode("Count: ")

	if (returnLookupCode != "") {
		lookupCodeDisplayElement.innerHTML = returnLookupCode.lookupCode;
		priseDisplayElement.innerHTML = returnLookupCode.price;
		countDisplayElement.innerHTML = returnLookupCode.count;
		lookupCodeDisplayElement.classList.add("productLookupCodeDisplay");
		priseDisplayElement.classList.add("productPriceDisplay");
		countDisplayElement.classList.add("productCountDisplay");
		liElement.appendChild(lookupCodeDisplayElement);
		liElement.appendChild(document.createElement("br"));
		liElement.appendChild(priceText);
		liElement.appendChild(priseDisplayElement);
		liElement.appendChild(document.createElement("br"));
		liElement.appendChild(countText);
		liElement.appendChild(countDisplayElement);
		liElement.appendChild(document.createElement("br"));
		ulElement.appendChild(liElement);	
	}
};

function getCLickedListItemElement(target) {
	let clickedElement = target;

	while(clickedElement.tagName !== "LI") {
		clickedElement = clickedElement.parentElement;
	}

	return clickedElement;
}

function onListItemClicked(event) {
	const unorderedListElement = document.getElementById("createProductList");
	addProductToCart(getCLickedListItemElement(event.target));
	unorderedListElement.removeChild(getCLickedListItemElement(event.target));
}

function addProductToCart(clickedListItem) {

	const lookupCode = clickedListItem.querySelector("span.productLookupCodeDisplay").innerHTML;
	const price = clickedListItem.querySelector("span.productPriceDisplay").innerHTML;
	const productCount = clickedListItem.querySelector("span.productCountDisplay").innerHTML;
	var priceText = document.createTextNode("Price: ");
	var counrText = document.createTextNode("Count: ");
	var count = 1;

	const tableElement = document.getElementById("cart");
	const trElement = document.createElement("li");
	const cartDisplayElement = document.createElement("span");
	const priceDisplayElement = document.createElement("span");
	const deleteBtnElement = document.createElement("input");
	const countInput = document.createElement("input");
	const nextDeleteBtnId = (tableElement.childElementCount +1).toString();

	const quantityInputElement = document.createElement("input");

	quantityInputElement.setAttribute('id','quantityInput'+ nextDeleteBtnId);
	deleteBtnElement.setAttribute('type','number');
	deleteBtnElement.setAttribute('value','1');
	deleteBtnElement.setAttribute('style', 'float:left');

	priceDisplayElement.setAttribute("id","getPrice");
	cartDisplayElement.setAttribute("id", "getLookUpCode");
	countInput.setAttribute("id","countIn");
	countInput.setAttribute("type","number");
	countInput.setAttribute('value',count);
	deleteBtnElement.setAttribute('id','deleteBtn'+ nextDeleteBtnId);
	deleteBtnElement.setAttribute('type','button');
	deleteBtnElement.setAttribute('value','Delete');
	deleteBtnElement.setAttribute('style', 'float:right');

	deleteBtnElement.addEventListener("click",deleteProductFromCart);

	cartDisplayElement.innerHTML = lookupCode;
	priceDisplayElement.innerHTML = price;

	cartDisplayElement.classList.add("cart");
	trElement.appendChild(cartDisplayElement);
	trElement.appendChild(document.createTextNode("     "));
	trElement.appendChild(deleteBtnElement);
	trElement.appendChild(document.createElement("br"));
	trElement.appendChild(priceText);
	trElement.appendChild(priceDisplayElement);
	trElement.appendChild(document.createElement("br"));
	trElement.appendChild(counrText);
	trElement.appendChild(countInput);
	trElement.appendChild(document.createElement("br"));
	tableElement.appendChild(trElement);
}

function totalProduct(){
	var count = document.querySelectorAll("[id^=countIn]");
	var productCount = 0;
	var totalCount = 0;
	var price=document.querySelectorAll("[id^=getPrice]");
	var productPrice = 0;
	var totalPrice = 0;
	var lookUpCode =document.querySelectorAll("[id^=getLookUpCode]"); 
	var totalArray = document.getElementById("cart").querySelectorAll("li");
	var cart = [];

	for (var i=0; i<totalArray.length; i++){

		productCount = count[i].value;
		LUC = lookUpCode[i].innerHTML;
		productPrice = parseInt(productCount) * parseInt(price[i].innerHTML);
		totalCount = parseInt(totalCount) + parseInt(productCount);
		totalPrice = totalPrice + productPrice;
		
		var product = {"LookUpCode": LUC, "Price": productPrice, "Count": productCount};
		
		cart.push(product);
		showProductsSummary(cart[i]);
	}	
	
	var msg = "Transaction Total Count: " + totalCount +"<br>"+ " Transaction Total Price: " + totalPrice;


	if(count!=null && price!=null){
		document.getElementById("total").innerHTML = msg;
	}
	
	//var str = JSON.stringify(cart);

	//document.getElementById('summaryDisplay').innerHTML = str;

	document.getElementById("header").innerHTML = "<h1 class=\"primary-message\">Transaction Summary</h1>";
	document.getElementById("searchArea").remove();	
	document.getElementById("cartObject").remove();	
	document.getElementById("home").setAttribute("style", "visibility:visible");	
}
function showProductsSummary(cart) {
	const ulElement = document.getElementById("summaryTable");
	const liElement = document.createElement("li");
	const lookupCodeDisplayElement = document.createElement("span");
	const priseDisplayElement = document.createElement("span");
	const countDisplayElement = document.createElement("span");
	var priceText = document.createTextNode("Total price:  ");
	var countText = document.createTextNode("Total count:  ");

	liElement.setAttribute('style', 'text-align:center');
		lookupCodeDisplayElement.innerHTML = cart["LookUpCode"];
		priseDisplayElement.innerHTML = cart["Price"];
		countDisplayElement.innerHTML = cart["Count"];
		lookupCodeDisplayElement.classList.add("summaryTable");
		priseDisplayElement.classList.add("summaryTable");
		countDisplayElement.classList.add("summaryTable");
		liElement.appendChild(lookupCodeDisplayElement);
		liElement.appendChild(document.createElement("br"));
		liElement.appendChild(priceText);
		liElement.appendChild(priseDisplayElement);
		liElement.appendChild(document.createElement("br"));
		liElement.appendChild(countText);
		liElement.appendChild(countDisplayElement);
		liElement.appendChild(document.createElement("br"));
		ulElement.appendChild(liElement);


};

function deleteProductFromCart(event){
	const deleteActionElement = event.target;
	const closestElement = deleteActionElement.closest('li');
	document.getElementById("cart").removeChild(closestElement);	

}

// Getters and setters
function getLookupCode() {
	return getLookupCodeElement().value;
}
function setLookupCode(lookupCode) {
	getLookupCodeElement().value = lookupCode;
}
function getLookupCodeElement() {
	return document.getElementById("lookupCode");
}
