$(document).ready(function () {
  //recupero il template
  var template_html = $('#film-template').html();
  //preparo la funzione da utilizzare per il template
  var template_function = Handlebars.compile(template_html);

  //preparo delle variabili per ajax
  var api_key = 'd2f2e36584ccedbe3c1a6c903ec79afb';
  var api_url_base = 'https://api.themoviedb.org/3/';
  var stringa_movie = 'search/movie';
  var stringa_tv = 'search/tv';
  var tipoFilm = 'Film';
  var tipoSerieTv = 'Serie-tv';
  var api_img_url_base = 'https://image.tmdb.org/t/p/';
  var dimensione_img = 'w342';
  var lingua = 'it';

  function chiamataAjax(par0, par1, par2) {
    $.ajax({
      url: api_url_base + par1,
      method: 'GET',
      data: {
        api_key: api_key,
        query: par0,
        language: lingua,
      },
      success: function (data) {
        // mi viene restituito un array come risultato e lo salvo in una variabile
        var array_risultati = data.results;

        if (array_risultati.length == 0) {
          alert('Nessun risultato trovato');
        } else {
          //funzione che stampa in pagina i risultati ottenuti
          generaCard(array_risultati, par2);
        }
      },

      error: function () {
        console.log('errore');
      },
    });
    //fine chiamata ajax
  }

  //funzione che stampa in pagina i risultati ottenuti
  function generaCard(array_risultati, tipo) {
    for (var i = 0; i < array_risultati.length; i++) {
      var risultato_corrente = array_risultati[i];
      scrivi_locandina(risultato_corrente, tipo);
    }
  }

  function stampa_attori(id, url) {
    //inizio chiamata ajax
    $.ajax({
      url: url,
      method: 'GET',
      data: {
        api_key: api_key,
      },
      success: function (data) {
        var array_nomi = [];
        var array_cast = data.cast;

        for (var i = 0; i < 5; i++) {
          if (array_cast[i]) {
            var cast_corrente = array_cast[i];
            array_nomi.push(cast_corrente.name);
          }
        }

        // trova elementi di classe = "cast" con attributo di nome "data-id" che è uguale a id (variabile)
        $('.cast[data-id="' + id + '"]').append(array_nomi.join(', '));
      },

      error: function () {
        console.log('errore');
      },
    });
    //fine chiamata ajax
  }

  function stampa_generi(id, url2) {
    //inizio chiamata ajax
    $.ajax({
      url: url2,
      method: 'GET',
      data: {
        api_key: api_key,
      },
      success: function (data) {
        var array_nomi = [];
        var array_cast = data.genres;

        for (var i = 0; i < 5; i++) {
          if (array_cast[i]) {
            var cast_corrente = array_cast[i];
            array_nomi.push(cast_corrente.name);
          }
        }

        // trova elementi di classe = "genre" con attributo di nome "data-id" che è uguale a id (variabile)
        $('.genre[data-id="' + id + '"]').append(array_nomi.join(', '));
      },

      error: function () {
        console.log('errore');
      },
    });
    //fine chiamata ajax
  }

  //funzione che inserisce i dati trovati in un oggetto
  function scrivi_locandina(risultato_corrente, tipo) {
    //salvo ogni risultato dell'array in un nuovo oggetto, per poi eventualmente usare handlebars
    var locandina_film = {
      immagine: seleziona_poster(risultato_corrente.poster_path),
      titolo: risultato_corrente.title,
      titolo_serie: risultato_corrente.name,
      titolo_originale_serie: risultato_corrente.original_name,
      titolo_originale: risultato_corrente.original_title,
      lingua: seleziona_lingua(risultato_corrente.original_language),
      voto: voto_stella(risultato_corrente.vote_average),
      trama: risultato_corrente.overview,
      tipo: tipo,
      id: risultato_corrente.id,
    };

    var html_finale = template_function(locandina_film);
    // appendo in pagina una card con i dati dei film

    $('.film-container').append(html_finale);

    var url;
    if (tipo == 'Film') {
      url =
        'https://api.themoviedb.org/3/movie/' +
        risultato_corrente.id +
        '/credits';
    } else if (tipo == 'Serie-tv') {
      url =
        'https://api.themoviedb.org/3/tv/' + risultato_corrente.id + '/credits';
    }

    var url2;
    if (tipo == 'Film') {
      url2 = 'https://api.themoviedb.org/3/movie/' + risultato_corrente.id;
    } else if (tipo == 'Serie-tv') {
      url2 = 'https://api.themoviedb.org/3/tv/' + risultato_corrente.id;
    }

    stampa_attori(risultato_corrente.id, url);
    stampa_generi(risultato_corrente.id, url2);
  }

  function voto_stella(voti) {
    var voto = Math.ceil(voti / 2);
    var stellaFas = '';
    var stellaFar = '';
    for (var i = 0; i < voto; i++) {
      stellaFas += '<i class="fas fa-star"></i>';
    }
    for (var i = 0; i < 5 - voto; i++) {
      stellaFar += '<i class="far fa-star"></i>';
    }
    return stellaFas + stellaFar;
  }

  function seleziona_lingua(lingua) {
    var array_lingue = ['en', 'it', 'fr', 'de', 'es'];

    if (array_lingue.includes(lingua)) {
      return '<img src="flag_' + lingua + '.png"">';
    } else {
      return lingua;
    }
  }

  function seleziona_poster(poster) {
    if (!poster) {
      return 'immagine-non-disponibile.png';
    } else {
      return api_img_url_base + dimensione_img + poster;
    }
  }

  //intercetto il click sul bottone submit
  $('#input-button').click(function () {
    //prendo ciò che è stato scritto dall'utente nella searchbar e lo salvo in una variabile
    var messaggio = $('#input-text').val();
    //rimuove i risultati ottenuti
    $('.film-container').html('');
    //svuota la searchbar dopo aver premuto invio/click
    $('#input-text').val('');
    if (!messaggio.replace(/\s/g, '').length) {
      alert('Inserisci un titolo valido');
    } else if (messaggio.length < 2) {
      alert('Inserisci almeno due caratteri');
    } else {
      //inizio chiamata ajax
      chiamataAjax(messaggio, stringa_movie, tipoFilm);
      chiamataAjax(messaggio, stringa_tv, tipoSerieTv);
      //fine chiamata ajax
    }
  });

  //per associare  la pressione del tasto enter nella textarea al bottone
  $('#input-text').keydown(function (event) {
    if (event.keyCode === 13) {
      $('#input-button').click();
    }
  });

  //plugin che flippa le card
  $('.film-container').on('mouseenter', '.film-card', function () {
    $('.flip').flip({
      trigger: 'hover',
    });
  });
});

//se il titolo è uguale al titolo originale, nascondo il titolo originale
$(document).ajaxComplete(function () {
  $('.film-card').each(function () {
    if ($('.title', this).html() === $('.original-title', this).html()) {
      $('.original-title', this).addClass('hide');
    }
  });
});
