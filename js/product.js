/* =========================================
   PRODUCT FILTER
========================================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get the category from the button
        const selectedCategory =
            button.dataset.category;


        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class to clicked button
        button.classList.add("active");


        // Show / hide products
        productCards.forEach(function(card) {

            const productCategory =
                card.dataset.category;


            if (
                selectedCategory === "all" ||
                selectedCategory === productCategory
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});



/* =========================================
   SHOPPING CART
========================================= */

let cartCount = 0;


const addCartButtons =
    document.querySelectorAll(".add-cart-btn");

const cartItems =
    document.getElementById("cart-items");


const cartCountHeader =
    document.getElementById("cart-count");


addCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Increase cart count
        cartCount++;


        // Get product information
        const productName =
            button.dataset.name;

        const productPrice =
            button.dataset.price;


        console.log(
            productName + " - ₹" + productPrice
        );


        // Update cart notice
        if (cartCount === 1) {

            cartItems.textContent =
                "1 item in cart";

        } else {

            cartItems.textContent =
                cartCount + " items in cart";

        }


        // Update header cart if your teammate's
        // header has #cart-count
        if (cartCountHeader) {

            cartCountHeader.textContent =
                cartCount;

        }

    });

});

