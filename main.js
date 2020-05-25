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
                    }
                    //funzione che stampa in pagina i risultati ottenuti
                    generaCard(array_risultati);


                },
                error: function() {
                    console.log('errore');
                }
            });
            //fine chiamata ajax
        }




    });

    //per associare  la pressione del tasto enter nella textarea al bottone
    $("#input-text").keydown(function(event) {
        if (event.keyCode === 13) {
            $('#input-button').click();

        }


    });


    //funzione che stampa in pagina i risultati ottenuti
    function generaCard(array_risultati) {
        for (var i = 0; i < array_risultati.length; i++) {
            var risultato_corrente = array_risultati[i];

            //salvo ogni risultato dell'array in un nuovo oggetto, per poi eventualmente usare handlebars
            var locandina_film = {
                'titolo': risultato_corrente.title,
                'titolo-originale': risultato_corrente.original_title,
                'lingua': risultato_corrente.original_language,
                'voto': risultato_corrente.vote_average,

            }



            var html_finale = template_function(locandina_film);

            // appendo in pagina una card con i dati dei film
            $('.film-container').append(html_finale);
        }

    }
});
