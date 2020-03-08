'use strict';

import Config from '../dist/data/config.json';
import moment from 'moment';

//-----------------------------------------------------------------------------
// Update
//-----------------------------------------------------------------------------

function update() {
    let $loading = $('#loading');
    $loading.show();
    updateTable().then(() => {
        $loading.hide();
    });
}

function updateTable() {
    let $table = $('#auctions table tbody');
    $table.empty();

    let showError = function(error) {
        console.log(error);
        let $tr = $('<tr>');
        $tr.addClass('error');

        let $td = $('<td>');
        $td.attr('colspan', 7);

        let $error = $('<div>');
        $error.text(error);
        $error.addClass('alert alert-warning');

        $table.append($tr);
        $tr.append($td);
        $td.append($error);
    }

    return new Promise((resolve, reject) => {
        let $regionFilter = $('#regionFilter');
        let $region = $regionFilter.find('input[type="radio"]:checked');

        if ($region.length != 1) {
            showError('No region selected');
            resolve();
            return;
        }

        let regionSlug = $region.val();
        let boeFilter = $('#boeFilter ul li.active').get().map(el => $(el).data('item-id'));
        let corruptionFilter = $('#corruptionFilter ul li.active').get().map(el => $(el).data('corruption-id'));
        let onlySocket = $('#socketSelector').is(':checked');

        let dataFile = `data/region-${regionSlug}-auctions.json`;
        $.getJSON(dataFile, function(data) {
            let $time = $('#lastUpdate time');
            let lastUpdate =  moment.utc(data.lastUpdate);
            $time.text(lastUpdate.fromNow());
            $time.attr('datetime', lastUpdate.format());
            $time.attr('title', lastUpdate.format());

            if (boeFilter.length < 1) {
                showError('No BoE selected');
                resolve();
                return;
            }

            let auctions = data.auctions;
            let filteredAuctions = auctions.filter((auction) => {
                if (boeFilter.length > 0 && !boeFilter.includes(auction.itemId)) {
                    return false;
                }

                if (corruptionFilter.length > 0 && !corruptionFilter.includes(auction.corruption)) {
                    return false;
                }

                if (onlySocket) {
                    if (!auction.hasSocket) {
                        return false;
                    }
                }

                return true;
            });

            filteredAuctions.sort((a, b) => {
                let sort = function(a, b, key) {
                    if (a[key] > b[key]) {
                        return 1;
                    } else if (a[key] < b[key]) {
                        return -1;
                    } else {
                        return 0;
                    }
                };

                return sort(a, b, 'itemId') || sort(b, a, 'level') || sort(a, b, 'price') || sort(b, a, 'corruption') || sort(a, b, 'realm');
            });

            for (let i = 0; i < filteredAuctions.length; i++) {
                let a = filteredAuctions[i];
                let $row = $('<tr>');

                let $item = $('<td>');
                $row.append($item);
                {
                    let $link = $('<a>');
                    $item.append($link);
                    $link.text(ItemsMap[a.itemId][regionSlug]);
                    $link.attr('href', `https://www.wowhead.com/item=${a.itemId}&bonus=${a.bonuses.join(':')}`);
                }

                let $level = $(`<td>${a.level}</td>`);
                $row.append($level);

                let $price = $(`<td class="price">${new Intl.NumberFormat().format(a.price)}</td>`);
                $row.append($price);

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

                let $realm = `<td>${a.realm}</td>`;
                $row.append($realm);

                $table.append($row);
            }

            resolve();
        });
    });
}

//-----------------------------------------------------------------------------
// Lookup Tables
//-----------------------------------------------------------------------------

const Items = Config.itemData;
const ItemsMap = {};

for (let i = 0; i < Items.length; i++) {
    ItemsMap[Items[i].itemId] = Items[i].name;
}

const Corruptions = Config.t26Corruptions;
const CorruptionsMap = {};

for (let i = 0; i < Corruptions.length; i++) {
    let effectId = Corruptions[i][1] || Corruptions[i][0];
    CorruptionsMap[effectId] = {
        name: Corruptions[i][2],
        spellId: Corruptions[i][3],
    };
}

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------

function updateItemNames(regionSlug = 'us') {
    let $container = $('#boeFilter ul');
    $container.empty();

    for (let i = 0; i < Items.length; i++) {
        let option = `<li data-item-id="${Items[i].itemId}">${Items[i].name[regionSlug]}</li>`;
        $container.append(option)
    }
}

function updateCorruptionNames(regionSlug = 'us') {
    let $container = $('#corruptionFilter ul');
    $container.empty();

    for (let i = 0; i < Corruptions.length; i++) {
        let effectId = Corruptions[i][1] || Corruptions[i][0];
        let option = `<li data-corruption-id="${effectId}">${Corruptions[i][2]}</li>`;
        $container.append(option)
    }
}

$.when($.ready).then(function() {
    updateItemNames();
    updateCorruptionNames();
    update();

    $('#regionFilter input:radio').click(function() {
        update();
    });

    $('#boeFilter li').click(function() {
        $(this).toggleClass('active');
        update();
    });

    $('#corruptionFilter li').click(function() {
        $(this).toggleClass('active');
        update();
    });

    $('#socketFilter input:checkbox').click(function() {
        update();
    });
});
