$(document).ready(function() {
    $('.continuePayments').prop('disabled', true);
    updateEventListeners();
})

$('.initPayments').on('click', function() {
    $('.popup').css('display', 'block');
    $('.popup1').css('display', 'flex');
})

$('.closePayments1').on('click', function() {
    $('.popup').css('display', 'none');
    $('.popup1').css('display', 'none');
})

$('.continuePayments').on('click', function() {
    $(".usernameQueryResult").html('<div class="lds-ring lds-ring-white"><div></div><div></div><div></div><div></div></div>');
    $(".usernameQueryResult").show(300);
    $('.continuePayments').prop('disabled', true);
    let lang = localStorage.getItem('language');

    $.ajax({
        url: '/payments',
        type: 'GET',
        data: {
            username: $('.popup-content>input').val()
        },
        error: function(xhr, status, error) {
            if ($('.popup').css('display') == 'none') {
                $('.continuePayments').prop('disabled', true);
                $('.popup-content>input').val('');
                $(".usernameQueryResult").hide();
                return;
            }
            $('.usernameQueryResult').html('Something wrong: ' + xhr + ' | ' + status + ' | ' + error);
        },
        success: function(json) {
            if ($('.popup').css('display') == 'none') {
                $('.continuePayments').prop('disabled', true);
                $('.popup-content>input').val('');
                $(".usernameQueryResult").hide();
                return;
            }
            if (json.status) {
                let content = preparePaymentsTemplate(json.payments, json.langs);
                $('.popup2-content').html(content);
                updateEventListeners();
            } else {
                $('.popup2-content').html(`<div class='nopayments'><p>${json.langs["payments_empty"][lang]}</p></div>`);
            }


            $('.popup1').css('display', 'none');
            $('.popup2').css('display', 'flex');
            $('.popup-content>input').val('');
            $(".usernameQueryResult").hide();
        }
    })
})

$('.popup-content>input').on('input', function() {
    if (this.value) {
        $('.continuePayments').prop('disabled', false);
    } else {
        $('.continuePayments').prop('disabled', true);
    }
})

$('.closePayments2').on('click', function() {
    $('.popup').css('display', 'none');
    $('.popup2').css('display', 'none');
})

function updateEventListeners() {
    $('div.payment-action>button').on('click', function() {
        let oid = this.id.split('|')[0],
            status = this.id.split('|')[1],
            parent = $(this).parent(),
            lang = localStorage.getItem('language');

        parent.html('<div class="lds-ring lds-ring-white"><div></div><div></div><div></div><div></div></div>');

        $.ajax({
            url: '/repeat',
            type: 'GET',
            data: {
                oid: oid,
                status: status,
                language: localStorage.getItem('language')
            },
            error: function(xhr, status, error) {
                parent.html(`<button id="${oid}|${status}">Repeat</button>`);
                parent.notify(`Something wrong:\n${xhr} | ${status} | ${error}`, 'error');
            },
            success: function(json) {
                if (json.status) {
                    parent.html('');
                    $.notify(json.langs['payments_repeat_notify_1'][lang] + oid.substr(-10), 'success');
                    let content = preparePaymentsTemplate(json.payments, json.langs);
                    $('.popup2-content').html(content);
                } else {
                    parent.html(`<button id="${oid}|${status}">${json.langs['payments_reapeat_btn_text'][lang]}</button>`);
                    parent.notify(`${json.langs['payments_repeat_notify_2'][lang]}\n${json.reason}`, 'warn');
                }
                updateEventListeners();
            }
        })
    })
}

function preparePaymentsTemplate(json, langs) {
    let statuses = [
        'Group not found(maybe stopped)',
        'Error in RobuxShip CODE',
        'Roblox API Error or Proxy',
        'User not in group',
        'Need refund'
    ],
        content = "<div class='payments'>",
        lang = localStorage.getItem('language');
    for (let payment of json) {
        content += `<div class='payment'><div class='payment-number'><p>${payment._id['$oid'].substr(-10)}</p></div><div class='payment-bill'><p>R ${payment.robux_amount}</p></div><div class='payment-username'><p>${payment.username}</p></div><div class='payment-status' style="background-color: ${veilStatus(payment.status, 'color', langs)};"><p>${veilStatus(payment.status, 'text', langs)}</p></div><div class='payment-action'>${statuses.includes(payment.status) ? '<button id="' + payment._id['$oid'] + '|' + payment.status + '">' + langs["payments_reapeat_btn_text"][lang] + '</button>' : ''}</div></div>`;
    }
    content += '</div>';
    return content;
}

function veilStatus(status, type, langStatuses) {
    let errors = [
        'Group not found(maybe stopped)',
        'Error in RobuxShip CODE',
        'Roblox API Error or Proxy',
        'User not in group',
        'Need refund'
    ],
        successes = [
        'Paid full amount',
        'Not full amount'
    ],
        lang = localStorage.getItem('language');
    if (errors.includes(status)) {
        if (type === 'text') {
            return langStatuses['payments_status_2'][lang];
            // return 'Ошибка';
        } else if (type === 'color') {
            return '#de2450';
        }
    } else if (successes.includes(status)) {
        if (type === 'text') {
            return langStatuses['payments_status_1'][lang];
            // return 'Выдан';
        } else {
            return '#1b881c';
        }
    } else {
        if (type === 'text') {
            return langStatuses['payments_status_3'][lang];
            // return 'Ожидание';
        } else {
            return '#484848';
        }
    }
}
