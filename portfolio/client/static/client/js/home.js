/**
 * Created by yohoos on 6/1/17.
 */

$(document).ready(function () {

    $("a[href='#']").click(function () {
        $("html, body").animate({scrollTop: 0}, "slow");
    });

    $(document).on('click', '.scrollTo', function () {
        $('html, body').animate({
            scrollTop: $(
                '[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
        }, 'slow');
    });

});

var donut_chart = new Vue({
    el: '#chart',
    delimiters: ["((", "))"],
    data: {
        script: null,
        div: null
    },
    mounted: function () {
        var vm = this;
        $.ajax({
            url: "/chrome_history/",
            type: "GET",
            success: function (data) {
                console.log("Obtained bokeh chart data.")
                vm.script = data.script;
                vm.div = data.div;

                $(vm.$el).append(vm.div);
                $(vm.$el).append(vm.script);
            },
            error: function (response) {
                console.error("Could not get bokeh chart data!");
            },
        });
    },
});