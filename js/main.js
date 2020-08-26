'use strict';

import Config from '../dist/data/config.json';
import moment from 'moment';
import 'jquery-tablesort';

//-----------------------------------------------------------------------------
// Update
//-----------------------------------------------------------------------------

function update() {
    let $loading = $('#loading');
    $loading.show();

    let $error = $('#error');
    $error.text('');
    $error.hide();

    updateTable().then(() => {
        // nop
    }).catch((error) => {
        $error.text(error);
        $error.show();
    }).finally(() => {
        $loading.hide();
    });
}

function updateLastUpdate(lastUpdate) {
    lastUpdate = moment.utc(lastUpdate);

    let $time = $('#lastUpdate time');
    $time.text(lastUpdate.fromNow());
    $time.attr('datetime', lastUpdate.format());
    $time.attr('title', lastUpdate.format());
}

function updateRealmSelector(region, realm) {
    if (!region) {
        return;
    }

    let $select = $('select#realmSelector');
    $select.children().not('#allRealmsOption').remove();

    let options = [];
    for (const {connectedRealmId, realmId, name} of RegionsMap[region].realms) {
        let $option = $('<option>');
        $option.text(name);
        $option.val(realmId);
        $option.data('connectedRealmId', connectedRealmId);

        if (realmId === realm) {
            $option.attr('selected', 'selected');
        }

        options.push($option);
    }

    $select.append(options);
}

function updateTable() {
    let $table = $('#auctions table');
    let $tbody = $table.find('tbody');
    $tbody.empty();

    return new Promise((resolve, reject) => {
        saveSettings();
        const [region, realm, boeFilter, ilvlFilter, needSocket, corruptionFilter] = getSettings();

        if (!region) {
            throw 'No region selected';
        }

        if (boeFilter.length < 1) {
            throw 'No BoE selected';
        }

        let dataFile = `data/region-${region}-auctions.json`;
        $.getJSON(dataFile, function(data) {
            updateLastUpdate(data.lastUpdate);

            // Filter auctions
            let auctions = data.auctions;
            let selectedRealmConnectedId = realm ? RegionsMap[region].connectedRealmsMap[realm] : null;

            let filteredAuctions = auctions.filter((auction) => {
                if (selectedRealmConnectedId && selectedRealmConnectedId !== auction.connectedRealmId) {
                    return false;
                }

                if (boeFilter.length > 0 && !boeFilter.includes(auction.itemId)) {
                    return false;
                }

                if (ilvlFilter.length > 0 && !ilvlFilter.includes(auction.level)) {
                    return false;
                }

                if (needSocket) {
                    if (!auction.hasSocket) {
                        return false;
                    }
                }

                if (corruptionFilter.length > 0 && !corruptionFilter.includes(auction.corruption)) {
                    return false;
                }

                return true;
            });

            // Sort auctions
            filteredAuctions.sort((a, b) => {
                let compare = function(a, b, key) {
                    if (a[key] > b[key]) {
                        return 1;
                    } else if (a[key] < b[key]) {
                        return -1;
                    } else {
                        return 0;
                    }
                };

                return compare(a, b, 'price') || compare(b, a, 'level') || compare(a, b, 'corruption') || compare(a, b, 'realm') || compare(a, b, 'itemId');
            });

            // Display auctions
            let rows = [];
            for (let i = 0; i < filteredAuctions.length; i++) {
                let a = filteredAuctions[i];
                let $row = $('<tr>');

                let $item = $('<td>');
                $row.append($item);
                {
                    let $link = $('<a>');
                    $item.append($link);
                    $link.text(ItemsMap[a.itemId][region]);
                    $link.attr('href', `https://www.wowhead.com/item=${a.itemId}&bonus=${a.bonuses.join(':')}`);
                }

                let $level = $('<td>');
                $row.append($level);
                $level.text(a.level);

                let $price = $('<td>');
                $row.append($price);
                $price.addClass('price');
                $price.data('sort-value', a.price);
                let price = (a.price == 0) ? 'No Buyout' : new Intl.NumberFormat().format(a.price);
                $price.text(price);

                let $corruption = $('<td>');
                $row.append($corruption);
                if (a.corruption) {
                    let $link = $('<a>');
                    $corruption.append($link);
                    $link.text(CorruptionsMap[a.corruption].name);
                    $link.attr('href', `https://www.wowhead.com/spell=${CorruptionsMap[a.corruption].spellId}`);
                }

                let $socket = $('<td>');
                $row.append($socket);
                if (a.hasSocket) {
                    $socket.append('Yes');
                }

                let $tertiary = $('<td>');
                $row.append($tertiary);
                if (a.tertiary) {
                    $tertiary.append(a.tertiary);
                }

                let $realm = $(`<td>`);
                $row.append($realm);
                $realm.text(RegionsMap[region].connectedRealmsNamesMap[a.connectedRealmId].join(', '));
                $realm.data('sort-value', a.realm);

                rows.push($row);
            }

            $tbody.append(rows);
            $table.tablesort();
            resolve();
        });
    });
}

//-----------------------------------------------------------------------------
// Lookup Tables
//-----------------------------------------------------------------------------

const ItemsMap = {};

for (let item of Config.gearData) {
    ItemsMap[item.itemId] = item.name;
}

const CorruptionsMap = {};

