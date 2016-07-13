/*jslint browser: true*/
/*global $, jQuery, alert, L*/

/**************************** FALTA *******************************/
/* Limpia la capa para adicionar el layer control para escuchar cuando se quita o pone la capa al cluster */
var theaterLayer = L.geoJson(null);
var theaters = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "img/auditorio.png",
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
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="img/auditorio.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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
                iconUrl: "img/biblioteca.png",
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
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="img/biblioteca.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(elementoGeo) + '" lat="' + elementoGeo.getLatLng().lat + '" lng="' + elementoGeo.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="img/auditorio.png"></td><td class="feature-name">' + elementoGeo.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });
    /* recorre el layer XXX y adiciona solo los elementos que estan en los limites de la vista del mapa */
    museums.eachLayer(function (elementoGeo) {
        if (map.hasLayer(museumLayer)) {
            if (map.getBounds().contains(elementoGeo.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(elementoGeo) + '" lat="' + elementoGeo.getLatLng().lat + '" lng="' + elementoGeo.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="img/biblioteca.png"></td><td class="feature-name">' + elementoGeo.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
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
            header: "<h4 class='typeahead-header'><img src='img/auditorio.png' width='24' height='28'>&nbsp;Theaters</h4>",
            suggestion: Handlebars.compile(["{{nombre}}<br>&nbsp;<small>{{ubicacion}}</small>"].join(""))
        }
    }, {
        name: "Museums",
        displayKey: "nombre",
        source: museumsBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'><img src='img/biblioteca.png' width='24' height='28'>&nbsp;Museums</h4>",
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
