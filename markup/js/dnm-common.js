(function(global, doc, $) {

	var $html = $('html'),
		_html = global.html = doc.documentElement,
		_ua = global.UA = global.navigator.userAgent;
	// IE 10, 11 체크
	function checkSetClassPropIE() {
		if (_ua.indexOf('MSIE 10') > -1) {
			$html.addClass('lt-ie11 ie10'); // IE10 버전 체크하여 <html> 요소에 class=lt-ie11 ie10 을 적용
		} else if (_ua.indexOf('rv:11') > -1) {
			$html.addClass('lt-ie11 ie11'); // IE11 버전 체크하여 <html> 요소에 class=lt-ie11 ie11 을 적용
		}
	}
	// IE 10, 11 초기 수행코드 실행
	checkSetClassPropIE();

	// SVGInjector : Style 설정
	// [참고] https://github.com/iconic/SVGInjector
	var svgInjection = function() {
		// img.inject-me 요소 수집해서 mySVGsToInject 변수에 참조
		var mySVGsToInject = doc.querySelectorAll('img.svg');
		// SVG 주입(Injector) 설정 옵션
		var injectorOptions = {
			evalScripts: 'once', // always, once, never
			pngFallback: 'images/svg-png', // PNG 대체 폴더 설정
			each: function(svg) {
				// svg는 수집된 개별 img.svg를 가리킴
			}
		};
		// SVGInjector 함수에 연결
		SVGInjector(
			// 수집된 img.inject-me 요소
			mySVGsToInject,
			// SVG 주입(Injector) 설정 옵션
			injectorOptions,
			// 콜백 함수
			function(totalSVGsInjected) {
				// totalSVGsInjected는 SVG 주입된 설정 개수를 출력
			});
	};
	svgInjection();

	// Main Touch Slider
	// [참고] http://flickity.metafizzy.co/api.html
	$('.main-carousel').flickity({
	  // options
	  cellAlign: 'left',
	  contain: true,
	  // 스와이프 기능
	  wrapAround: true,
	  // 자동 슬라이드 기능 (기본시간 : 3000)
	  autoPlay: true,
	});

})(window, document, window.jQuery);