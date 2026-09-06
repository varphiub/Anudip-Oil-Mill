/* =========================================
   GALLERY JAVASCRIPT
========================================= */

const galleryCards = document.querySelectorAll(".gallery-card");

const featuredImage = document.getElementById("featuredImage");
const featuredTitle = document.getElementById("featuredTitle");
const featuredCaption = document.getElementById("featuredCaption");
const featuredTag = document.getElementById("featuredTag");


galleryCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const image = card.querySelector("img");

        const title = card.getAttribute("data-title");

        const caption = card.getAttribute("data-caption");

        const tag = card.getAttribute("data-tag");


        /* Change featured image */

        featuredImage.src = image.src;

        featuredImage.alt = title;


        /* Change text */

        featuredTitle.textContent = title;

        featuredCaption.textContent = caption;

        featuredTag.textContent = tag;

    });

});