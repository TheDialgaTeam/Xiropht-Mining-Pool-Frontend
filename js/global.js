(function ($) {

    var overlay = $('.overlay');
    var sideNavigation = $('.sideNavigation');

    $(document).ready(function () {
        overlay.on('click', function () {
            sideNavigation.removeClass('active');
            overlay.removeClass('active');
        });

        $('#sidebarCollapse').on('click', function () {
            sideNavigation.toggleClass('active');
            overlay.toggleClass('active');
        });
    });
})(jQuery);