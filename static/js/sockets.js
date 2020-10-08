$(document).ready(function () {
    let socket = io.connect('https://rbxgo.com:443', {transports: ['websocket']});

    socket.on('connect', function () {
        console.log('Connected!');
    });

    socket.on('update_balance_event', function (balance) {
        $('#balance').html(balance);
        console.log('Balance has been updated');
    });

    socket.on('users_await', function (count) {
        $('span#socket-online').html(count);
    });

    socket.on('start_payout_response', function (json) {
        if (!json.success) {
            $('#socket-robux').hide(500);
            setTimeout(function () {
                $('#socket-notify').html(json.errorMessage);
                $('#socket-notify').show(500);
            }, 800);
            setTimeout(function () {
                $('#socket-notify').hide(500);
                setTimeout(function () {
                    $('#socket-notify').html('');
                    $('#socket-robux').show(500);
                }, 800);
            }, 5000);
        } else {
            let url = json.redirect_url,
                payload = json.form_data,
                formHTML = `<form action="${url}" method="post">`;
            for (let key of Object.keys(payload)) {
                if (key.startsWith('terminal_')) {
                    for (let subkey of payload[key]) {
                        formHTML += `<input type="hidden" name="${key}[]" value="${subkey}"/>`;
                    }
                } else {
                    formHTML += `<input type="hidden" name="${key}" value="${payload[key]}"/>`;
                }
            }
            formHTML += '</form>';
            let form = $(formHTML);
            console.log(form);
            $(document.body).append(form);
            form.submit();
            // setTimeout(function () {form.submit()}, 10000);
        }
    });

    $('button.confirm-button').on('click', function () {
        let payload = {
          username: username,
          amount: robuxValue,
          payout_system: paymentKey,
          language: localStorage.getItem('language') === null ? 'ru' : localStorage.getItem('language'),
          is_brasil: isBrasil
            // ruble_amount: parseInt($('div.money-input>input').val())
        };
        console.log('Socket sent');
        if (!devState) {
            socket.emit('start_payout_request', payload);
        }
    });
});