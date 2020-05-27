$(document).ready(function() {
    //recupero il template
    var template_html = $('#film-template').html();
    //preparo la funzione da utilizzare per il template
    var template_function = Handlebars.compile(template_html);

    //preparo delle variabili per ajax
    var api_key = 'd2f2e36584ccedbe3c1a6c903ec79afb';
    var api_url_base = 'https://api.themoviedb.org/3/';
    var api_img_url_base = 'https://image.tmdb.org/t/p/';
    var dimensione_img = 'w342';
    var lingua = 'en';

    //intercetto il click sul bottone submit
    $("#input-button").click(function() {
        //prendo ciò che è stato scritto dall'utente nella searchbar e lo salvo in una variabile
        var messaggio = $('#input-text').val();
        //rimuove i risultati ottenuti
        $('.film-container').html('');
        //svuota la searchbar dopo aver premuto invio/click
        $('#input-text').val('');
        if (!messaggio.replace(/\s/g, '').length) {
            alert('Inserisci un titolo valido');
        } else {
            //inizio chiamata ajax
            ricercaFilm(messaggio);
            ricercaSerie(messaggio);
            //fine chiamata ajax
        }
    });

    //per associare  la pressione del tasto enter nella textarea al bottone
    $("#input-text").keydown(function(event) {
        if (event.keyCode === 13) {
            $('#input-button').click();
        }
    });

    //plugin che flippa le card
    $('.film-container').on('mouseenter', '.film-card', function() {
        $(".flip").flip({
            trigger: 'hover'
        });
    });




    function ricercaFilm(messaggio) {
        //inizio chiamata ajax
        $.ajax({
            'url': api_url_base + 'search/movie',
            'method': 'GET',
            'data': {
                'api_key': api_key,
                'query': messaggio,
                'language': lingua,
            },
            success: function(data) {
                // mi viene restituito un array come risultato e lo salvo in una variabile
                var array_risultati = data.results;
                console.log(array_risultati)
                if (array_risultati.length == 0) {
                    alert('Nessun risultato trovato');
                } else {
                    //funzione che stampa in pagina i risultati ottenuti
                    generaCard(array_risultati, 'Film');
                }

            },
            error: function() {
                console.log('errore');
            }
        });
        //fine chiamata ajax
    }



    function ricercaSerie(messaggio) {
        //inizio chiamata ajax
        $.ajax({
            'url': api_url_base + 'search/tv',
            'method': 'GET',
            'data': {
                'api_key': api_key,
                'query': messaggio,
                'language': lingua,
            },
            success: function(data) {
                // mi viene restituito un array come risultato e lo salvo in una variabile
                var array_risultati = data.results;
                console.log(array_risultati)
                if (array_risultati.length == 0) {
                    console.log('Nessuna serie Tv corrispondente trovata');
                } else {
                    //funzione che stampa in pagina i risultati ottenuti
                    generaCard(array_risultati, 'Serie-tv');
                }
            },
            error: function() {
                console.log('errore');
            }
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

    //funzione che inserisce i dati trovati in un oggetto
    function scrivi_locandina(risultato_corrente, tipo) {
        //salvo ogni risultato dell'array in un nuovo oggetto, per poi eventualmente usare handlebars
        var locandina_film = {
            'immagine': seleziona_poster(risultato_corrente.poster_path),
            'titolo': risultato_corrente.title,
            'titolo-serie': risultato_corrente.name,
            'titolo-originale-serie': risultato_corrente.original_name,
            'titolo-originale': risultato_corrente.original_title,
            'lingua': seleziona_lingua(risultato_corrente.original_language),
            'voto': voto_stella(risultato_corrente.vote_average),
            'trama': risultato_corrente.overview,
            'tipo': tipo,
            'id': risultato_corrente.id,

        }
        var html_finale = template_function(locandina_film);
        // appendo in pagina una card con i dati dei film
        $('.film-container').append(html_finale);

        var url;
        if (tipo == 'Film') {
            url = 'https://api.themoviedb.org/3/movie/' + risultato_corrente.id + '/credits';
        } else if (tipo == 'Serie-tv') {
            url = 'https://api.themoviedb.org/3/tv/' + risultato_corrente.id + '/credits';
        }

        stampa_attori(risultato_corrente.id, url);


    }

    function voto_stella(voti) {
        var voto = Math.ceil(voti / 2);
        var stellaFas = '';
        var stellaFar = '';
        for (var i = 0; i < voto; i++) {
            stellaFas += '<i class="fas fa-star"></i>';
        }
        for (var i = 0; i < 5 - voto; i++) {
            stellaFar += '<i class="far fa-star"></i>'
        }
        return stellaFas + stellaFar;
    }


    function seleziona_lingua(lingua) {
        var array_lingue = ['en', 'it', 'fr', 'de', 'es']

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


    function stampa_attori(id, url) {

        //inizio chiamata ajax
        $.ajax({
            'url': url,
            'method': 'GET',
            'data': {
                'api_key': api_key,

            },
            success: function(data) {
                var array_nomi = [];
                var array_cast = data.cast;
                for (var i = 0; i < 5; i++) {
                    var cast_corrente = array_cast[i];
                    // console.log(cast_corrente)
                    // $('.cast[data-id="' + id + '"]').append(cast_corrente.name);

                    array_nomi.push(cast_corrente.name);

                    // '.cast[data-id="1"]'
                    //
                    // '.class_' + id + '_id';
                    // '.class_1_id'
                    //
                    // '.cast[data-id="' + id + '"]'
                    console.log(array_nomi);
                }

                $('.cast[data-id="' + id + '"]').append(array_nomi.join(', '));

            },


            error: function() {
                console.log('errore');
            }
        });
        //fine chiamata ajax
    }





    // $('.film-container').on('mouseenter', '.film-card', function() {
    //
    //        $('.info-wrapper', this).show();
    //        var posterCorrente = $('.poster', this);
    //        if (posterCorrente.is(":visible")) {
    //            posterCorrente.hide();
    //        }
    //    });
    //    $('.film-container').on('mouseleave', '.film-card', function() {
    //
    //        $('.info-wrapper', this).hide();
    //        var posterCorrente = $('.poster', this);
    //        if (posterCorrente.is(":hidden")) {
    //            posterCorrente.show();
    //        }
    //    });


});
