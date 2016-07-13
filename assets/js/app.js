var map, featureList, edificiosSearch = [],
    theaterSearch = [],
    museumSearch = [],
    salonesSearch = [],
    laboratoriosSearch = [],
    cafeteriasSearch = [],
    bannosSearch = [],
    oficinasSearch = [],
    bibliotecasSearch = [];

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

/**************************** DATOS *******************************/
/* Limpia la capa para adicionar el layer control para escuchar cuando se quita o pone la capa al cluster */
var theaterLayer = L.geoJson(null);
var theaters = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/_auditorio.png",
                iconSize: [24, 28],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NAME,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nombre</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Telefono</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Ubicación</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Web</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.NAME);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/_auditorio.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            theaterSearch.push({
                nombre: layer.feature.properties.NAME,
                ubicacion: layer.feature.properties.ADDRESS1,
                source: "Theaters",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
    theaters.addData(data);
    map.addLayer(theaterLayer);
});

/* Limpia la capa para adicionar el layer control para escuchar cuando se quita o pone la capa al cluster */
var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/_biblioteca.png",
                iconSize: [24, 28],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NAME,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nombre</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Telefono</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Ubicación</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Web</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.NAME);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/_biblioteca.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            museumSearch.push({
                nombre: layer.feature.properties.NAME,
                ubicacion: layer.feature.properties.ADRESS1,
                source: "Museums",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
    museums.addData(data);
    map.addLayer(museumLayer);
});








/* Realiza la comunicacion entre el listado y el mapa, y construye dicha lista segun el cambio de zoom */
function syncSidebar() {
    /* Limpia el listado de elementos */
    $("#feature-list tbody").empty();
    /* recorre el layer XXX y adiciona solo los elementos que estan en los limites de la vista del mapa */
    theaters.eachLayer(function (elementoGeo) {
        if (map.hasLayer(theaterLayer)) {
            if (map.getBounds().contains(elementoGeo.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(elementoGeo) + '" lat="' + elementoGeo.getLatLng().lat + '" lng="' + elementoGeo.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/_auditorio.png"></td><td class="feature-name">' + elementoGeo.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });
    /* recorre el layer XXX y adiciona solo los elementos que estan en los limites de la vista del mapa */
    museums.eachLayer(function (elementoGeo) {
        if (map.hasLayer(museumLayer)) {
            if (map.getBounds().contains(elementoGeo.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(elementoGeo) + '" lat="' + elementoGeo.getLatLng().lat + '" lng="' + elementoGeo.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/_biblioteca.png"></td><td class="feature-name">' + elementoGeo.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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

/* Basemap Layers */
/*var mapquestOSM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
    attribution: 'Datos cortesia de <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("https://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["otile1-s", "otile2-s", "otile3-s", "otile4-s"],
    attribution: 'Datos cortesia de <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});*/
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

//Create a color dictionary based off of subway route_id
var subwayColors = {
    "1": "#ff3135",
    "2": "#ff3135",
    "3": "ff3135",
    "4": "#009b2e",
    "5": "#009b2e",
    "6": "#009b2e",
    "7": "#ce06cb",
    "A": "#fd9a00",
    "C": "#fd9a00",
    "E": "#fd9a00",
    "SI": "#fd9a00",
    "H": "#fd9a00",
    "Air": "#ffff00",
    "B": "#ffff00",
    "D": "#ffff00",
    "F": "#ffff00",
    "M": "#ffff00",
    "G": "#9ace00",
    "FS": "#6e6e6e",
    "GS": "#6e6e6e",
    "J": "#976900",
    "Z": "#976900",
    "L": "#969696",
    "N": "#ffff00",
    "Q": "#ffff00",
    "R": "#ffff00"
};

var subwayLines = L.geoJson(null, {
    style: function (feature) {
        return {
            color: subwayColors[feature.properties.route_id],
            weight: 3,
            opacity: 1
        };
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.Line);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");

                }
            });
        }
        layer.on({
            mouseover: function (e) {
                var layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: "#00FFFF",
                    opacity: 1
                });
                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            },
            mouseout: function (e) {
                subwayLines.resetStyle(e.target);
            }
        });
    }
});
$.getJSON("data/subways.geojson", function (data) {
    subwayLines.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16
});


map = L.map("map", {
    zoom: 16,
    center: [4.94, -74.01],
    layers: [googleTerrainLayer, Edificios, markerClusters, highlight, limite],
    zoomControl: false,
    attributionControl: false,
    maxZoom: 21
        //maxBounds: [ /*south west*/ [4.93651, -74.01649], /*north east*/ [4.94699, -74.00674]]
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function (e) {
    if (e.layer === theaterLayer) {
        markerClusters.addLayer(theaters);
        syncSidebar();
    }
    if (e.layer === museumLayer) {
        markerClusters.addLayer(museums);
        syncSidebar();
    }
});

map.on("overlayremove", function (e) {
    if (e.layer === theaterLayer) {
        markerClusters.removeLayer(theaters);
        syncSidebar();
    }
    if (e.layer === museumLayer) {
        markerClusters.removeLayer(museums);
        syncSidebar();
    }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
    syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
    highlight.clearLayers();
    map._layers[Edificios._leaflet_id].setStyle(defaultStyleEdificios);
    $('[id^="popup-"]').remove();
});

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

var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
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

var baseLayers = {
    //"Mapa de Vías": mapquestOSM,
    "Mapa de terreno": googleTerrainLayer,
    "Imagen Áerea": googleSatelliteLayer
};

var groupedOverlays = {
    "Puntos de Interés": {
        "<img src='assets/img/_auditorio.png' width='24' height='28'>&nbsp;Theaters": theaterLayer,
        "<img src='assets/img/_biblioteca.png' width='24' height='28'>&nbsp;Museums": museumLayer
    },
    "Referencia": {
        "Edificios": Edificios,
        "Subway Lines": subwayLines
    }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: true
}).addTo(map);

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

    var theatersBH = new Bloodhound({
        name: "Theaters",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.nombre);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: theaterSearch,
        limit: 10
    });

    var museumsBH = new Bloodhound({
        name: "Museums",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.nombre);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: museumSearch,
        limit: 10
    });

    EdificiosBH.initialize();
    theatersBH.initialize();
    museumsBH.initialize();

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
        name: "Theaters",
        displayKey: "nombre",
        source: theatersBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='assets/img/_auditorio.png' width='24' height='28'>&nbsp;Theaters</h4>",
            suggestion: Handlebars.compile(["{{nombre}}<br>&nbsp;<small>{{ubicacion}}</small>"].join(""))
        }
    }, {
        name: "Museums",
        displayKey: "nombre",
        source: museumsBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='assets/img/_biblioteca.png' width='24' height='28'>&nbsp;Museums</h4>",
            suggestion: Handlebars.compile(["{{nombre}}<br>&nbsp;<small>{{ubicacion}}</small>"].join(""))
        }
    }).on("typeahead:selected", function (obj, datum) {
        if (datum.source === "Edificios") {
            map.fitBounds(datum.bounds);
        }
        if (datum.source === "Theaters") {
            if (!map.hasLayer(theaterLayer)) {
                map.addLayer(theaterLayer);
            }
            map.setView([datum.lat, datum.lng], 17);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }
        }
        if (datum.source === "Museums") {
            if (!map.hasLayer(museumLayer)) {
                map.addLayer(museumLayer);
            }
            map.setView([datum.lat, datum.lng], 17);
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

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
    L.DomEvent
        .disableClickPropagation(container)
        .disableScrollPropagation(container);
} else {
    L.DomEvent.disableClickPropagation(container);
}
