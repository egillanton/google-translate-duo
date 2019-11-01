var languages = {};
var langcodes = {};

var DEFAULT_SRC_LANG_CODE = 'ru';
var DEFAULT_DEST_LANG_CODE = 'en';

var selectedSrc = DEFAULT_SRC_LANG_CODE;
var selectedDest = DEFAULT_DEST_LANG_CODE;


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
            $(`#select_src option[value="${DEFAULT_SRC_LANG_CODE}"]`).attr("selected", true);
            $(`#select_dest option[value="${DEFAULT_DEST_LANG_CODE}"]`).attr("selected", true);
            $('#textarea_label_1').text(`${languages[DEFAULT_SRC_LANG_CODE]} -> ${languages[DEFAULT_DEST_LANG_CODE]}`);
            $('#textarea_label_3').text(`${languages[DEFAULT_DEST_LANG_CODE]} -> ${languages[DEFAULT_SRC_LANG_CODE]}`);
        },
        error: function (request, error) {
            alert("Request: " + JSON.stringify(request));
        }
    });
});