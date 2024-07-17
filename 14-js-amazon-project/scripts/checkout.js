import {cart, removeFromCart,calculateCartQuantity,setCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import formatCurrency from '../scripts/utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js'

hello();
const today=dayjs();
const deliveryDate=today.add(7,'days');

console.log(deliveryDate.format('dddd, MMMM D'));

let cartSummaryHtml;

cart.forEach((cartItem)=>{
  let matchingItem;
  products.forEach((productItem)=>{
    if (productItem.id===cartItem.productId){
      matchingItem=productItem;
    }
  })

  const deliveryOptionId = cartItem.deliveryOptionId;
  
  let deliveryOption;

  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId)
    deliveryOption = option;
  })

  const today = dayjs();
  const deliveryDate = today.add( deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');

cartSummaryHtml +=`
  <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
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
                ${deliveryOptionsHTML(matchingItem,cartItem)}
              </div>
            </div>
          </div>
  `

   
  


})

function deliveryOptionsHTML(matchingItem, cartItem) {
  let html = '';
  deliveryOptions.forEach( (deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add( deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents===0 ?
      'Free'
      :
      `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    
      html += `<div class="delivery-option">
      <input type="radio" ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingItem.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div>`
  })
  return html;
}


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


