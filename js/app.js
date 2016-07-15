/*jslint browser: true*/
/*global $, jQuery, alert, L*/

var map, featureList, edificiosSearch = [],
    parqueaderoSearch = [],
    salonesSearch = [],
    laboratoriosSearch = [],
    cafeteriasSearch = [],
    bannosSearch = [],
    oficinasSearch = [],
    bibliotecasSearch = [];

/*
if (jQuery.browser.mobile) {
    alert("Hola navegador movil");
} else {
    alert("Hola navegador escritorio");
}
*/

/* Estilos para capas */
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

var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};

/* Capas geograficas de Google */
var googleSatelliteLayer = new L.Google();
var googleTerrainLayer = new L.Google('TERRAIN');

/* Layer de seleccionado o resaltado */
var highlight = L.geoJson(null);

/* Capa de Cluster */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 20
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

/* Funcion de procesamiento de features de Edificios */
function labelEdificios(layer, properties) {
    $('[id^="popup-"]').remove();
    map._layers[Edificios._leaflet_id].setStyle(defaultStyleEdificios);

    // Change the style to the highlighted version
    layer.setStyle(highlightStyleEdificios);

    // Insert a headline into that popup
    if (properties.NOMBRE !== null) {
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

/* Capa de Edificios */
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

/* Capa de parqueaderos */
var parqueaderoLayer = L.geoJson(null);
var parqueadero = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "img/parqueadero.png",
                iconSize: [18, 18],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NOMBRE,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {

            var nombre, telefono, ubicacion, correo, contacto;

            if (feature.properties.NOMBRE !== null) {
                nombre = "<tr><th>Nombre</th><td>" + feature.properties.NOMBRE + "</td></tr>";
            } else {
                nombre = "";
            }

            if (feature.properties.TELEFONO !== null) {
                telefono = "<tr><th>Telefono</th><td>" + feature.properties.TELEFONO + "</td></tr>";
            } else {
                telefono = "";
            }

            if (feature.properties.UBICACION !== null) {
                ubicacion = "<tr><th>Ubicacion</th><td>" + feature.properties.UBICACION + "</td></tr>";
            } else {
                ubicacion = "";
            }

            if (feature.properties.CORREO !== null) {
                correo = "<tr><th>Correo</th><td>" + feature.properties.CORREO + "</td></tr>";
            } else {
                correo = "";
            }

            if (feature.properties.CONTACTO !== null) {
                contacto = "<tr><th>Contacto</th><td>" + feature.properties.CONTACTO + "</td></tr>";
            } else {
                contacto = "";
            }

            var content = "<table class='table table-striped table-bordered table-condensed'>" + ubicacion + contacto + correo + telefono + "<table>";

            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.NOMBRE);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="img/parqueadero.png"></td><td class="feature-name">' + layer.feature.properties.NOMBRE + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            parqueaderoSearch.push({
                nombre: layer.feature.properties.NOMBRE,
                ubicacion: layer.feature.properties.UBICACION,
                source: "Parqueadero",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/parqueaderos.geojson", function (data) {
    parqueadero.addData(data);
    map.addLayer(parqueaderoLayer);
});

/* Ajusta el titulo de la aplicacion */
function ajustTitle() {
    if (document.body.clientWidth <= 400) {
        $('#Titulo').text('Campus UMNG');
    } else {
        $('#Titulo').text('Campus Nueva Granada');
    }
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

/* Funcion que muestra la ventana de ayuda al hacer click en el boton o hiperenlace About-btn */
$("#about-btn").click(function () {
    showHelp();
});

/* Funcion que muestra la ventana de ayuda al hacer click en el boton o hiperenlace About-btn */
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
});

/* ------------------- MAPA ------------------*/
map = L.map("map", {
    zoom: 16,
    center: [4.94, -74.01],
    layers: [googleTerrainLayer, Edificios, markerClusters, highlight, limite],
    zoomControl: false,
    attributionControl: false,
    maxZoom: 21,
    maxBounds: [ /*south west*/ [4.93651, -74.01649], /*north east*/ [4.94699, -74.00674]]
});

/* Limpia el mapa al dar clic */
map.on("click", function (e) {
    highlight.clearLayers();
    map._layers[Edificios._leaflet_id].setStyle(defaultStyleEdificios);
    $('[id^="popup-"]').remove();
});

/* Adiciona la opciones del zoom */
var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* Habilita el posicionamiento por GPS solo en dispositivos moviles */
if (jQuery.browser.mobile) {
    var locateControl = L.control.locate({
        position: "bottomright",
        drawCircle: true,
        follow: true,
        setView: true,
        keepCurrentZoomLevel: true,
        markerStyle: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8
        },
        circleStyle: {
            weight: 1,
            clickable: false
        },
        icon: "fa fa-location-arrow",
        metric: true,
        strings: {
            title: "Mi Localización",
            popup: "Ud se encuentra dentro de un radio de {distance} {unit} de este punto",
            outsideMapBoundsMsg: "Ud se encuentra fuera de los límites del Campus Nueva Granada"
        },
        locateOptions: {
            maxZoom: 21,
            watch: true,
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
        }
    }).addTo(map);
}

