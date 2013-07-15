function initCalendar() {
    var dp = new DatePicker("#calendar", {language:"ru"});
    dp.onDateChange = function() {
        setDate(this.y, this.m, this.d);
    };
}

function initCalendarSel() {
    var dp = new DatePicker("#date", {language:"ru"});
    dp.onDateChange = function() {
        setDate(this.y, this.m, this.d, true);
    };
}

function setDate(year, month, day, select) {
    $.ajax({
        type: "POST",
        url: "date",
        data: { year: year, month: month, day: day }
    }).done(function( msg ) {
        info( msg );
        if (!select) {
            getQuotas(year, month, day);
        }
    });
}

var Quota = Class({
    initialize: function() {
        this.key = 0;
        this.quota = 0;
        this.active = false;
    },
    toString: function() {
        return "[Quota:key="+this.key+",quota="+this.quota+",active="+this.active+"]";
    }
});

function initSaveAllButton() {
    $(document).ready(function($){
        $('#saveAll').click(function(){
            saveAll();
        });
    });
}

function saveAll() {
    var quotas = [];
    var table = document.getElementById('quotasContent');
    var body = table.getElementsByTagName('tbody');
    var rows = body[0].getElementsByTagName('tr');
    for (var i = 0; i < rows.length; ++i) {
        var cells = rows[i].getElementsByTagName('td');
        newQuota = new Quota();
        for (var j = 0; j < cells.length; ++j) {
            switch (j) {
                case 0:
                    newQuota.key = cells[j].getElementsByTagName('div')[0].innerHTML;
                    break;
                case 5:
                    newQuota.quota = cells[j].getElementsByTagName('input')[0].value;
                    break;
                case 6:
                    newQuota.active = cells[j].getElementsByTagName('input')[0].checked;
                    break;
                case 7:
                    newQuota.description = cells[j].getElementsByTagName('input')[0].value;
                    break;
            }
        }
        quotas.push(newQuota);
    }
    setQuotas(JSON.stringify(quotas, replacer));
}

function setQuotas(quotas) {
    $.ajax({
        type: "POST",
        url: "quotum_doctors",
        data: { quotas: quotas },
        dataType: "json",
        success: function( data ) {
            info( data.status );
        },
        error: function( data ) {
            info( data.status );
        }
    });
}

function getQuotas(year, month, day) {
    $.ajax({
        type: "POST",
        url: "quotum_doctors"
    }).done(function( data ) {
        updateQuotas(data);
    });
}

function updateQuotas(data) {
    var quotasEl = document.getElementById("quotas");
    replaceText(quotasEl, data);
}

$(function() {
    document.title = "Квота";
    initCalendar();
    initCalendarSel();
    initSaveAllButton();
});
