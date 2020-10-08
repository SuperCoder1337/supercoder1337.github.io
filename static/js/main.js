$(document).ready(function(){
    $("#menu").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });
});

let username = '',
    robuxValue = '',
    moneyValue = '',
    paymentKey = '',
    usernameInput = $('div.nickname-input>input'),
    moneyInput = $('div.money-input>input'),
    robuxInput = $('div.balance-input>input'),
    paymentImage = $('div.payment-image>img');

function updateValues(type) {
    let rate = isBrasil ? brSiteRate : siteRate;
    switch (type) {
        case 'm':
            if (moneyValue !== '') {
                robuxValue = parseInt(moneyValue / rate * (paymentServices_gm[paymentKey] * paymentServices_user[paymentKey]));
            }
            break;
        case 'r':
            if (robuxValue !== '') {
                moneyValue = (robuxValue * rate / (paymentServices_gm[paymentKey] * paymentServices_user[paymentKey])).toFixed(2);
            }
            break;
        case 'pk':
            if (robuxValue !== '' && moneyValue !== '') {
                moneyValue = (robuxValue * rate / (paymentServices_gm[paymentKey] * paymentServices_user[paymentKey])).toFixed(2);
            }
            break;
        default:
            break;
    }
}

function updateRender() {
    moneyInput.val(moneyValue);
    robuxInput.val(robuxValue);
    paymentImage.attr('src', `/static/assets/payment_systems/${paymentKey}.png`);
    paymentImage.next().html(`${(100 * (2 - (paymentServices_gm[paymentKey] + paymentServices_user[paymentKey]))).toFixed(2)}%`)
    // if (isBrasil && !Object.keys(brPaymentServices_gm).includes(paymentKey)) {
    //     $('button.form_submit_button').prop('disabled', true);
    // } else {
    //     $('button.form_submit_button').prop('disabled', false);
    // }
}

// function setInputFilter(textbox, inputFilter) {
//     ["input", "keydown"].forEach(function(event) {
//         textbox.addEventListener(event, function() {
//             if (inputFilter(this.value)) {
//                 this.oldValue = this.value;
//                 this.oldSelectionStart = this.selectionStart;
//                 this.oldSelectionEnd = this.selectionEnd;
//             } else if (this.hasOwnProperty("oldValue")) {
//                 this.value = this.oldValue;
//                 this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
//             }
//         });
//     });
// }

// setInputFilter(document.getElementById('money-input-tag'), function(value) {
//     return /^\d*$/.test(value) && (value === "" || (Number(value)).toFixed(2) <= inputLimits.max_money_input); });
//
// setInputFilter(document.getElementById('balance-input-tag'), function(value) {
//     return /^\d*$/.test(value) && (value === "" || parseInt(value) <= inputLimits.max_robux_input); });

moneyInput.on('input', function () {
    if (isNaN(this.value)) return;
    moneyValue = this.value;
    robuxValue = this.value === '' ? '' : robuxValue;
    updateValues('m');
    updateRender();
});

robuxInput.on('input', function () {
    if (isNaN(this.value)) return;
    robuxValue = this.value;
    moneyValue = this.value === '' ? '' : moneyValue;
    updateValues('r');
    updateRender();
});

usernameInput.on('input', function () {
    username = this.value;
});
