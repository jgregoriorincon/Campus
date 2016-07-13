var map, featureList, edificiosSearch = [],
    theaterSearch = [],
    museumSearch = [],
    salonesSearch = [],
    laboratoriosSearch = [],
    cafeteriasSearch = [],
    bannosSearch = [],
    oficinasSearch = [],
    bibliotecasSearch = [];

/* Capas geograficas de Google */
var googleSatelliteLayer = new L.Google();
var googleTerrainLayer = new L.Google('TERRAIN');

/* Layer de seleccionado o resaltado */
var highlight = L.geoJson(null);
var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};

var defaultStyleEdificios = {
    color: "#2262CC",
    weight: 2,
    opacity: 0.6,
    fillOpacity: 0.1,
    fillColor: "#2262CC"
};
var highlightStyleEdificios = {
    color: '#2262CC',
    weight: 3,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};

function labelEdificios(layer, properties) {
    $('[id^="popup-"]').remove();
    map._layers[Edificios._leaflet_id].setStyle(defaultStyleEdificios);

    // Change the style to the highlighted version
    layer.setStyle(highlightStyleEdificios);

    // Insert a headline into that popup
    if (properties.NOMBRE != null) {
        // Create a popup with a unique ID linked to this record
        var popup = $("<div></div>", {
            id: "popup-" + properties.ID,
            css: {
                position: "absolute",
                bottom: "5px",
                left: "5px",
                zIndex: 1002,
                backgroundColor: "white",
                padding: "4px",
                border: "1px solid #ccc"
            }
        });

        var hed = $("<div></div>", {
            text: "Edificio: " + properties.NOMBRE,
            css: {
                fontSize: "14px"
            }
        }).appendTo(popup);

        // Add the popup to the map
        popup.appendTo("#map");
    }
}

/* Variable de limite de zonas */
var Edificios = L.geoJson(null, {
    onEachFeature: function (feature, layer) {
        layer.setStyle(defaultStyleEdificios);

        (function (layer, properties) {
            layer.on("click", function (e) {
                labelEdificios(layer, properties);
            });

            // Create a mouseover event
            layer.on("mouseover", function (e) {
                labelEdificios(layer, properties);
            });

            layer.on("mouseout", function (e) {
                // Start by reverting the style back
                layer.setStyle(defaultStyleEdificios);
                $('[id^="popup-"]').remove();
            });
            edificiosSearch.push({
                name: layer.feature.properties.NOMBRE,
                source: "Edificios",
                id: L.stamp(layer),
                bounds: layer.getBounds()
            });
        })(layer, feature.properties);
    }
});
$.getJSON("data/edificios.geojson", function (data) {
    Edificios.addData(data);
});

/* Variable de limite de zonas */
var limite = L.geoJson(null, {
    style: function (feature) {
        return {
            color: "black",
            fill: false,
            opacity: 0,
            clickable: false
        };
    }
});
$.getJSON("data/limite.geojson", function (data) {
    limite.addData(data);
});

/* Ajusta el titulo de la aplicacion */
function ajustTitle() {
    if (document.body.clientWidth <= 400) {
        $('#Titulo').text('Campus UMNG');
    } else {
        $('#Titulo').text('Campus Nueva Granada');
    };
}

/* Ajusta el zoom de la aplicacion */
function zoomExtent() {
    map.fitBounds(limite.getBounds());
    $(".navbar-collapse.in").collapse("hide");
    return false;
}

/* Muestra la ventana Acerca de */
function showHelp() {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
}

/* La funcion toggle dentro de animate hace el inverso de lo que este sucediendo, si esta en show pasa a hide. El numero es el tiempo (milisegundos) que tarda en realizar la animacion. La funcion invalidatesize reajusta el tamano del mapa, es una funcion de leaflet */
function animateSidebar() {
    $("#sidebar").animate({
        width: "toggle"
    }, 350, function () {
        map.invalidateSize();
    });
}

/* funcion para calcular el tamaño maximo de la ventana de control de capas */
function sizeLayerControl() {
    $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

/* Funcion que limpia la capa de resaltados */
function clearHighlight() {
    highlight.clearLayers();
}

/* Relaciona la lista de elementos con el mapa y mueve la posicion al elemento seleccionado, en las pantallas pequeñas, se oculta el sidebar para mostrar solo el mapa y el identify */
function sidebarClick(id) {
    var layer = markerClusters.getLayer(id);
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
    /* Oculta el sidebar y va al mapa en pantallas menores a 767 pixeles */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}

/* Lanza ultimos ajustes al terminar de cargar los datos */
$(window).ready(function () {
    ajustTitle();
});

/* Cuando se modifica la rotacion o tamaño de la pantalla */
$(window).resize(function () {
    sizeLayerControl();
    ajustTitle();
});

/* Muestra o Esconde la lista de elementos */
$("#list-btn").click(function () {
    animateSidebar();
    return false;
});

/* Muestra o Esconde la lista de elementos */
$("#sidebar-toggle-btn").click(function () {
    animateSidebar();
    return false;
});

/* Oculta la lista de elementos */
$("#sidebar-hide-btn").click(function () {
    animateSidebar();
    return false;
});

/* Funcion que al hacer click en las filas de la tabla de datos */
$(document).on("click", ".feature-row", function (e) {
    $(document).off("mouseout", ".feature-row", clearHighlight);
    sidebarClick(parseInt($(this).attr("id"), 10));
});

/* Funcion que al hacer mouseover en las filas de la tabla de datos */
if (!("ontouchstart" in window)) {
    $(document).on("mouseover", ".feature-row", function (e) {
        highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
    });
}

/* Funcion que al hacer mouseout en las filas de la tabla de datos */
$(document).on("mouseout", ".feature-row", clearHighlight);

/* Funcion que muestra la ventana de ayuda al hacerclick en el boton o hiperenlace About-btn */
$("#about-btn").click(function () {
    showHelp();
});

/* Funcion que muestra la ventana de ayuda al hacerclick en el boton o hiperenlace About-btn */
$("#about-toggle-btn").click(function () {
    showHelp();
});

/* Funcion para hacer el zoom extent */
$("#full-extent-btn").click(function () {
    zoomExtent();
});

/* Funcion para hacer el zoom extent */
$("#full-extent-toggle-btn").click(function () {
    zoomExtent();
});

/* Muestra u oculta la barra de busqueda */
$("#nav-btn").click(function () {
    $(".navbar-collapse").collapse("toggle");
    return false;
})
