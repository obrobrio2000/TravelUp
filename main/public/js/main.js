// const socket = io(wsFrontendUrl);
// socket.on('connect', () => {
//   socket.emit('room', { room_name: 'clients' });
// });

$(function () {

  $(window).on('load scroll', function () {

    if ($(window).scrollTop() > 10) {
      $('header').addClass('header-active');
    } else {
      $('header').removeClass('header-active');
    }

    if ($(this).scrollTop() > 800) {
      $('.loginLink').show(1000);
    }
    else {
      $('.loginLink').hide(1000);
    }

  });

});

AOS.init({ duration: 1000, delay: 10 });

// function contattaci() {
//   let text = document.getElementById("text").value;
//   let number = document.getElementById("number").value;
//   let email = document.getElementById("email").value;
//   let tipoRichiesta = document.getElementById("tipoRichiesta").value;
//   let message = document.getElementById("message").value;
//   let dati = {
//     nomeCompleto: text,
//     numero: number,
//     emailUtente: email,
//     tipoRichiesta: tipoRichiesta,
//     messaggio: message
//   }
//   socket.emit('mail', { emailUtente: dati, target: "contattaci" });
// }

function eliminaItinerario(idItinerario) {
  console.log(idItinerario);
  let confirmAction = confirm("Sei sicuro di voler eliminare l'itinerario?");
  if (confirmAction) {
    alert("Itinerario eliminato con successo!");
    location.href = "/itinerari/" + idItinerario + "/elimina";
  } else {
    return;
  }
}

function eliminaAccount() {
  let confirmAction = confirm("Sei sicuro di voler eliminare l'account?");
  if (confirmAction) {
    alert("Tutti i tuoi dati sono stati eliminati con successo dai nostri server, nel rispetto del Diritto all'oblio (Art. 17 del GDPR).");
    location.href = "/utente/elimina";
  } else {
    return;
  }
}