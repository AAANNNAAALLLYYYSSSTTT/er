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
    });
}

function initSaveAllButton() {
    $(document).ready(function($){
        $('#saveAll').click(function(){
            saveAll();
        });
    });
}

function initMenuDoctors() {
    $(document).ready(function($){
        $( "#drawers-wrapper" ).accordion({
            heightStyle: "content"
        });
        $('a.new_records').click(function () {
            getRecords($(this).attr('id'));
        });
    });
}

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

var Records = Class({
    initialize: function() {
        this.doctor = "";
        this.list = [];
    },
    toString: function() {
        return "[Records:doctor="+this.doctor+"]";
    }
});

function autoIncrementRecords() {
    var num = 1;
    var table = document.getElementById('patients');
    if (table) {
        var body = table.getElementsByTagName('tbody');
        var rows = body[0].getElementsByTagName('tr');
        for (var i = 0; i < rows.length; ++i) {
            var cells = rows[i].getElementsByTagName('td');
            for (var j = 0; j < cells.length; ++j) {
                switch (j) {
                case 1:
                    cells[j].innerHTML = "&rarr;" + num;
                    break;
                }
            }
            ++num;
        }
    }
}

function saveAll() {
    var newRecords = new Records();
    var doctor = $('input[name=doctor_id]').attr("value");
    newRecords.doctor = doctor;
    var table = document.getElementById('patients');
    var body = table.getElementsByTagName('tbody');
    var rows = body[0].getElementsByTagName('tr');
    for (var i = 0; i < rows.length; ++i) {
        var cells = rows[i].getElementsByTagName('td');
        for (var j = 0; j < cells.length; ++j) {
            switch (j) {
            case 0:
                var writeTxt = cells[j].getElementsByTagName('input')[0];
                if (writeTxt.disabled == false && writeTxt.value != '') {
                    var newRecord = new Record()
                    newRecord.doctor = doctor;
                    newRecord.write = writeTxt.value;
                    if (writeTxt.id && writeTxt.id != '') {
                        newRecord.id = writeTxt.id;
                    }
                    newRecords.list.push(newRecord);
                }
                break;
            }
        }
    }
    setRecords(JSON.stringify(newRecords, replacer));
}

function setRecords(records) {
    $.ajax({
        type: "POST",
        url: "internal_records",
        data: { records: records },
        dataType: "json",
        success: function( data ) {
            info( data.status );
        },
        error: function( data ) {
            info( data.status );
        }
    });
}

function getRecords(doctor_id) {
    $.ajax({
        type: "POST",
        data: { key: doctor_id },
        url: "internal_records"
    }).done(function( data ) {
        updateRecords(data);
    });
}

function updateRecords(data) {
    var recordsEl = document.getElementById("records_table");
    replaceText(recordsEl, data);
    autoIncrementRecords();
    initSaveAllButton();
}

function cancelRecord() {
    var id = this.parentNode.parentNode.id;
    dialogConfirm(id).dialog('open');
}

initCalendar();
initMenuDoctors();
initSaveAllButton();
