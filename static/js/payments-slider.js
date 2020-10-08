$(document).ready(function () {
    let ruSlider = $('.ru-payments-range');
    ruSlider.slider();
    ruSlider.on("slide", function(e) {
        let pkIndex = parseInt(e.value);
        paymentKey = Object.keys(paymentServices_gm)[pkIndex];
        updateValues('pk');
        updateRender();
    });

    let brSlider = $('.br-payments-range');
    brSlider.slider();
    brSlider.on("slide", function(e) {
        let pkIndex = parseInt(e.value);
        paymentKey = Object.keys(paymentServices_gm)[pkIndex];
        updateValues('pk');
        updateRender();
    });
});