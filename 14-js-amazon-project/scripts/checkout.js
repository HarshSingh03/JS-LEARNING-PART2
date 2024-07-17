import {cart, removeFromCart,calculateCartQuantity,setCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from '../scripts/utils/money.js';

let cartSummaryHtml;

cart.forEach((cartItem)=>{
  let matchingItem;
  products.forEach((productItem)=>{
    if (productItem.id===cartItem.productId){
      matchingItem=productItem;
    }
  })

cartSummaryHtml +=`
  <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingItem.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingItem.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingItem.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">
                    Update
                  </span>

                  <input class="quantity-input js-quantity-input-${matchingItem.id}" hidden>
                  
                  <span class="save-quantity-link link-primary js-save-quantity-${matchingItem.id}" hidden >
                    Save
                  </span>

                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingItem.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `

  
  


})

document.querySelector('.js-order-summary').innerHTML=cartSummaryHtml;

document.querySelectorAll('.js-delete-link').forEach( (link) => {
  link.addEventListener('click',()=>{
    const productId=link.dataset.productId;
    removeFromCart(productId);
    const container=document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
  })
})


document.querySelectorAll('.js-update-link').forEach( (link)=> {
  link.addEventListener('click',() =>{
    const productId = link.dataset.productId;
    const quantitySave=document.querySelector('.js-save-quantity-'+productId);
    const quantityInput=document.querySelector('.js-quantity-input-'+productId);
    const quantityLabel=document.querySelector('.js-quantity-label-'+productId);
    quantityInput.hidden=false;
    quantitySave.hidden=false;
    quantitySave.addEventListener( 'click',()=>{
      if (quantityInput.value<=0){
        removeFromCart(productId);
        document.querySelector('.js-cart-item-container-'+productId).remove();
        return;
      }
      setCartQuantity(productId,quantityInput.value);
      quantityInput.hidden=true;
      quantitySave.hidden=true;
      quantityLabel.innerText=quantityInput.value;
    } );
  });
});
document.querySelector('.js-cart-count').innerText=calculateCartQuantity();


