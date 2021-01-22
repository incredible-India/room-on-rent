$('.responsive').slick({
    dots: true,
    infinite: false,//if we do this true it will keep on sliding and repeting the element after finish
    speed: 300,
    slidesToShow: 3,//kitna dikhega screen pe
    slidesToScroll: 2,//kitna slide hoga
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });


  function stopLoad(){
    document.getElementsByClassName('spiner')[0].style.display = "none";
  }