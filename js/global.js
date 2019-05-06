var doInsertionSort;

(function ($) {

    var overlay = $('.overlay');
    var sideNavigation = $('.sideNavigation');

    doInsertionSort = function (tbody, row, maxRow) {
        var currentMaxRow = parseInt(maxRow, 10);

        if (isNaN(currentMaxRow)) {
            currentMaxRow = 10;
        }

        var size = tbody.children().length;

        if (size === 0) {
            tbody.append(row);
            return;
        }

        var rowIdToInsert = parseInt($(row).children().first().text(), 10);

        for (var i = 0; i < size; i++) {
            var currentId = parseInt($(tbody.children().get(i)).children().first().text(), 10);

            if (rowIdToInsert > currentId) {
                $(tbody.children().get(i)).before(row);
                break;
            }

            if (i == size - 1) {
                $(tbody.children().get(i)).after(row);
            }
        }

        size = tbody.children().length;

        if (size > currentMaxRow) {
            for (var i = 0; i < size - currentMaxRow; i++) {
                tbody.children().last().remove();
            }
        }
    }

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