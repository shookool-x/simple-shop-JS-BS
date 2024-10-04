function renderProducts(products) {
  const productList = document.getElementById('product-list');

  const productsHTML = products.map(
    product =>
      `<div class="product col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
              <a href="#"
                  ><img
                      class="card-img-top"
                      src="${product.image}"
                      alt="${product.title}"
              /></a>
              <div class="card-body">
                  <h4 class="card-title">
                      ${product.title}
                  </h4>
                  <h5 class="product-price">${formatMoney(product.price)} تومان</h5>
                  <p class="card-text">
                      ${product.description}
                  </p>
              </div>
              <div class="card-footer">
                  <button class="btn btn-light add-to-cart" data-product-id="${product.id}">
                      افزودن به سبد خرید
                  </button>
              </div>
          </div>
      </div>`
  ).join('');
  productList.innerHTML = productsHTML;
}

function formatMoney(price) {

  let i = price.length % 3;
  i = i === 0 ? 3 : i;
  let newPrice = price.slice(0, i);
  while (i < price.length) {
    newPrice = newPrice + "," + price.slice(i, i + 3);
    i += 3;
  }
  return newPrice;
}


let products = [];
let destination = document.querySelector("#cart-list");

window
  .fetch('http://localhost:3000/products')
  .then(res => res.json())
  .then(result => {
    products = result;
    renderProducts(products);
    renderMyShop();
    renderCheckedItem(products);
    let findingElem = document.querySelectorAll(".add-to-cart");
    findingElem.forEach((item, index) => item.addEventListener('click', () => {
      addToShopCart(products[index]);
    }));
  });

function addToShopCart(obj) {
  let myAdd = `
        <div class="list-group-item d-flex justify-content-between align-items-center cart-item" data-product-id="${obj.id}">
        <span>${obj.title}</span>
        <div>
          <button class="btn inc-quantity" onclick="miniplus(event)" data-product-id="${obj.id}">+</button>
          <span>1</span>
          <button class="btn dec-quantity" onclick="decrz(event)" data-product-id="${obj.id}">-</button>
        </div>
        </div>`

  //... where is product in localstorage array!
  let myitems = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  let ii = myitems.findIndex(x => x.id == obj.id);

  if (ii == -1) {

    obj.quantity = 1;
    myitems.push(obj);
    localStorage.setItem("cart", JSON.stringify(myitems));
    destination.innerHTML += myAdd;

  } else {
    myitems[ii].quantity++;
    localStorage.setItem("cart", JSON.stringify(myitems));
    let xElem = destination.querySelector(`[data-product-id="${obj.id}"].inc-quantity+span`);
    xElem.innerHTML = parseInt(xElem.innerHTML) + 1;
  }
}

function miniplus(event) {

  // ... ADD span
  let itemId = event.target.getAttribute('data-product-id');
  let divElem = event.target.parentElement;
  let des = divElem.querySelector("span");
  des.innerHTML = Number(des.innerHTML) + 1;
  // ... ADD localstorage
  let myitems = JSON.parse(localStorage.getItem("cart"));
  let ii = myitems.findIndex(x => x.id == itemId);
  myitems[ii].quantity++;
  localStorage.setItem("cart", JSON.stringify(myitems));

}

function decrz(event) {

  let itemId = event.target.getAttribute('data-product-id');
  let divElem = event.target.parentElement;
  let des = divElem.querySelector("span");
  let myitems = JSON.parse(localStorage.getItem("cart"));
  let ii = myitems.findIndex(x => x.id == itemId);

  if (parseInt(des.innerHTML) > 1) {

    des.innerHTML = Number(des.innerHTML) - 1;
    myitems[ii].quantity--;
    localStorage.setItem("cart", JSON.stringify(myitems));

  } else if (parseInt(des.innerHTML) == 1) {

    divElem.parentElement.remove();
    myitems.splice(ii, 1);
    localStorage.setItem("cart", JSON.stringify(myitems));

  }
};

function renderMyShop() {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  } else {
    myitems = JSON.parse(localStorage.getItem("cart"));
    myitems.forEach(x => {
      let addtarget = `
          <div class="list-group-item d-flex justify-content-between align-items-center cart-item" data-product-id="${x.id}">
            <span>${x.title}</span>
            <div>
              <button class="btn inc-quantity" onclick="miniplus(event)" data-product-id="${x.id}">+</button>
              <span>${x.quantity}</span>
              <button class="btn dec-quantity" onclick="decrz(event)" data-product-id="${x.id}">-</button>
            </div>
            </div>`;
      destination.innerHTML += addtarget;
    })
  };
};

function renderCheckedItem(prdArr) {
  let newShow = [];
  let allCheck = document.querySelectorAll("input.brand-select");
  allCheck.forEach(x => x.addEventListener('click', () => {
    if (x.checked) {
      newShow.push(...prdArr.filter(item => item.brand === x.getAttribute("data-brand-name")));
      renderProducts(newShow);
    } else {
      newShow = newShow.filter(item => item.brand != x.getAttribute("data-brand-name"));
      renderProducts(newShow);
    }

    newShow.length == 0 && (renderProducts(prdArr));
  }))
}






