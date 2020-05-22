$(document).ready(function() {
    //recupero il template
    var template_html = $('#film-template').html();
    //preparo la funzione da utilizzare per il template
    var template_function = Handlebars.compile(template_html);
    //intercetto il click sul bottone submit
    $("#input-button").click(function() {
        //prendo ciò che è stato scritto dall'utente nella searchbar e lo salvo in una variabile
        var messaggio = $('#input-text').val();

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
                },
                success: function(data) {
                    // mi viene restituito un array come risultato e lo salvo in una variabile
                    var array_risultati = data.results;

                    for (var i = 0; i < array_risultati.length; i++) {
                        var risultato_corrente = array_risultati[i];

                        //salvo ogni risultato dell'array in un nuovo oggetto, per poi eventualmente usare handlebars
                        var locandina_film = {
                            'titolo': risultato_corrente.title,
                            'titolo-originale': risultato_corrente.original_title,
                            'lingua': risultato_corrente.original_language,
                            'voto': risultato_corrente.vote_average,

                        }
                        console.log(locandina_film);

                        var html_finale = template_function(locandina_film);

                        // appendo in pagina una card con i dati dei film
                        $('.film-container').append(html_finale);
                    }

                },
                error: function() {
                    console.log('errore');
                }
            });
            //fine chiamata ajax
        }

        $('#input-text').val('');


    });

    //per associare  la pressione del tasto enter nella textarea al bottone
    $("#input-text").keydown(function(event) {
        if (event.keyCode === 13) {
            $('#input-button').click();

        }


    });
});
