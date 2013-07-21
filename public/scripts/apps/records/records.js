function initCalendar() {
    var dp = new DatePicker("#calendar", {language:"ru"});
    dp.onDateChange = function(){
        setDate(this.d, this.m, this.y);
    };
}

function setDate(day, month, year) {
    $.ajax({
        type: "POST",
        url: "date",
        data: { year: year, month: month, day: day }
    }).done(function( msg ) {
        info( msg );
	getWaitingList();
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

var Confirm = Class({
    initialize: function() {
        this.id = "";
        this.status = "";
        this.description = "";
    },
    toString: function() {
        return "[record:id="+this.id+",status="+this.status+",description="+this.description+"]";
    }
});

var Record = Class({
    initialize: function() {
        this.doctor = "";
        this.write  = "";
        this.id     = ""
    },
    toString: function() {
        return "[Record:doctor="+this.doctor+",write="+this.write+"]";
    }
});

function updateEntryOfWaitingList(data) {
    var inputEl = document.getElementById("record_"+data.id);
    remove(inputEl);
    initButtons();
}

function getWaitingList() {
    $.ajax({
        type: "POST",
        url: "records"
    }).done(function( data ) {
        updateWaitingList( data );
	initButtons();
    });
}

function updateWaitingList(data) {
    $('#records_table').html(data);
}

function successRecord() {
    var id = this.parentNode.parentNode.id;
    record = new Confirm();
    record.id = id;
    record.status = "success";
    $.ajax({
        type: "PUT",
        url: "records",
	data: { record: JSON.stringify(record, replacer) },
	dataType: "json",
        success: function( data ) {
            updateEntryOfWaitingList( data.success );
	    info( data.success.info );
        },
        error: function( data ) {
            info( data.status );
        }
    });
}

function cancelRecord() {
    var id = this.parentNode.parentNode.id;
    dialogConfirm(id).dialog('open');
}

function dialogConfirm(id) {
    return $("#dialog-confirm").dialog({
        autoOpen: false,
        resizable: true,
        height: 260,
        width: 500,
        modal: true,
        buttons: {
            "Подтвердить": function() {
                record = new Confirm();
                record.id = id;
                record.status = "cancel";
                record.description = document.getElementById("dialog-message").value;
                $.ajax({
                    type: "DELETE",
                    url: "records",
                    data: { record: JSON.stringify(record, replacer) },
                    dataType: "json",
                    success: function( data ) {
                        updateEntryOfWaitingList( data.success );
                        info( data.success.info );
                    },
                        error: function( data ) {
                        info( data.status );
                    }
                });

                $( this ).dialog( "close" );
            },
            "Отмена": function() {
                $( this ).dialog( "close" );
            }
        }
    });  
}

function initButtons() {
    var content = $('.button');
    for (var i = 0; i < content.length; ++i) {
        if (content[i].name == "success")
            content[i].onclick = successRecord;
        else if (content[i].name == "cancel")
            content[i].onclick = cancelRecord;
    }
}

$(function() {
    document.title = "Подтверждения";
});

initCalendar();
initMenuDoctors();
dialogConfirm();
