$(document).ready(function() {
  $("img").addClass("img-responsive");
  $("#project-imgs").children().children().css("padding", "30px");
  $("span").addClass("fa-4x");

  // the code below allows for scrolling intra-page jump
  // $('a[href^="#"]').on('click',function (e) {
  //   e.preventDefault();
  //
  //   var target = this.hash;
  //   var $target = $(target);
  //
  //   $('html, body').stop().animate({
  //       'scrollTop': $target.offset().top
  //   }, 900, 'swing', function () {
  //       window.location.hash = target;
  //   });
  //  });

  // Add scrollspy to <body>
  $('body').scrollspy({target: ".navbar", offset: 50});

  // Add smooth scrolling to all links inside a navbar
  $(".nav a").on('click', function(event){
    console.log(this.hash);
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    }  // End if
  });
});