for (let corruption of Config.t26Corruptions) {
    let effectId = corruption[1] || corruption[0];
    CorruptionsMap[effectId] = {
        name: corruption[2],
        spellId: corruption[3],
    };
}

const RegionsMap = {};

for (let region of Config.regions) {
    let connectedRealmsMap = {};
    let connectedRealmsNamesMap = {};

    for (let realm of region.realms) {
        if (!connectedRealmsNamesMap[realm.connectedRealmId]) {
            connectedRealmsNamesMap[realm.connectedRealmId] = [] // list of realms connected to the parent connectedRealmId
        }

        connectedRealmsMap[realm.realmId] = realm.connectedRealmId;
        connectedRealmsNamesMap[realm.connectedRealmId].push(realm.name);
    }

    RegionsMap[region.slug] = {
        connectedRealmsMap: connectedRealmsMap,
        connectedRealmsNamesMap: connectedRealmsNamesMap,
        realms: region.realms,
    };
}

//-----------------------------------------------------------------------------
// Settings
//-----------------------------------------------------------------------------

function deparam(querystring) {
    querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
    let params = {};

    for (let i = 0; i < querystring.length; i++) {
        let pair = querystring[i].split('=');
        let k = decodeURIComponent(pair[0]);
        let v = decodeURIComponent(pair[1]);

        if (k.substring(k.length - 2) === '[]') {
            k = k.substring(0, k.length - 2);
            v = parseInt(v); // Assume we only encode arrays of ints
            (params[k] || (params[k] = [])).push(v);
        } else {
            params[k] = v;
        }
    }

    return params;
}

function getSettings() {
    let region = $('#regionFilter input[type="radio"]:checked').val();
    let realm = parseInt($('select#realmSelector').val());
    let boeFilter = $('#boeFilter input[type="checkbox"]:checked').get().map(el => $(el).data('item-id'));
    let ilvlFilter = $('#ilvlFilter input[type="checkbox"]:checked').get().map(el => $(el).data('item-level'));
    let needSocket = $('#socketSelector').is(':checked');
    let corruptionFilter = $('#corruptionFilter input[type="checkbox"]:checked').get().map(el => $(el).data('corruption-id'));

    return [region, realm, boeFilter, ilvlFilter, needSocket, corruptionFilter];
}

function resetForm() {
    $('form#filters').trigger('reset');
    $('form#filters label.btn').removeClass('active');
}

function loadSettings() {
    let hash = window.location.hash;
    if (!hash) {
        return;
    }

    hash = hash.substring(hash.indexOf('#/') + 2);
    let settings = deparam(hash);

    let activate = function($input) {
        if (!$input.prop('checked')) {
            $input.click();
        }
    }

    if (settings.region) {
        let $input = $(`#regionFilter input[type="radio"][value="${settings.region}"]`);
        activate($input);
        let realm = (settings.realm) ? parseInt(settings.realm) : null;
        updateRealmSelector(settings.region, realm);
    }

    if (settings.boes) {
        for (const itemId of settings.boes) {
            let $input = $(`#boeFilter input[type="checkbox"][data-item-id="${itemId}"]`);
            activate($input);
        }
    }

    if (settings.ilvls) {
        for (const ilvl of settings.ilvls) {
            let $input = $(`#ilvlFilter input[type="checkbox"][data-item-level="${ilvl}"]`);
            activate($input);
        }
    }

    if (settings.socket) {
        let $input = $('#socketSelector');
        activate($input);
    }

    if (settings.corruptions) {
        for (const corruption of settings.corruptions) {
            let $input = $(`#corruptionFilter input[type="checkbox"][data-corruption-id="${corruption}"]`);
            activate($input);
        }
    }
}

function saveSettings() {
    const [region, realm, boeFilter, ilvlFilter, needSocket, corruptionFilter] = getSettings();
    let filter = {};

    if (region) {
        filter['region'] = region;
    }

    if (realm) {
        filter['realm'] = realm;
    }

    if (boeFilter.length > 0) {
        filter['boes'] = boeFilter;
    }

    if (ilvlFilter.length > 0) {
        filter['ilvls'] = ilvlFilter;
    }

    if (needSocket) {
        filter['socket'] = needSocket;
    }

    if (corruptionFilter.length > 0) {
        filter['corruptions'] = corruptionFilter;
    }

    history.replaceState(null, null, `#/${$.param(filter)}`);
}

//-----------------------------------------------------------------------------
// Set up
//-----------------------------------------------------------------------------

$.when($.ready).then(function() {
    // Reset the form and load settings from the URL (if any)
    resetForm();
    loadSettings();

    // Event listeners haven't been set up yet so we need to manually call update()
    update();

    $(window).on('hashchange', function() {
        // Only triggered by user changing hash
        // Will not trigger from replaceState
        window.location.reload();
    });

    $('#regionFilter input:radio').click(function() {
        updateRealmSelector($(this).val(), null);
        update();
    });

    $('select#realmSelector').change(function() {
        update();
    });

    $('#boeFilter input:checkbox').click(function() {
        update();
    });

    $('#ilvlFilter input:checkbox').click(function() {
        update();
    });

    $('#corruptionFilter input:checkbox').click(function() {
        update();
    });

    $('#socketFilter input:checkbox').click(function() {
        update();
    });
});
