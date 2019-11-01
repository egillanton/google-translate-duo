var languages = {};
var langcodes = {};

var DEFAULT_SRC_LANG_CODE = 'ru';
var DEFAULT_DEST_LANG_CODE = 'en';

var selected_src = "";
var selected_dest = "";


/////////// SET LABELS ////////////////////////////////////////////////// 
function setLabels(src, dest) {
    if (Object.keys(languages).length) {
        $(`#select_src option[value="${src}"]`).attr("selected", true);
        $(`#select_dest option[value="${dest}"]`).attr("selected", true);
        $('#textarea_label_1').text(`${languages[src]} -> ${languages[dest]}`);
        $('#textarea_label_3').text(`${languages[dest]} -> ${languages[src]}`);
        $('#textarea_label_2').text(`${languages[dest]}:`);
        $('#textarea_label_4').text(`${languages[src]}:`);
    } else {
        $('#textarea_label_1').text('No Language Selected');
        $('#textarea_label_2').text('No Language Selected');
        $('#textarea_label_3').text('No Language Selected');
        $('#textarea_label_4').text('No Language Selected');
    }
}


/////////// TRANSLATE ////////////////////////////////////////////////// 
function translate() {
    var text_1 = $('#textarea_1').val();

    if (text_1) {
        $.ajax({
            type: 'POST',
            url: '/translate',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                'text': text_1,
                'src': selected_src,
                'dest': selected_dest,
            }),
            success: function (data) {
                $('#textarea_2').val(data.text);
            },
            error: function (request, error) {
                // alert("Request: " + JSON.stringify(request));
            }
        });
    }

    var text_3 = $('#textarea_3').val();

    if (text_3) {
        $.ajax({
            type: 'POST',
            url: '/translate',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                'text': text_3,
                'src': selected_dest,
                'dest': selected_src,
            }),
            success: function (data) {
                $('#textarea_4').val(data.text);
            },
            error: function (request, error) {
                alert("Request: " + JSON.stringify(request));
            }
        });
    }
}

function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}


/////////// MAIN ////////////////////////////////////////////////// 
$(document).ready(function () {
    $.ajax({
        url: '/langcodes',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            langcodes = data.langcodes;
            for (let [lang_name, lang_code] of Object.entries(langcodes)) {
                lang_name_title = lang_name[0].toUpperCase() + lang_name.slice(1);
                languages[lang_code] = lang_name_title;
                langcodes[lang_name_title] = lang_code;
                $('#select_src').append(`<option value="${lang_code}">${lang_name_title}</option>`);
                $('#select_dest').append(`<option value="${lang_code}">${lang_name_title}</option>`);

            }
            selected_src = DEFAULT_SRC_LANG_CODE;
            selected_dest = DEFAULT_DEST_LANG_CODE;
            setLabels(selected_src, selected_dest);
        },
        error: function (request, error) {
            alert("Request: " + JSON.stringify(request));
        }
    });

    // When switching between src languages
    $('#select_src').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        selected_src = valueSelected;
        setLabels(selected_src, selected_dest);
        translate();
    });

    // When switching between dest languages
    $('#select_dest').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        selected_dest = valueSelected;
        setLabels(selected_src, selected_dest);
        translate();
    });

    // When writing
    $('#textarea_1').on('keyup paste', delay(function (e) {
        translate();
    }, 1000));

    // When writing
    $('#textarea_3').on('keyup paste', delay(function (e) {
        translate();
    }, 1000));
});