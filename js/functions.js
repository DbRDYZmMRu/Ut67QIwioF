/* ----------------------------------
	Script
-------------------------------------
	01. mCustomScrollbar
	02. Dropdown
	03. NavbarCollapse onclick active menu
	04. MagnificPopup
	05. Date picker
	06. Fixed navbar
	07. Swiper silder
	08. Video audio
	09. Countdown
	10. Select2
	11. datepicker
	12. Rangeslider
	13. Group loop
	14. AOS animation
	15. AOS animation reveal effect
	16. Element fancy effect
	17. Slick slider
	18. Instafeed
	19. Fullpage
	20. Contact form
	21. Google map
	22. loader
	23. Isotope
	24. Before after 
	25. Counter
*/

(function ($) {
	"use strict"; // Start of use strict

	jQuery.fn.exists = function () {
		return this.length > 0;
	}

	/* ------------------------------------------------------------------------
	 * On window resize
	 * ------------------------------------------------------------------------ */
	$(window).on('load resize', function () {
		/* ------------------------------------------------------------------------
		 * mCustomScrollbar
		 * ------------------------------------------------------------------------ */
		var _navbar_collapse = $('.navbar-collapse');
		if (_navbar_collapse.length > 0) {
			var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			if (winWidth < 991) {
				_navbar_collapse.mCustomScrollbar({
					theme: "light",
				});
			} else {
				_navbar_collapse.mCustomScrollbar('destroy');
			}
		}

	});


	/* ------------------------------------------------------------------------
	 * On Document ready 
	 * ------------------------------------------------------------------------ */
	$(document).ready(function ($) {

		var changeClass = function (name) {
			$('#search').removeAttr('class').addClass(name);
		}

		/* ------------------------------------------------------------------------
		 * Dropdown 
		 * ------------------------------------------------------------------------ */

		$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
			if (!$(this).next().hasClass('show')) {
				$(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
			}
			var _subMenu = $(this).next('.dropdown-menu');
			_subMenu.toggleClass('show');

			$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
				$('.dropdown-submenu .show').removeClass('show');
			});

			return false;
		});

		/* ------------------------------------------------------------------------
		 * navbarCollapse onclick active menu
		 * ------------------------------------------------------------------------ */
		var _navbar_link = $('#navbarCollapse.one-page-classic ul.navbar-nav li.nav-item a.nav-link');
		_navbar_link.on('click', function (e) {
			var _class = _navbar_link.parent('li.active').removeClass('active');
			var _this = jQuery(this);
			_this.parent('li').addClass('active');
			if ($(window).width() < 992) {
				$('.navbar-toggler').trigger('click');
			}
		});

		/* ------------------------------------------------------------------------
		 * MagnificPopup
		 * ------------------------------------------------------------------------ */
		var _popup_container = $('.popup-container');
		if (_popup_container.length > 0) {
			_popup_container.magnificPopup({
				type: 'image',
				delegate: 'a.portfolio-popup', // child items selector, by clicking on it popup will open
				mainClass: 'mfp-with-zoom',
				gallery: {
					enabled: true
				}
			});
		}

		if ($('.popup-youtube').length > 0 || $('.popup-vimeo').length > 0 || $('.popup-gmaps').length > 0) {
			$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});
		}

		/* ------------------------------------------------------------------------
		 * Fixed navbar
		 * ------------------------------------------------------------------------ */
		var _navbar_var = $('.navbar');
		if (_navbar_var.length > 0) {
			$(window).scroll(function () {
				if ($(window).scrollTop() >= 150) {
					_navbar_var.addClass('fixed-navbar');
				} else {
					_navbar_var.removeClass('fixed-navbar');
				}
			});
		}

		//Scroll event
		$(window).scroll(function () {
			var scrolled = $(window).scrollTop();
			if (scrolled > 200) jQuery('.go-top').fadeIn('slow');
			if (scrolled < 200) jQuery('.go-top').fadeOut('slow');
		});

		//Click event
		$('.go-top').on('click', function () {
			$('html, body').animate({
				scrollTop: '0'
			}, 200);
		});

		/* ------------------------------------------------------------------------
		 * Swiper silder
		 * ------------------------------------------------------------------------ */
		var swipercount = 1;
		var _swiper_container = jQuery('div.swiper-container');
		if (_swiper_container.length > 0) {
			_swiper_container.each(function (index, value) {
				var _this = jQuery(this);
				var _div_id = 'swiper-container-block-' + swipercount;
				_this.attr('id', _div_id);
				swipercount++;

				var _slider_per_view = _this.attr('data-slidesPerView') ? _this.attr('data-slidesPerView') : 1;
				var _slider_per_view_mobile = _this.attr('data-mobile-slidesPerView') ? _this.attr('data-mobile-slidesPerView') : 1;
				var _slider_per_view_tablet = _this.attr('data-tablet-slidesPerView') ? _this.attr('data-tablet-slidesPerView') : 1;
				var _slider_per_view_laptop = _this.attr('data-laptop-slidesPerView') ? _this.attr('data-laptop-slidesPerView') : 1;

				var _space_between = _this.attr('data-spaceBetween') ? _this.attr('data-spaceBetween') : 40;
				var _loop = _this.attr('data-loop') ? _this.attr('data-loop') : true;
				var _auto_height = _this.attr('data-auto-height') ? _this.data('auto-height') : false;
				var _autoplay = _this.attr('data-autoplay') ? _this.data('autoplay') : true;

				if (false === _autoplay) {
					var _autoplay_obj = false;
				} else {
					var _autoplay_obj = {
						delay: _this.attr('data-auto-speed') ? _this.attr('data-auto-speed') : 500,
						disableOnInteraction: _this.attr('data-disable-on-touch') ? _this.data('disable-on-touch') : false,
					};
				}

				var _pagination = _this.attr('data-pagination') ? _this.data('pagination') : true;
				if (false === _pagination) {
					var _pagination_obj = false;
					_this.find('.swiper-pagination').hide();
				} else {
					var _pagination_obj = {
						el: '.swiper-pagination',
						clickable: true,
					};
				}

				var _navigation = _this.attr('data-navigation') ? _this.data('navigation') : true;

				if (false === _navigation) {
					var _navigation_obj = false;

					_this.find('.swiper-button-next').hide();
					_this.find('.swiper-button-prev').hide();
				} else {
					var _navigation_obj = {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
						hiddenClass: 'swiper-button-hidden',
					};
				}


				var swiper = new Swiper('#' + _div_id, {
					slidesPerView: 1,
					spaceBetween: Number(_space_between),
					loop: _loop,
					autoplay: _autoplay_obj,
					autoHeight: _auto_height,
					pagination: _pagination_obj,
					navigation: _navigation_obj,
					breakpoints: {
						360: {
							slidesPerView: Number(_slider_per_view_mobile),
						},
						768: {
							slidesPerView: Number(_slider_per_view_tablet),
						},
						1024: {
							slidesPerView: Number(_slider_per_view_laptop),
						},
						1200: {
							slidesPerView: Number(_slider_per_view),
						},
					}
				});
			});
		}
		/* ------------------------------------------------------------------------
		 * Video audio
		 * ------------------------------------------------------------------------ */

		/* ------------------------------------------------------------------------
		 * Countdown
		 * ------------------------------------------------------------------------ */
		var _countdown_item = $('.countdown-item');
		if (_countdown_item.length > 0) {
			_countdown_item.countdown({
				date: '12/24/2022 23:59:59'
			});
		}

		/* ------------------------------------------------------------------------
		 * Select2
		 * ------------------------------------------------------------------------ */
		var _select2_basic_single = $('.js-example-basic-single')
		if (_select2_basic_single.length > 0) {
			_select2_basic_single.select2();
		}

		var _select2_basic_multiple = $('.js-example-basic-multiple-limit')
		if (_select2_basic_multiple.length > 0) {
			_select2_basic_multiple.select2({
				maximumSelectionLength: 2
			});
		}

		/* ------------------------------------------------------------------------
		 * datepicker
		 * ------------------------------------------------------------------------ */

		var _dates = $('input[name="dates"]');
		if (_dates.length > 0) {
			_dates.daterangepicker();
		}

		var _daterange = $('input[name="daterange"]');
		if (_daterange.exists()) {
			_daterange.daterangepicker({
				opens: 'left'
			}, function (start, end, label) {
				console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
			});
		}



		var _datetimes = $('input[name="datetimes"]');
		if (_datetimes.exists()) {
			_datetimes.daterangepicker({
				timePicker: true,
				startDate: moment().startOf('hour'),
				endDate: moment().startOf('hour').add(32, 'hour'),
				locale: {
					format: 'M/DD hh:mm A'
				}
			});
		}

		var _birthday = $('input[name="birthday"]');
		if (_birthday.exists()) {
			_birthday.daterangepicker({
				singleDatePicker: true,
				showDropdowns: true,
				minYear: 1901,
				maxYear: parseInt(moment().format('YYYY'), 10)
			}, function (start, end, label) {
				var years = moment().diff(start, 'years');
				alert('You are ' + years + ' years old!');
			});
		}

		var _reportrange = $('#reportrange');

		function cb(start, end) {
			$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		}
		if (_reportrange.exists()) {
			var start = moment().subtract(29, 'days');
			var end = moment();

			_reportrange.daterangepicker({
				startDate: start,
				endDate: end,
				ranges: {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				}
			}, cb);
			cb(start, end);
		}

		var _datefilter = $('input[name="datefilter"]');
		if (_datefilter.exists()) {
			_datefilter.daterangepicker({
				autoUpdateInput: false,
				locale: {
					cancelLabel: 'Clear'
				}
			});

			_datefilter.on('apply.daterangepicker', function (ev, picker) {
				$(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
			});

			_datefilter.on('cancel.daterangepicker', function (ev, picker) {
				$(this).val('');
			});
		}

		var _timepicker1 = $('#timepicker1');
		if (_timepicker1.exists()) {
			_timepicker1.timepicker({
				defaultTime: 'current',
				showInputs: true,
				icons: {
					up: 'fa fa-angle-up',
					down: 'fa fa-angle-down'
				}
			});
		}

		var _timepicker2 = $('#timepicker2');
		if (_timepicker2.exists()) {
			_timepicker2.timepicker({
				showSeconds: true,
				showInputs: true,
				icons: {
					up: 'fa fa-angle-up',
					down: 'fa fa-angle-down'
				}
			});
		}

		/* ------------------------------------------------------------------------
		 * Rangeslider
		 * ------------------------------------------------------------------------ */
		var _rangeslider_basic = $('#rangeslider-basic');
		if (_rangeslider_basic.exists()) {
			_rangeslider_basic.ionRangeSlider({
				min: 100,
				max: 1000,
				from: 550
			});
		}

		var _rangeslider_double = $('#rangeslider-double');
		if (_rangeslider_double.exists()) {
			_rangeslider_double.ionRangeSlider({
				type: "double",
				grid: true,
				min: 0,
				max: 1000,
				from: 200,
				to: 800,
				prefix: "$"
			});
		}

		var _rangeslider_range_step = $('#rangeslider-range-step');
		if (_rangeslider_range_step.exists()) {
			_rangeslider_range_step.ionRangeSlider({
				type: "double",
				grid: true,
				min: -1000,
				max: 1000,
				from: -500,
				to: 500
			});
		}

		var _rangeslider_custom_values = $('#rangeslider-custom-values');
		if (_rangeslider_custom_values.exists()) {
			var custom_values = [0, 10, 100, 1000, 10000, 100000, 1000000];

			// be careful! FROM and TO should be index of values array
			var my_from = custom_values.indexOf(10);
			var my_to = custom_values.indexOf(10000);

			_rangeslider_custom_values.ionRangeSlider({
				type: "double",
				grid: true,
				from: my_from,
				to: my_to,
				values: custom_values
			});
		}

		var _rangeslider_strings = $('#rangeslider-strings');
		if (_rangeslider_strings.exists()) {
			_rangeslider_strings.ionRangeSlider({
				grid: true,
				from: new Date().getMonth(),
				values: [
					"Jan", "Feb", "Mar", "Apr", "May", "Jun",
					"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
				]
			});
		}

		var _rangeslider_prettify = $('#rangeslider-prettify');
		if (_rangeslider_prettify.exists()) {
			function my_prettify(n) {
				var num = Math.log2(n);
				return n + " → " + (+num.toFixed(3));
			}

			_rangeslider_prettify.ionRangeSlider({
				skin: "big",
				grid: true,
				min: 1,
				max: 1000,
				from: 100,
				prettify: my_prettify
			});
		}


		// tooltip

		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		})

		// popover
		var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
		var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
			return new bootstrap.Popover(popoverTriggerEl)
		})

		/* ------------------------------------------------------------------------
		 * Group loop
		 * ------------------------------------------------------------------------ */
		var _grouploop_1 = $('#grouploop-1');
		_grouploop_1
		if (_grouploop_1.exists()) {
			_grouploop_1.grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap',
			});
		}
		var _grouploop_2 = $('#grouploop-2');
		_grouploop_2
		if (_grouploop_2.exists()) {
			$('#grouploop-2').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_3 = $('#grouploop-3');
		_grouploop_3
		if (_grouploop_3.exists()) {
			$('#grouploop-3').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_4 = $('#grouploop-4');
		_grouploop_4
		if (_grouploop_4.exists()) {
			$('#grouploop-4').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_5 = $('#grouploop-5');
		_grouploop_5
		if (_grouploop_5.exists()) {
			$('#grouploop-5').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_6 = $('#grouploop-6');
		_grouploop_6
		if (_grouploop_6.exists()) {
			$('#grouploop-6').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_7 = $('#grouploop-7');
		_grouploop_7
		if (_grouploop_7.exists()) {
			$('#grouploop-7').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_8 = $('#grouploop-8');
		_grouploop_8
		if (_grouploop_8.exists()) {
			$('#grouploop-8').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_9 = $('#grouploop-9');
		_grouploop_9
		if (_grouploop_9.exists()) {
			$('#grouploop-9').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_10 = $('#grouploop-10');
		_grouploop_10
		if (_grouploop_10.exists()) {
			$('#grouploop-10').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_11 = $('#grouploop-11');
		_grouploop_11
		if (_grouploop_11.exists()) {
			$('#grouploop-11').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_12 = $('#grouploop-12');
		_grouploop_12
		if (_grouploop_12.exists()) {
			$('#grouploop-12').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_13 = $('#grouploop-13');
		_grouploop_13
		if (_grouploop_13.exists()) {
			$('#grouploop-13').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_14 = $('#grouploop-14');
		_grouploop_14
		if (_grouploop_14.exists()) {
			$('#grouploop-14').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_15 = $('#grouploop-15');
		_grouploop_15
		if (_grouploop_15.exists()) {
			$('#grouploop-15').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_16 = $('#grouploop-16');
		_grouploop_16
		if (_grouploop_16.exists()) {
			$('#grouploop-16').grouploop({
				velocity: 3,
				forward: false,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}
		var _grouploop_17 = $('#grouploop-17');
		_grouploop_17
		if (_grouploop_17.exists()) {
			$('#grouploop-17').grouploop({
				velocity: 3,
				forward: true,
				pauseOnHover: true,
				childNode: '.item',
				childWrapper: '.item-wrap'
			});
		}

		/* ------------------------------------------------------------------------
		 * AOS animation
		 * ------------------------------------------------------------------------ */
		var _data_aos = $('div').find(`[data-aos]`);
		if (0 < _data_aos.length) {
			AOS.init();
		}

		/* ------------------------------------------------------------------------
		 * AOS animation reveal effect
		 * ------------------------------------------------------------------------ */
		var _data_aos_reveal = $('slice-ptb.aos-animation').find(`[data-aos]`);
		if (0 < _data_aos_reveal.length) {
			AOS.init({
				duration: 500,
				easing: 'ease-out-quart',
				once: true
			});
		}

		/* ------------------------------------------------------------------------
		 * Element fancy effect
		 * ------------------------------------------------------------------------ */
		const delSections = document.querySelectorAll('.delayed-section');
		if (0 < delSections.length) {

			delSections.forEach(section => {
				const containerAnim = gsap.to(section.querySelector('.innerContainer'), {
					y: "100vh",
					ease: "none"
				});


				const imageAnim = gsap.to(section.querySelector('img'), {
					y: "-100vh",
					ease: "none",
					paused: true
				});


				const scrub = gsap.to(imageAnim, {
					progress: 1,
					paused: true,
					ease: "power3",
					duration: parseFloat(section.dataset.scrub) || 0.1,
					overwrite: true
				});


				ScrollTrigger.create({
					animation: containerAnim,
					scrub: true,
					trigger: section,
					start: "top bottom",
					end: "bottom top",
					onUpdate: self => {
						scrub.vars.progress = self.progress;
						scrub.invalidate().restart();
					}
				});

			});
		}
		$(document).on('change', '.BornHS__Input', function () {
			if ($(this).is(':checked')) {
				$('.BornHS__Wrapper').addClass('BornHS__Blur');
			} else {
				$('.BornHS__Wrapper').removeClass('BornHS__Blur');
			}
		});

		/* index-creative */
		if ($('.swiper-container-animation').length > 0) {
			let swiperAnimation = new SwiperAnimation();
			let swiper = new Swiper('.swiper-container-animation', {
				slidesPerView: 1,
				spaceBetween: 50,
				loop: true,
				effect: "slide",
				centeredSlides: true,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
				},
				on: {
					init: function () {
						swiperAnimation.init(this).animate();
					},
					slideChange: function () {
						swiperAnimation.init(this).animate();
					}
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}
			});
		}

		/* index-creative NOT USED*/
		var _img_content = $('.img-content-hover');
		if (_img_content.length > 0) {
			var imgContent = document.querySelectorAll('.img-content-hover');

			function showImgContent(e) {
				for (var i = 0; i < imgContent.length; i++) {
					var x = e.pageX;
					var y = e.pageY;
					imgContent[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
				}
			}
			document.addEventListener('mousemove', showImgContent);
		}

		var _radial_progress = $('svg.radial-progress');

		if (_radial_progress.length > 0) {

			// Remove svg.radial-progress .complete inline styling
			_radial_progress.each(function (index, value) {
				$(this).find($('circle.complete')).removeAttr('style');
			});

			// Activate progress animation on scroll
			$(window).scroll(function () {
				_radial_progress.each(function (index, value) {
					// If svg.radial-progress is approximately 25% vertically into the window when scrolling from the top or the bottom
					if (
						$(window).scrollTop() > $(this).offset().top - ($(window).height() * 0.75) &&
						$(window).scrollTop() < $(this).offset().top + $(this).height() - ($(window).height() * 0.25)
					) {
						// Get percentage of progress
						var percent = $(value).data('percentage');
						// Get radius of the svg's circle.complete
						var radius = $(this).find($('circle.complete')).attr('r');
						// Get circumference (2πr)
						var circumference = 2 * Math.PI * radius;
						// Get stroke-dashoffset value based on the percentage of the circumference
						var strokeDashOffset = circumference - ((percent * circumference) / 100);
						// Transition progress for 1.25 seconds
						$(this).find($('circle.complete')).animate({
							'stroke-dashoffset': strokeDashOffset
						}, 1250);
					}
				});
			}).trigger('scroll');
		}


		var _demo_3 = $('#demo_3');
		if (_demo_3.length > 0) {
			_demo_3.ionRangeSlider({
				type: "double",
				min: 0,
				max: 1000,
				from: 100,
				to: 500,
				drag_interval: true,
				min_interval: null,
				max_interval: null
			});
		}

		var _demo_4 = $('#demo_4');
		if (_demo_4.length > 0) {
			_demo_4.ionRangeSlider({
				type: "double",
				min: 0,
				max: 1000,
				from: 200,
				to: 800,
				drag_interval: true,
				min_interval: null,
				max_interval: null
			});
		}


		/* ------------------------------------------------------------------------
		 * Slick slider
		 * ------------------------------------------------------------------------ */

		var _slickforslider = $('.slider-for');
		if (_slickforslider.length > 0) {
			$('.slider-for').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
				fade: false,
				asNavFor: '.slider-nav'
			});
			var _slicknavslider = $('.slider-nav');
			if (_slicknavslider.length > 0) {
				$('.slider-nav').slick({
					slidesToShow: 3,
					slidesToScroll: 1,
					asNavFor: '.slider-for',
					dots: true,
					centerMode: true,
					focusOnSelect: true
				});
			}
		}
		/* ------------------------------------------------------------------------
		 * Instafeed
		 * ------------------------------------------------------------------------ */
		var _instafeed = $('#instafeed');
		if (_instafeed.length > 0) {
			var _token = 'IGQVJYV2o1amJlaE5SZAVIyRVE3R01KMmg3TEs0bnZAPZAmRRSlI0SmtnTG1CT2JuSUxfanU0Y24wSE0yY2EyLWFsaEdTSjJ0M25jLW9VaXhtcGxmd3BPQ1VNNVRHVmc0SVBiUGlzTDBqczdUX3haZADdWdwZDZD';
			var _no_of_post = _instafeed.data('total-post');

			var _insta_url = 'https://graph.instagram.com/me/media';
			var _response_fields = '?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&access_token=';

			$.ajax({
				url: _insta_url + _response_fields + _token,
				type: 'GET',
				success: function (response) {
					var _html = '';
					var _posts = response.data;

					if (_posts.length > 0) {
						var _limit = (_posts.length <= _no_of_post) ? _posts.length : _no_of_post;
						var i = 0;
						var j = 1;
						while (j <= _limit) {
							var _post = _posts[i];
							if (_posts.length <= i) {
								break;
							}
							if ('IMAGE' === _post.media_type) {
								_html += '<div class="instafeed-item">';
								_html += '<a target="_blank" href="' + _post.permalink + '" class="">';
								_html += '<img src="' + _post.media_url + '" class="img-fluid" />';
								_html += '</a>';
								_html += '</div>';
								j++;
							}
							i++;
						}

					}
					_instafeed.html(_html);
				},
				error: function (data) {
					console.log(data)
				}
			});
		}

		/* ------------------------------------------------------------------------
		 * Fullpage
		 * ------------------------------------------------------------------------ */
		var _fullpage = $('#fullpage');
		if (_fullpage.length > 0) {
			var myFullpage = new fullpage('#fullpage', {
				verticalCentered: false
			});
		}


		/* ------------------------------------------------------------------------
		 * Contact form
		 * ------------------------------------------------------------------------ */

		$('#infinity_contact').submit(function (e) {
			e.preventDefault();

			$('.contact-alert').remove();
			var _form = $('#infinity_contact');
			if (_form[0].checkValidity() === false) {
				_form.addClass('was-validated');
				e.stopPropagation();
			} else {
				$.ajax({
					url: 'php/sendmail.php',
					type: 'post',
					data: _form.serialize() + '&submit=contact',
					dataType: 'json',
					beforeSend: function () {
						$('#btn-submit').button('loading');
					},
					complete: function () {
						$('#btn-submit').button('reset');
					},
					success: function (json) {
						if (true === json['success']) {
							_form.before('<div class="alert alert-success alert-dismissible contact-alert">' + json['message'] + '</div>')
						} else {
							_form.before('<div class="alert alert-danger alert-dismissible contact-alert">' + json['message'] + '</div>')
						}
						_form[0].reset();
					},
					error: function (xhr, ajaxOptions, thrownError) {
						alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
					}
				});
			}
		});

		/* ------------------------------------------------------------------------
		 * Google map
		 * ------------------------------------------------------------------------ */

		var _google_map = $('#map');
		if (_google_map.length > 0) {
			// When the window has finished loading create our google map below
			google.maps.event.addDomListener(window, 'load', init);

			function init() {
				// Basic options for a simple Google Map
				// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
				var mapOptions = {
					// How zoomed in you want the map to start at (always required)
					zoom: 11,

					// The latitude and longitude to center the map (always required)
					center: new google.maps.LatLng(40.6700, -73.9400), // New York

					// How you would like to style the map. 
					// This is where you would paste any style found on Snazzy Maps.
					styles: [{
						"featureType": "all",
						"elementType": "labels.text.fill",
						"stylers": [{
							"saturation": 36
						}, {
							"color": "#000000"
						}, {
							"lightness": 40
						}]
					}, {
						"featureType": "all",
						"elementType": "labels.text.stroke",
						"stylers": [{
							"visibility": "on"
						}, {
							"color": "#000000"
						}, {
							"lightness": 16
						}]
					}, {
						"featureType": "all",
						"elementType": "labels.icon",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.fill",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 20
						}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 17
						}, {
							"weight": 1.2
						}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 20
						}]
					}, {
						"featureType": "poi",
						"elementType": "geometry",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 21
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 17
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 29
						}, {
							"weight": 0.2
						}]
					}, {
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 18
						}]
					}, {
						"featureType": "road.local",
						"elementType": "geometry",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 16
						}]
					}, {
						"featureType": "transit",
						"elementType": "geometry",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 19
						}]
					}, {
						"featureType": "water",
						"elementType": "geometry",
						"stylers": [{
							"color": "#000000"
						}, {
							"lightness": 17
						}]
					}]
				};

				// Get the HTML DOM element that will contain your map 
				// We are using a div with id="map" seen below in the <body>
				var mapElement = document.getElementById('map');

				// Create the Google Map using our element and options defined above
				var map = new google.maps.Map(mapElement, mapOptions);

				// Let's also add a marker while we're at it
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(40.6700, -73.9400),
					map: map,
					title: 'Snazzy!'
				});
			}
		}


	}); /* End ready document */



	/* ------------------------------------------------------------------------
	 * window on load
	 * ------------------------------------------------------------------------ */
	$(window).on('load', function () {

		/* ------------------------------------------------------------------------
		 * loader
		 * ------------------------------------------------------------------------ */
var _lorder = $('.template-loader');

if (_lorder.length > 0) {
  setTimeout(function() {
    _lorder.fadeOut(100);
  }, 3000); // 3000ms = 3s delay
}
		/* ------------------------------------------------------------------------
		 * Isotope
		 * ------------------------------------------------------------------------ */

		var _gridisotope = $('.grid');
		if (_gridisotope.length > 0) {
			_gridisotope.isotope({
				itemSelector: '.grid-item',
				layoutMode: 'fitRows',
			});
		}

		// filter items on button click
		$('.filter-button-group').on('click', 'li', function () {
			var _filterValue = $(this).attr('data-filter');
			$('.grid, .grid-masonry').isotope({
				filter: _filterValue
			});
			$('.filter-button-group li').removeClass('active');
			$(this).addClass('active');
		});


		var _masonryisotope = $('.grid-masonry');
		if (_masonryisotope.length > 0) {
			// masonry
			_masonryisotope.isotope({
				itemSelector: '.grid-item',
				percentPosition: true,
				masonry: {
					// use outer width of grid-sizer for columnWidth
					columnWidth: '.grid-sizer'
				}
			});
		}

		/* ------------------------------------------------------------------------
		 * Counter
		 * ------------------------------------------------------------------------ */
		var _counter = $('.counter');
		if (_counter.length > 0) {
			_counter.appear(function () {
				(function ($) {
					$.fn.countTo = function (options) {
						options = options || {};
						return $(this).each(function () {
							// set options for current element
							var settings = $.extend({}, $.fn.countTo.defaults, {
								from: $(this).data('from'),
								to: $(this).data('to'),
								speed: $(this).data('speed'),
								refreshInterval: $(this).data('refresh-interval'),
								decimals: $(this).data('decimals')
							}, options);
							// how many times to update the value, and how much to increment the value on each update
							var loops = Math.ceil(settings.speed / settings.refreshInterval),
								increment = (settings.to - settings.from) / loops;
							// references & variables that will change with each update
							var self = this,
								$self = $(this),
								loopCount = 0,
								value = settings.from,
								data = $self.data('countTo') || {};
							$self.data('countTo', data);
							// if an existing interval can be found, clear it first
							if (data.interval) {
								clearInterval(data.interval);
							}
							data.interval = setInterval(updateTimer, settings.refreshInterval);
							// initialize the element with the starting value
							render(value);

							function updateTimer() {
								value += increment;
								loopCount++;
								render(value);
								if (typeof (settings.onUpdate) == 'function') {
									settings.onUpdate.call(self, value);
								}
								if (loopCount >= loops) {
									// remove the interval
									$self.removeData('countTo');
									clearInterval(data.interval);
									value = settings.to;

									if (typeof (settings.onComplete) == 'function') {
										settings.onComplete.call(self, value);
									}
								}
							}

							function render(value) {
								var formattedValue = settings.formatter.call(self, value, settings);
								$self.html(formattedValue);
							}
						});
					};
					$.fn.countTo.defaults = {
						from: 0, // the number the element should start at
						to: 0, // the number the element should end at
						speed: 1000, // how long it should take to count between the target numbers
						refreshInterval: 100, // how often the element should be updated
						decimals: 0, // the number of decimal places to show
						formatter: formatter, // handler for formatting the value before rendering
						onUpdate: null, // callback method for every time the element is updated
						onComplete: null // callback method for when the element finishes updating
					};

					function formatter(value, settings) {
						return value.toFixed(settings.decimals);
					}
				}(jQuery));

				jQuery(function ($) {
					// custom formatting example
					$('.count-number').data('countToOptions', {
						formatter: function (value, options) {
							return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
						}
					});
					// start all the timers
					$('.timer').each(count);

					function count(options) {
						var $this = $(this);
						options = $.extend({}, options || {}, $this.data('countToOptions') || {});
						$this.countTo(options);
					}
				});
			});
		}

		/* ------------------------------------------------------------------------
		 * Before after 
		 * ------------------------------------------------------------------------ */
		var _comparison_slider = $('#comparison #slider');
		if (_comparison_slider.length > 0) {
			_comparison_slider.on('input', function (e) {
				var _handle = $('#comparison #handle');
				var _divisor = $('#comparison #divisor');
				_handle.css('left', _comparison_slider.val() + "%");
				_divisor.css('width', _comparison_slider.val() + "%");
			});
			_comparison_slider.trigger('input');

		}

		/* ------------------------------------------------------------------------
		 * Cookie Pop-up
		 * ------------------------------------------------------------------------ */

		var _my_model = $('#myModal');
		var cookieUse = false;
		if (localStorage.getItem("cookieUse")) {
			cookieUse = localStorage.getItem("cookieUse")
		} else {
			$('#myModal').modal('show');
			_my_model.on('shown.bs.modal', function () {
				$('#myInput').trigger('focus')
			});
		}

		/* ------------------------------------------------------------------------
		 * Get Full year
		 * ------------------------------------------------------------------------ */

		var _getFullYear = document.getElementById("getFullYear").innerHTML = new Date().getFullYear();

		/* ------------------------------------------------------------------------

const imageSources = [
  {"src": "../images/ads/Crocs.gif", "link": "https://www.crocs.com/stories/come-as-you-are.html"},
  {"src": "../images/ads/cocacola.gif", "link": "(link unavailable)"},
  {"src": "../images/ads/Hilton.jpg", "link": "(link unavailable)"},
  {"src": "../images/ads/818.gif", "link": "(link unavailable)"},
  {"src": "../images/ads/Rhode.gif", "link": "(link unavailable)"}
];

let currentImageIndex = 0;

function shuffleImages() {
  try {
    const adImage = document.getElementById("ad-image");
    const imageLink = document.getElementById("image-link");

    if (adImage && imageLink) {
      adImage.src = imageSources[currentImageIndex].src;
      imageLink.href = imageSources[currentImageIndex].link;

      currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    } else {
      console.error("Image or link element not found.");
    }
  } catch (error) {
    console.error("Error shuffling images:", error);
  }
}

// Change image every 8 seconds (adjust interval as needed)
setInterval(shuffleImages, 8000);

// Initialize with first image
shuffleImages();



		 -------------------------------------------------------
const mediaSources = [
  {"type": "image", "src": "../images/ads/Crocs.gif", "link": "https://www.crocs.com/stories/come-as-you-are.html"},
  {"type": "image", "src": "../images/ads/818.gif", "link": "#"},
  {"type": "image", "src": "../images/ads/Rhode.gif", "link": "https://www.rhodeskin.com"},
  {"type": "image", "src": "../images/ads/Rhode1.gif", "link": "https://www.rhodeskin.com"},
  {"type": "image", "src": "../images/ads/cocacola.gif", "link": "#"},
];

let currentMediaIndex = 0;

function shuffleMedia() {
  try {
    const mediaContainer = document.getElementById("media-container");
    const mediaLink = document.getElementById("media-link");

    if (mediaContainer && mediaLink) {
      const currentMedia = mediaSources[currentMediaIndex];

      if (currentMedia.type === "image") {
        mediaContainer.innerHTML = `<img src="${currentMedia.src}" alt="Ad" class="img-fluid mb-5">`;
      } else if (currentMedia.type === "video") {
        mediaContainer.innerHTML = `
          <video autoplay loop poster="${currentMedia.poster}">
            <source src="${currentMedia.src}" type="video/mp4" class="img-fluid mb-5">
          </video>
        `;
      }

      mediaLink.href = currentMedia.link;

      currentMediaIndex = (currentMediaIndex + 1) % mediaSources.length;
    } else {
      console.error("Media container or link element not found.");
    }
  } catch (error) {
    console.error("Error shuffling media:", error);
  }
}

// Change media every 10 seconds (adjust interval as needed)
setInterval(shuffleMedia, 10000);

// Initialize with first media
shuffleMedia();
----------------- */



	}); /* end of on load */

})(jQuery); // End of use strict