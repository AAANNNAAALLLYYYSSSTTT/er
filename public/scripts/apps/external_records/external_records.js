function initCalendar() {
    var dp = new DatePicker("#calendar", {language:"ru"});
    dp.onDateChange = function(){
        setDate(this.y, this.m, this.d);
    };
}

function setDate(year, month, day) {
    $.ajax({
        type: "POST",
        url: "date",
        data: { year: year, month: month, day: day }
    }).done(function( msg ) {
        info( msg );
	getRecords(year, month, day);
    });
}

function getRecords(year, month, day) {
    $.ajax({
        type: "POST",
        url: "external_records",
        data: { year: year, month: month, day: day }
    }).done(function( data ) {
        updateRecords( data );
    });
}

function initMenuDoctors() {
    $(document).ready(function($){
        $( "#drawers-wrapper" ).accordion({
            heightStyle: "content"
        });
        $('a.new_records').click(function () {
        });
    });
}

function updateRecords(data) {
    $('#records_table').html(data);
}

function initCancel() {
    var content = $('#cancel');
    for (var i = 0; i < content.length; ++i) {
        content[0].onclick = infoCancel;
    }
}

function infoCancel(e) {
    e = e || event;
    var target = e.target || e.srcElement;
    var dialogContentEl = $('#dialog-content')
    replaceText(dialogContentEl, target.value);
    $("#dialog-info").dialog({
        position: 'center',
        height: 140,
        width: 400,
        modal: true
    });
}

function initWait() {
    var content = $('.wait');
    for (var i = 0; i < content.length; ++i) {
        content[0].onclick = deleteRecord;
    }
}

function deleteRecord(e) {
    e = e || event;
    var target = e.target || e.srcElement;
    var id = target.id;
    $.ajax({
        type: "DELETE",
        url: "external_records",
        data: { id: id },
	dataType: "json",
	success: function( data ) {
            updateRecord( data.success );
	    info( data.success.info );
        },
        error: function( data ) {
            info( data.status );
        }
    });
}

function updateRecord(data) {
    var inputEl = document.getElementById("record_"+data.id);
    inputEl.value = data.info;
    inputEl.type = "text";
    inputEl.className = "cancel";
    inputEl.disabled = "disabled"
    parent(inputEl, 2).className = "cancel";
    initCancel();
}

function initCommit() {
    var content = $('.commit');
    for (var i = 0; i < content.length; ++i) {
        content[0].onclick = printRecord;
    }
}

function printRecord(e) {
    e = e || event;
    var target = e.target || e.srcElement;
    window.open('/ticket?id='+target.id.replace( /^\D+/g, ''), '_blank')
}

initCalendar();
initMenuDoctors();
initCancel();
initWait();
initCommit();