/* ------------------- CAPAS -------------- */
var baseLayers = {
    "Mapa de terreno": googleTerrainLayer,
    "Imagen Áerea": googleSatelliteLayer
};

var groupedOverlays = {
    "Puntos de Interés": {
        "<img src='img/parqueadero.png' width='18' height='18'>&nbsp;Parqueaderos": parqueaderoLayer
            //,"<img src='img/bannos.png' width='20' height='20'>&nbsp;Baños": museumLayer
    },
    "Referencia": {
        "Edificios": Edificios
    }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: true
}).addTo(map);

/* -------------------   ---------------- */
// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
    L.DomEvent
        .disableClickPropagation(container)
        .disableScrollPropagation(container);
} else {
    L.DomEvent.disableClickPropagation(container);
}

/**************************** FALTA *******************************/

/* Realiza la comunicacion entre el listado y el mapa, y construye dicha lista segun el cambio de zoom */
function syncSidebar() {
    /* Limpia el listado de elementos */
    $("#feature-list tbody").empty();
    /* recorre el layer XXX y adiciona solo los elementos que estan en los limites de la vista del mapa */
    parqueadero.eachLayer(function (elementoGeo) {
        if (map.hasLayer(parqueaderoLayer)) {
            if (map.getBounds().contains(elementoGeo.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(elementoGeo) + '" lat="' + elementoGeo.getLatLng().lat + '" lng="' + elementoGeo.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="img/parqueadero.png"></td><td class="feature-name">' + elementoGeo.feature.properties.NOMBRE + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });

    /* Actualiza los elementos en la lista */
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
}


/* Attribution control */
function updateAttribution(e) {
    $.each(map._layers, function (index, layer) {
        if (layer.getAttribution) {
            $("#attribution").html((layer.getAttribution()));
        }
    });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<span class='hidden-xs'>Desarrollado por la <a href='http://www.umng.edu.co' target='_blank'>Universidad Militar Nueva Granada</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
    return div;
};
map.addControl(attributionControl);

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function (e) {
    if (e.layer === parqueaderoLayer) {
        markerClusters.addLayer(parqueadero);
        syncSidebar();
    }
});

map.on("overlayremove", function (e) {
    if (e.layer === parqueaderoLayer) {
        markerClusters.removeLayer(parqueadero);
        syncSidebar();
    }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
    syncSidebar();
});






/* Highlight search box text on click */
$("#searchbox").click(function () {
    $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
    }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
    $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
    $("#loading").hide();
    sizeLayerControl();
    /* Ajustar el mapa al limite de la Universidad */
    //map.fitBounds(limite.getBounds());
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });

    var EdificiosBH = new Bloodhound({
        name: "Edificios",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: edificiosSearch,
        limit: 10
    });

    var parqueaderoBH = new Bloodhound({
        name: "Parqueaderos",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.nombre);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: parqueaderoSearch,
        limit: 10
    });

    EdificiosBH.initialize();
    parqueaderoBH.initialize();

    /* instantiate the typeahead UI */
    $("#searchbox").typeahead({
        minLength: 3,
        highlight: true,
        hint: false
    }, {
        name: "Edificios",
        displayKey: "name",
        source: EdificiosBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>Edificios</h4>"
        }
    }, {
        name: "Parqueaderos",
        displayKey: "Nombre",
        source: parqueaderoBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='img/parqueadero.png' width='18' height='18'>&nbsp;Parqueaderos</h4>",
            suggestion: Handlebars.compile(["{{nombre}}<br>&nbsp;<small>{{ubicacion}}</small>"].join(""))
        }
    }).on("typeahead:selected", function (obj, datum) {
        if (datum.source === "Edificios") {
            map.fitBounds(datum.bounds);
            map._layers[datum.id].fire("click");
        }
        if (datum.source === "Parqueadero") {
            if (!map.hasLayer(parqueaderoLayer)) {
                map.addLayer(parqueaderoLayer);
            }
            map.setView([datum.lat, datum.lng], 19);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }
        }
        if ($(".navbar-collapse").height() > 50) {
            $(".navbar-collapse").collapse("hide");
        }
    }).on("typeahead:opened", function () {
        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
        $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
    }).on("typeahead:closed", function () {
        $(".navbar-collapse.in").css("max-height", "");
        $(".navbar-collapse.in").css("height", "");
    });
    $(".twitter-typeahead").css("position", "static");
    $(".twitter-typeahead").css("display", "block");
});