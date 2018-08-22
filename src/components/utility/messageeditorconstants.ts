module MessageEditorConstants {
    export const TINYMCE_THEME = 'advanced';
    export const TINYMCE_PLUGINS = 'link textcolor advlist';
    export const TINYMCE_TOOLBAR =
        'bold italic underline | fontselect fontsizeselect | alignleft aligncenter alignright | bullist numlist | link';
    export const TINYMCE_FONTSIZES = '8px 10px 12px 14px 18px 24px 36px';
    export const TINYMCE_FONTS = 'Andale Mono=andale mono,times;'
        + 'Arial=arial,helvetica,sans-serif;'
        + 'Arial Black=arial black,avant garde;'
        + 'Book Antiqua=book antiqua,palatino;'
        + 'Comic Sans MS=comic sans ms,sans-serif;'
        + 'Courier New=courier new,courier;'
        + 'Georgia=georgia,palatino;'
        + 'Helvetica=helvetica;'
        + 'Impact=impact,chicago;'
        + 'Tahoma=tahoma,arial,helvetica,sans-serif;'
        + 'Terminal=terminal,monaco;'
        + 'Times New Roman=times new roman,times;'
        + 'Trebuchet MS=trebuchet ms,geneva;'
        + 'Verdana=verdana,geneva;';
    export const TINYMCE_TEXTCOLOR_PALETTE = [
        '000000', '',
        '993300', '',
        '333300', '',
        '003300', '',
        '003366', '',
        '000080', '',
        '333399', '',
        '333333', '',
        '800000', '',
        '808000', '',
        '008000', '',
        '008080', '',
        '0000FF', '',
        '666699', '',
        '808080', '',
        'FF0000', '',
        '99CC00', '',
        '339966', '',
        '33CCCC', '',
        '3366FF', '',
        '800080', '',
        '999999', '',
        'FF00FF', '',
        '00FF00', '',
        '00FFFF', '',
        '00CCFF', '',
        '993366', '',
        'FFFFFF', '',
        '99CCFF', '',
    ];
    export const TINYMCE_FONTNAME_CMD = 'FontName';
    export const TINYMCE_FONTSIZE_CMD = 'FontSize';
    export const TINYMCE_DEFAULT_FONT = 'arial,helvetica,sans-serif';
    export const TINYMCE_DEFAULT_FONTSIZE = '12px';
}
export = MessageEditorConstants;