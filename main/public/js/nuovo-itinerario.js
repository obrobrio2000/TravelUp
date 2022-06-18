var citta = '';
var target = 'Cultura';
var arrInfo = [];
const socket = io(wsFrontendUrl);
socket.on('connect', () => {
    socket.emit('room', { room_name: 'clients' });
});

var form = document.getElementById('form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!$('input#citta').val()) {
        alert('Inserire una citta');
    } else {
        citta = $('input#citta').val();
        socket.emit('Luoghi', { citta, target })
    }
});

$('button#Cultura').on('click', () => {
    target = 'Cultura';
    if (!$('input#citta').val()) {
        alert('Inserire una citta');
    } else {
        citta = $('input#citta').val();
        socket.emit('Luoghi', { citta, target })
        $('button').removeClass("selected").removeAttr('disabled');
        $('button#Cultura').addClass("selected").attr('disabled', true);
    }
})

$('button#Utility').on('click', () => {
    target = 'Utility';
    if (!$('input#citta').val()) {
        alert('Inserire una citta');
    } else {
        citta = $('input#citta').val();
        socket.emit('Luoghi', { citta, target })
        $('button').removeClass("selected").removeAttr('disabled');
        $('button#Utility').addClass("selected").attr('disabled', true);
    }
})

$('button#Food').on('click', () => {
    target = 'Food';
    if (!$('input#citta').val()) {
        alert('Inserire una citta');
    } else {
        citta = $('input#citta').val();
        socket.emit('Luoghi', { citta, target })
        $('button').removeClass("selected").removeAttr('disabled');
        $('button#Food').addClass("selected").attr('disabled', true);
    }
})

$('button#Intrattenimento').on('click', () => {
    target = 'Intrattenimento';
    if (!$('input#citta').val()) {
        alert('Inserire una citta');
    } else {
        citta = $('input#citta').val();
        socket.emit('Luoghi', { citta, target })
        $('button').removeClass("selected").removeAttr('disabled');
        $('button#Intrattenimento').addClass("selected").attr('disabled', true);
    }
})

function showInformation(informazione) {
    info = informazione;
    lista = document.getElementsByClassName('infotappe')
    $(lista).empty()
    for (let key in info) {
        titolo = info[key]['title']
        desc = info[key]['desc']
        if (typeof desc === 'undefined') {
            desc = "";
        }
        link = info[key]['url']
        lat = info[key].lat
        lon = info[key].lon
        $(lista).append(`<li class="list-group-item d-flex justify-content-between align-items-start element-view ">      \
                                    <div class="ms-2 me-2 tappa">  \
                                        <div class="d-flex justify-content-between align-items-start">\
                                            <div class="fw-bold titoloTappa">\
                                                <label class="fw-bold" id="nomeTappa">`+ titolo + `</label>\
                                            </div>\
                                            <div id="button">\
                                                <button class="badge bg-primary rounded-pill" id="add">+</button>\
                                            </div>\
                                        </div>\
                                        <div class="descriptionBox">\
                                            `+ desc + `\
                                        </div>\
                                        <div class="findmore">\
                                            <a id="link" href="`+ link + `" target="_blank" >Scopri di più...</a>\
                                            <div class="informazioni">\
                                            <label id="lat">`+ lat + `</label> <label id="lon"> ` + lon + `</label>
                                            </div>   \
                                        </div>\
                                    </div>\
                                </li>`)
    }
    createList(lista);

}

function createList(lista) {
    $(lista).find('.rounded-pill').on('click', function () {
        var nome = $(this).parents('.tappa').find('label#nomeTappa').html();
        var lat = $(this).parents('.tappa').find('label#lat').html();
        var lon = $(this).parents('.tappa').find('label#lon').html();
        var url = $(this).parents('.tappa').find('a#link').attr('href');
        element = $(this).parents('.element-view').clone().find('div#button,div.descriptionBox,div.findmore').remove().end().html();
        element = $(element).children().append('<div><button id="up" class="badge bg-primary rounded-pill">▲</button></div>\
                                                            <div><button id="down" class="badge bg-primary rounded-pill">▼</button></div>\
                                                            <div><button id="remove" class="badge bg-primary rounded-pill">−</button></div>')
        $(element).children().children("#remove").on('click', function () {
            var index = $(this).parent().parent().parent().index()
            arrInfo.splice(index, 1);
            $(this).parentsUntil("ul").remove();
        });
        $(element).children().children("#up").on('click', function () {
            moveUp($(this).parent().parent().parent());
        });
        $(element).children().children("#down").on('click', function () {
            moveDown($(this).parent().parent().parent());
        });
        element = element.wrap('<li class="list-group-item border-bottom border-start"></li>').parent();
        element = $(element).append('<div class="d-flex justify-content-between align-items-start"><label>Giorno :</label><input type="date" id="giorno" name="giorno"></div>')
        $('#Viewer').append(element);
        arrInfo.push({ nome: nome, data: "", url: url, lat: lat, lon: lon })
    });

}

function swapElements(indexPre, indexPost) {
    var temp = arrInfo[indexPost];
    arrInfo[indexPost] = arrInfo[indexPre];
    arrInfo[indexPre] = temp;
}

function moveUp($item) {
    var indice = $item.index();
    $before = $item.prev();
    $item.insertBefore($before);
    if (indice == 0) {
    } else {
        swapElements(indice, indice - 1)
    }
}

function moveDown($item) {
    var indice = $item.index();
    $after = $item.next();
    $item.insertAfter($after);
    if (indice == arrInfo.length - 1) {
    } else {
        swapElements(indice, indice + 1)
    }
}

function saveItinerario(userId) {
    var tappe = arrInfo;
    if (arrInfo.length === 0) {
        alert('Inserire almeno una tappa');
        return;
    }
    var blocco = false;
    $('#Viewer li').each(function () {
        var index = $(this).index();
        var date = $(this).find('input#giorno').val();
        if (date !== "") {
            $(this).removeClass("border border-danger");
            tappe[index].data = date;
            blocco = false
        } else {
            blocco = true;
            $(this).addClass("border border-danger");
        }
    })
    titoloIt = $('input#titoloItinerario').val();
    if (titoloIt === "") {
        blocco = true;
        $('input#titoloItinerario').addClass("border border-danger");
    }
    else if (titoloIt === "" && arrInfo.length === 0) {
        blocco = true;
        $('input#titoloItinerario').addClass("border border-danger");
        alert('Inserire almeno una tappa');
    }
    if (!blocco) {
        socket.emit('NuovoItinerario', { titolo: titoloIt, tappe: tappe, creatore: userId });
    } else {
        alert('Inserire correttamente le informazioni')
    }
}

socket.on('nuovoItinerario_rispostaClient', function (data) {
    if (data.value === "Inserito con successo") {
        window.location.href = "/itinerari";
    } else {
        alert("Errore nell'inserimento dell'itinerario nel database, riprovare");
    }
})

socket.on('luoghi_rispostaClient', (data) => {
    console.log("questo funge");
    switch (data.target) {
        case 'Cultura': {
            showInformation(data.value);
            break;
        }
        case 'Food': {
            showInformation(data.value);
            break;
        }
        case 'Intrattenimento': {
            showInformation(data.value);
            break;
        };
        case 'Utility': {
            showInformation(data.value);
            break;
        };
    }
})
