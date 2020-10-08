$('.language-dropdown').click(function () {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('language-active');
        $(this).find('.language-dropdown-menu').slideToggle(300);
    });
    $('.language-dropdown').focusout(function () {
        $(this).removeClass('language-active');
        $(this).find('.language-dropdown-menu').slideUp(300);
    });
    $('.language-dropdown .language-dropdown-menu li').click(function () {
        $(this).parents('.language-dropdown').find('span').text($(this).text());
        $(this).parents('.language-dropdown').find('input').attr('value', $(this).attr('id'));
    });

$('.language-dropdown-menu li').click(function () {
  let input = $(this).parents('.language-dropdown').find('input').val();
  localStorage.setItem('language', input);
  updateLang();
});

$('.countries>img').on('click', function () {
   localStorage.setItem('language', this.id);
   updateLang();
});

function updateLang() {
    let l = localStorage.getItem('language'),
        lang = l === null ? defaultLang : l;
    localStorage.setItem('language', lang);
    for (let key of Object.keys(languages)) {
        if (key !== 'payments_placeholder_login') {
            $(`.${key}`).html(languages[key][lang]);
        } else {
            $('.payments_placeholder_login').attr('placeholder', languages['payments_placeholder_login'][lang])
        }
    }
    $('.language-select-span').html(`<strong>${lang}</strong>`);
    let pholder = '',
        valuteSign = '',
        height1 = lang === 'br' ? '620px' : '570px',
        height2 = lang === 'br' ? '750px' : '600px';
    $('div.change-form').css('height', height1 + '!important');
    $('div.question-answer').css('height', height2 + '!important');
    if (lang === 'br' && defaultLang === 'br') {
        valuteSign = '/static/assets/roblux.png';
        pholder = 'BR';
        isBrasil = true;
        paymentServices_gm = brPaymentServices_gm;
        paymentServices_user = brPaymentServices_user;
        paymentKey = brDefaultPaymentKey;
        $('.ru-payments-range').prev().hide();
        $('.br-payments-range').prev().show();
    } else {
        valuteSign = '/static/assets/rubles.png';
        pholder = 'RUB';
        isBrasil = false;
        paymentServices_gm = ruPaymentServices_gm;
        paymentServices_user = ruPaymentServices_user;
        paymentKey = defaultPaymentKey;
        $('.ru-payments-range').prev().show();
        $('.br-payments-range').prev().hide();
    }
    $('#money-input-tag').attr('placeholder', pholder);
    $('div.money-input>img').attr('src', valuteSign);
    updateValues('pk');
    updateRender();
}

$(document).ready(function () {
    setTimeout(function () {
        updateLang();
    }, 2000);
});
