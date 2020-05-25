$(document).ready(function() {
    //recupero il template
    var template_html = $('#film-template').html();
    //preparo la funzione da utilizzare per il template
    var template_function = Handlebars.compile(template_html);
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




    function ricercaFilm(messaggio) {
        //inizio chiamata ajax
        $.ajax({
            'url': 'https://api.themoviedb.org/3/search/movie',
            'method': 'GET',
            'data': {
                'api_key': 'd2f2e36584ccedbe3c1a6c903ec79afb',
                'query': messaggio,
                'language': 'it',
            },
            success: function(data) {
                // mi viene restituito un array come risultato e lo salvo in una variabile
                var array_risultati = data.results;
                console.log(array_risultati)
                if (array_risultati.length == 0) {
                    alert('Nessun risultato trovato');
                } else {
                    //funzione che stampa in pagina i risultati ottenuti
                    generaCard(array_risultati);
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
            'url': 'https://api.themoviedb.org/3/search/tv',
            'method': 'GET',
            'data': {
                'api_key': 'd2f2e36584ccedbe3c1a6c903ec79afb',
                'query': messaggio,
                'language': 'it',
            },
            success: function(data) {
                // mi viene restituito un array come risultato e lo salvo in una variabile
                var array_risultati = data.results;
                console.log(array_risultati)
                if (array_risultati.length == 0) {
                    console.log('Nessuna serie Tv corrispondente trovata');
                } else {
                    //funzione che stampa in pagina i risultati ottenuti
                    generaCard(array_risultati);
                }




            },
            error: function() {
                console.log('errore');
            }
        });
        //fine chiamata ajax


    }





    //funzione che stampa in pagina i risultati ottenuti
    function generaCard(array_risultati) {
        for (var i = 0; i < array_risultati.length; i++) {
            var risultato_corrente = array_risultati[i];
            scrivi_locandina(risultato_corrente);



        }
    }
    //funzione che inserisce i dati trovati in un oggetto
    function scrivi_locandina(risultato_corrente) {
        //salvo ogni risultato dell'array in un nuovo oggetto, per poi eventualmente usare handlebars

        var locandina_film = {
            'immagine': risultato_corrente.poster_path,
            'titolo': risultato_corrente.title,
            'titolo-serie': risultato_corrente.name,
            'titolo-originale-serie': risultato_corrente.original_name,
            'titolo-originale': risultato_corrente.original_title,
            'lingua': seleziona_lingua(risultato_corrente.original_language),
            'voto': voto_stella(risultato_corrente.vote_average),
            'trama': risultato_corrente.overview,


        }



        var html_finale = template_function(locandina_film);

        // appendo in pagina una card con i dati dei film
        $('.film-container').append(html_finale);
    }

    function voto_stella(voto) {
        var voto = Math.ceil(voto / 2);
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

});

function seleziona_lingua(lingua) {
    var array_lingue = ['en', 'it', 'fr']
    console.log(array_lingue);
    if (array_lingue.includes(lingua)) {
return "<img src='flag_" + lingua + ".png'>";
    }

}
