"use strict";
jQuery(document).on('ready', function() {
    var slFeedbackOwl = document.getElementById('slFeedbackOwl')
    if (slFeedbackOwl !== null) {
        $(slFeedbackOwl).owlCarousel({
            loop: true,
            autoplay: true,
            nav: false,
            dots: false,
            margin: 30,
            items: 2,
            autoplayTimeout: 5500,
            autoplaySpeed: 2000,
            responsive: {
                0: {
                    items: 1,
                },
                1200: {
                    items: 2,
                }
            }
        })
    }
    var slVendorSingleOwl = document.getElementById('slVendorSingleOwl')
    if (slVendorSingleOwl !== null) {
        $(slVendorSingleOwl).owlCarousel({
            loop: true,
            autoplay: true,
            nav: false,
            dots: false,
            items: 1,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
        })
    }
    var slProductProviderOwl = document.getElementById('slProductProviderOwl')
    if (slProductProviderOwl !== null) {
        $(slProductProviderOwl).owlCarousel({
            loop: false,
            autoplay: false,
            nav: false,
            dots: true,
            items: 1,
            autoplayTimeout: 5500,
            autoplaySpeed: 2000,
        })
    }
    var syncOwl = document.getElementById('sl-sync1')
    if (syncOwl !== null) {
        function product() {
            var sync1 = jQuery('#sl-sync1');
            var sync2 = jQuery('#sl-sync2');
            var slidesPerPage = 3;
            var syncedSecondary = true;
            sync1.owlCarousel({
                items: 1,
                loop: true,
                nav: false,
                dots: false,
                autoplay: false,
                video: true,
                Height: 370,
                lazyLoad: true,
                slideSpeed: 2000,
                responsiveRefreshRate: 200,
            }).on('changed.owl.carousel', syncPosition);
            sync2.on('initialized.owl.carousel', function() {
                    sync2.find(".owl-item").eq(0).addClass("current");
                })
                .owlCarousel({
                    // items : slidesPerPage,
                    items: 6,
                    dots: false,
                    nav: false,
                    margin: 10,
                    smartSpeed: 200,
                    slideSpeed: 500,
                    slideBy: slidesPerPage,
                    responsiveRefreshRate: 100,
                }).on('changed.owl.carousel', syncPosition2);

            function syncPosition(el) {
                var count = el.item.count - 1;
                var current = Math.round(el.item.index - (el.item.count / 2) - .5);
                if (current < 0) {
                    current = count;
                }
                if (current > count) {
                    current = 0;
                }
                sync2
                    .find(".owl-item")
                    .removeClass("current")
                    .eq(current)
                    .addClass("current")
                var onscreen = sync2.find('.owl-item.active').length - 1;
                var start = sync2.find('.owl-item.active').first().index();
                var end = sync2.find('.owl-item.active').last().index();
                if (current > end) {
                    sync2.data('owl.carousel').to(current, 100, true);
                }
                if (current < start) {
                    sync2.data('owl.carousel').to(current - onscreen, 100, true);
                }
            }

            function syncPosition2(el) {
                if (syncedSecondary) {
                    var number = el.item.index;
                    sync1.data('owl.carousel').to(number, 100, true);
                }
            }
            sync2.on("click", ".owl-item", function(e) {
                e.preventDefault();
                var number = jQuery(this).index();
                sync1.data('owl.carousel').to(number, 300, true);
            });
        }
        product();
    }

    var slInputIncrement = document.querySelector('.sl-input-increment')
    if (slInputIncrement !== null) {
        jQuery(document).on('click', '.sl-input-increment', function(e) {
            var $input = $(this).closest('.sl-vlaue-btn').find('.sl-input-number');
            var val = parseInt($input.val(), 10);
            $input.val(val + 1);
        })
        jQuery(document).on('click', '.sl-input-decrement', function(e) {
            var $input = $(this).closest('.sl-vlaue-btn').find('.sl-input-number');
            var val = parseInt($input.val(), 10);
            if (val >= 1) {
                $input.val(val - 1);
            }
        })
    }

    // DHB USER LOGO START

    jQuery(document).on('click', '#collapseUser a', function(e) {
        e.preventDefault();
        var usertext = jQuery(this).find('em').text();
        var circlecolor = jQuery(this).find('span').attr('class');

        jQuery('.sl-userStatus__content > a:first-child > span + em').html(usertext)
        jQuery('.sl-userStatus__content > a:first-child > span em').removeClass().addClass(circlecolor);
        $('#collapseUser').collapse('toggle');
    });
    // DHB USER LOGO END
    //navbar close for mobile view

    $(document).click(function(event) {
        var clickover = $(event.target);
        var _opened = $("#slMainNavbar").hasClass("show");
        var isToggler = clickover.hasClass("lnr lnr-menu") || clickover.hasClass("navbar-toggler");
        if (_opened && !(isToggler)) {
            $(".navbar-toggler").click();
        }
    });

    //Add shadow to header
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
            $("header").addClass("shadow");
        } else {
            $("header").removeClass("shadow");
        }
    });

    //header functions

    var didScroll;
    var lastScrollTop = 0;
    var delta = 70;

    $(window).scroll(function(event) {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var w = $(window).width();
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(lastScrollTop - st) <= delta)
            return;
        if (st > lastScrollTop) {
            if (w <= 620) {
                $(".sl-main-header__lower").css("overflow", "hidden");
                $(".sl-main-header__lower").css("padding", "0px");
            }
            $(".sl-main-header__lower").css("height", "0px");
            $(".sl-main-header__logo img").css('width', '40px');

        } else {
            if (w <= 620) {
                $(".sl-main-header__lower").css("overflow", "visible");
                $(".sl-main-header__lower").css("padding", "10px 20px");
            }
            $(".sl-main-header__lower").css("height", "49px");
            $(".sl-main-header__logo img").css('width', '70px');
        }
        lastScrollTop = st;
    }

    /* ADD AND REMOVE CLASS END */
    jQuery(document).on('click', '#sl-closeasidebar', function(e) {
        jQuery('#sl-asidebar').toggleClass('sl-asideshow')
        jQuery('body').toggleClass('sl-scrollY-none')
        jQuery(this).find('i').toggleClass('lnr lnr-layers lnr lnr-cross')
    })


    jQuery(document).on('click', '.sl-inbox__user--list li', function() {
        jQuery('.sl-dashboardbox__content').addClass('sl-message-js')
    });
    jQuery(document).on('click', '.sl-messageUser__back', function() {
        jQuery('.sl-dashboardbox__content').removeClass('sl-message-js')
    });
    /* MOBILE MENU*/
    function collapseMenu() {
        if ($(window).width() < 992) {
            jQuery('.sl-main-header .navbar-collapse .sl-navbar-nav li.sl-dropdown a, .sl-main-header .navbar-collapse .sl-navbar-nav li.menu-item-has-mega-menu a').on('click', function() {
                jQuery(this).parent('li').toggleClass('sl-open-menu');
                jQuery(this).next().slideToggle(300);
            });
        }
    }
    collapseMenu();
    /* MOBILE MENU*/
    jQuery(document).on('click', '#sl-appointmentPopupbtn1', function(e) {
        jQuery(this).closest('.modal-content').addClass('sl-appointmentPopup__1 sl-appointmentPopup-footer')
    })
    jQuery(document).on('click', '#sl-appointmentPopupbtn2', function(e) {
        jQuery(this).closest('.modal-content').removeClass('sl-appointmentPopup__1').addClass('sl-appointmentPopup__2')
    })
    jQuery(document).on('click', '#sl-appointmentPopupbtn3', function(e) {
        jQuery(this).closest('.modal-content').removeClass('sl-appointmentPopup__2').addClass('sl-appointmentPopup__3')
    })
    jQuery(document).on('click', '.modal-header .close', function(e) {
            jQuery(this).closest('.modal-content').removeClass('sl-appointmentPopup__1 sl-appointmentPopup__2 sl-appointmentPopup__3 sl-appointmentPopup-footer')
        })
        /* PRELOADER*/
    jQuery(window).on('load', function() {
        jQuery(".preloader-outer").fadeOut();
    });
});