#!/usr/bin/env python3


import requests
import logging
import json
import io
import pickle
import os
import datetime


logger = logging.getLogger('WoWPay2Win')
logging.basicConfig(level=logging.INFO)
logging.getLogger("requests").setLevel(logging.WARNING)


#------------------------------------------------------------------------------
# Constants
#------------------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
CACHE_DIR = '{}/cache'.format(BASE_DIR)
EXPORT_DIR = '{}/dist/data'.format(BASE_DIR)

MAX_REQUEST_TIME = 30 # seconds

CLIENT_ID     = '75775a8f0c364b6d980cb2bdf7c22105'
CLIENT_SECRET = 'g5AM5o5cvL7eCPb1TFHYLwqd60v78TNv'

REGIONS = [
    ('us', 'en_US'),
    ('eu', 'en_GB'),
    ('kr', 'ko_KR'),
    ('tw', 'zh_TW'),
]

API_HOST = 'https://{}.api.blizzard.com'
REALMS_ENDPOINT   = '/data/wow/connected-realm/index'
REALM_ENDPOINT    = '/data/wow/connected-realm/{}'
AUCTIONS_ENDPOINT = '/data/wow/connected-realm/{}/auctions'
ITEM_ENDPOINT     = '/data/wow/item/{}'


#------------------------------------------------------------------------------
# Nyalotha
#------------------------------------------------------------------------------


T26_BOE_IDS = [
    175004,
    175005,
    175010,
    175009,
    175008,
    175007,
    175006,
]

T26_CORRUPTIONS = [
    # Some of these bundle into same id
    # 1st id : corruption amount
    # 2nd id : corruption effect on item
    # 3th id : spell effect id
    (6455, 6483, 'Avoidant I'               , 315607),
    (6460, 6484, 'Avoidant II'              , 315608),
    (6465, 6485, 'Avoidant III'             , 315609),
    (6455, 6474, 'Expedient I'              , 315544),
    (6460, 6475, 'Expedient II'             , 315545),
    (6465, 6476, 'Expedient III'            , 315546),
    (6455, 6471, 'Masterful I'              , 315529),
    (6460, 6472, 'Masterful II'             , 315530),
    (6465, 6473, 'Masterful III'            , 315531),
    (6455, 6480, 'Severe I'                 , 315554),
    (6460, 6481, 'Severe II'                , 315557),
    (6465, 6482, 'Severe III'               , 315558),
    (6455, 6477, 'Versatile I'              , 315549),
    (6460, 6478, 'Versatile II'             , 315552),
    (6465, 6479, 'Versatile III'            , 315553),
    (6455, 6493, 'Siphoner I'               , 315590),
    (6460, 6494, 'Siphoner II'              , 315591),
    (6465, 6495, 'Siphoner III'             , 315592),
    (6455, 6437, 'Strikethrough I'          , 315277),
    (6460, 6438, 'Strikethrough II'         , 315281),
    (6465, 6439, 'Strikethrough III'        , 315282),
    (6555, None, 'Racing Pulse I'           , 318266),
    (6559, None, 'Racing Pulse II'          , 318492),
    (6560, None, 'Racing Pulse III'         , 318496),
    (6556, None, 'Deadly Momentum I'        , 318268),
    (6561, None, 'Deadly Momentum II'       , 318493),
    (6562, None, 'Deadly Momentum III'      , 318497),
    (6558, None, 'Surging Vitality I'       , 318270),
    (6565, None, 'Surging Vitality II'      , 318495),
    (6566, None, 'Surging Vitality III'     , 318499),
    (6557, None, 'Honed Mind I'             , 318269),
    (6563, None, 'Honed Mind II'            , 318494),
    (6564, None, 'Honed Mind III'           , 318498),
    (6549, None, 'Echoing Void I'           , 318280),
    (6550, None, 'Echoing Void II'          , 318485),
    (6551, None, 'Echoing Void III'         , 318486),
    (6552, None, 'Infinite Stars I'         , 318274),
    (6553, None, 'Infinite Stars II'        , 318487),
    (6554, None, 'Infinite Stars III'       , 318488),
    (6547, None, 'Ineffable Truth I'        , 318303),
    (6548, None, 'Ineffable Truth II'       , 318484),
    (6537, None, 'Twilight Devastation I'   , 318276),
    (6538, None, 'Twilight Devastation II'  , 318477),
    (6539, None, 'Twilight Devastation III' , 318478),
    (6543, None, 'Twisted Appendage I'      , 318481),
    (6544, None, 'Twisted Appendage II'     , 318482),
    (6545, None, 'Twisted Appendage III'    , 318483),
    (6540, None, 'Void Ritual I'            , 318286),
    (6541, None, 'Void Ritual II'           , 318479),
    (6542, None, 'Void Ritual III'          , 318480),
    (6573, None, 'Gushing Wound'            , 318272),
    (6546, None, 'Glimpse of Clarity'       , 318239),
    (6571, None, 'Searing Flames'           , 318293),
    (6572, None, 'Obsidian Skin'            , 316651),
    (6567, None, 'Devour Vitality'          , 318294),
    (6568, None, 'Whispered Truths'         , 316780),
    (6570, None, 'Flash of Insight'         , 318299),
    (6569, None, 'Lash of the Void'         , 317290),
]


#------------------------------------------------------------------------------
# Region
#------------------------------------------------------------------------------


class Region():
    def __init__(self, slug, locale):
        self.slug = slug
        self.cacheFile = '{}/region-{}.pkl'.format(CACHE_DIR, slug)
        self.host = API_HOST.format(slug)
        self.locale = locale
        self.connectedRealms = []


    def fetchConnectedRealms(self, accessToken):
        if self.loadFromCache():
            return

        realmsEndpoint = '{}{}'.format(self.host, REALMS_ENDPOINT)
        headers = {
            'Authorization': 'Bearer {}'.format(accessToken)
        }
        params = {
            'region': self.slug,
            'namespace': 'dynamic-{}'.format(self.slug),
            'locale': self.locale,
        }

        response = requests.get(realmsEndpoint, headers=headers, params=params, timeout=MAX_REQUEST_TIME)
        if response.status_code != 200:
            debugResponse(response)
            raise Exception('Failed to get list of connected realms')

        data = json.loads(response.text)

        for connectedRealmEndpoint in data['connected_realms']:
            connectedRealm = ConnectedRealm.fetch(accessToken, self, connectedRealmEndpoint['href'])
            self.connectedRealms.append(connectedRealm)
            logger.info('Fetched connected realm {}'.format(connectedRealm))

        self.saveToCache()


    def fetchAuctions(self, accessToken):
        for connectedRealm in self.connectedRealms:
            connectedRealm.fetchAuctions(accessToken, self)


    def saveToCache(self):
        with open(self.cacheFile, 'wb') as file:
            pickle.dump(self, file)
            logger.info('Successfully saved {} realms to {}'.format(len(self.connectedRealms), self.cacheFile))


    def loadFromCache(self):
        if not os.path.isfile(self.cacheFile):
            logger.info('Cache file not found {}'.format(self.cacheFile))
            return False

        with open(self.cacheFile, 'rb') as file:
            region = pickle.load(file)

            assert (self.slug      == region.slug)
            assert (self.cacheFile == region.cacheFile)
            assert (self.host      == region.host)
            assert (self.locale    == region.locale)
            self.connectedRealms = region.connectedRealms

        logger.info('Successfully loaded {} realms from {}'.format(len(self.connectedRealms), self.cacheFile))
        return True


    def exportData(self, itemData):
        with open('{}/region-{}-auctions.json'.format(EXPORT_DIR, self.slug), 'w') as f:
            auctions = []

            for itemId in T26_BOE_IDS:
                for connectedRealm in self.connectedRealms:
                    for item in connectedRealm.items:
                        if not item.itemId == itemId:
                            continue

                        auction = item.exportToObj()
                        auction['realm'] = ', '.join(connectedRealm.realms)
                        auctions.append(auction)

            f.write(json.dumps({
                'lastUpdate': str(datetime.datetime.utcnow()),
                'auctions': auctions,
            }));


    def __str__(self):
        output = io.StringIO()

        output.write('Region:{} locale:{}'.format(self.host, self.locale))
        output.write('\n')

        for connectedRealm in self.connectedRealms:
            output.write(connectedRealm)
            output.write('\n')

        return output.getvalue()


#------------------------------------------------------------------------------
# ConnectedRealm
#------------------------------------------------------------------------------


class ConnectedRealm():
    @staticmethod
    def fetch(accessToken, region, endpoint):
        headers = {
            'Authorization': 'Bearer {}'.format(accessToken)
        }
        params = {
            'region': region.slug,
            'namespace': 'dynamic-{}'.format(region.slug),
            'locale': region.locale,
        }

        response = requests.get(endpoint, headers=headers, params=params, timeout=MAX_REQUEST_TIME)
        if response.status_code != 200:
            debugResponse(response)
            raise Exception('Failed to get connected realm data')

        data = json.loads(response.text)
        return ConnectedRealm(data)


    def __init__(self, connectedRealmData):
        self.connectedRealmId = connectedRealmData['id']
        self.realms = [realm['name'] for realm in connectedRealmData['realms']]
        self.items = []


    def fetchAuctions(self, accessToken, region):
        auctionEndpoint = '{}{}'.format(region.host, AUCTIONS_ENDPOINT.format(self.connectedRealmId))
        headers = {
            'Authorization': 'Bearer {}'.format(accessToken)
        }
        params = {
            'region': region.slug,
            'namespace': 'dynamic-{}'.format(region.slug),
            'locale': region.locale,
        }

        logger.info('Fetching autions for realm {}'.format(self.connectedRealmId))
        response = requests.get(auctionEndpoint, headers=headers, params=params, timeout=MAX_REQUEST_TIME)
        if response.status_code != 200:
            debugResponse(response)
            raise Exception('Failed to fetch auctions')

        data = json.loads(response.text)

        for auction in data['auctions']:
            itemId = auction['item']['id']
            if itemId not in T26_BOE_IDS:
                continue

            if 'buyout' in auction:
                price = float(auction['buyout']) / (100 * 100) # 1 gold = 100 silver, 1 silver = 100 copper
            else:
                price = 0

            bonusIds = auction['item']['bonus_lists']
            self.items.append(Item(price, itemId, bonusIds))

        logger.info('Fetched {} auctions for realm {}'.format(len(self.items), self.connectedRealmId))


    def __str__(self):
        return '{:4} {}'.format(self.connectedRealmId, self.realms)


#------------------------------------------------------------------------------
# ItemData (for specifying item's generic characteristics such as locale name)
#------------------------------------------------------------------------------


class ItemData:
    def __init__(self, itemId):
        self.itemId = itemId
        self.name = {}


    def fetchItemData(self, accessToken, region):
        cacheFile = '{}/item-{}.pkl'.format(CACHE_DIR, self.itemId)
        if self.loadFromCache(cacheFile, self.itemId):
            # Only return if our locale has been cached as well
            if region.locale in self.name:
                return

        itemEndpoint = '{}{}'.format(region.host, ITEM_ENDPOINT.format(self.itemId))
        headers = {
            'Authorization': 'Bearer {}'.format(accessToken)
        }
        params = {
            'region': region.slug,
            'namespace': 'static-{}'.format(region.slug),
            'locale': region.locale,
        }

        response = requests.get(itemEndpoint, headers=headers, params=params, timeout=MAX_REQUEST_TIME)
        if response.status_code != 200:
            debugResponse(response)
            raise Exception('Failed to fetch item')

        data = json.loads(response.text)
        self.name[region.slug] = data['name']

        self.saveToCache(cacheFile, self.itemId)


    def saveToCache(self, cacheFile, itemId):
        with open(cacheFile, 'wb') as file:
            pickle.dump(self, file)
            logger.info('Successfully saved item to {}'.format(cacheFile))


    def loadFromCache(self, cacheFile, itemId):
        if not os.path.isfile(cacheFile):
            logger.info('Cache file not found {}'.format(cacheFile))
            return False

        with open(cacheFile, 'rb') as file:
            itemData = pickle.load(file)

            assert(self.itemId == itemData.itemId)
            self.name = itemData.name

        logger.info('Successfully loaded item from {}'.format(cacheFile))
        return True


#------------------------------------------------------------------------------
# Item (specific to an auction)
#------------------------------------------------------------------------------


class Item():
    def __init__(self, price, itemId, bonuses):
        self.price = int(price)
        self.itemId = itemId
        self.bonuses = bonuses
        self.level = 0
        self.hasSocket = False
        self.tertiary = None
        self.corruption = None

        for bonus in bonuses:
            self.parseBonus(bonus)


    def parseBonus(self, bonus):
        # Check for corruption bonus id
        for corruption in T26_CORRUPTIONS:
            amountId = corruption[0]
            effectId = corruption[1] or corruption[0]

            # Corruption Effects
            if bonus == effectId:
                self.corruption = effectId
                return

            # Corruption Amounts
            # New from hotfixes; old items still have old corruption amounts, only new items will have new amounts
            HOTFIX_CORRUPTION_AMOUNTS = [6613, 6614, 6462, 6470, 6461, 6612, 6453, 6457]
            if (bonus == amountId) or (bonus in HOTFIX_CORRUPTION_AMOUNTS):
                return

        # T26 Nyalotha LFR ilvl
        if bonus == 4825 or bonus == 1472 or bonus == 6578 or bonus == 6513:
            self.level = 430
            return

        # T26 Nyalotha Normal ilvl
        if bonus == 4822 or bonus == 1487 or bonus == 6579:
            self.level = 445
            return

        # T26 Nyalotha Heroic ilvl
        if bonus == 4823 or bonus == 1502:
            self.level = 460
            return

        # T26 Nyalotha Mythic ilvl
        if bonus == 4824 or bonus == 1517:
            self.level = 475
            return

        # Tertiary stats
        if bonus >= 40 and bonus <= 43:
            if bonus == 40:
                self.tertiary = 'Avoidance'
            elif bonus == 41:
                self.tertiary = 'Leech'
            elif bonus == 42:
                self.tertiary = 'Speed'
            elif bonus == 43:
                self.tertiary = 'Indestructible'
            return

        # Socket
        if bonus == 1808:
            self.hasSocket = True
            return

        UNKNOWN_ITEM_BONUSES = [6515, 4786, 6516]
        if bonus in UNKNOWN_ITEM_BONUSES:
            return

        logger.warn('Unrecognized item bonus {} {}'.format(bonus, self))


    def __str__(self):
        output = io.StringIO()

        output.write('id:{}'.format(self.itemId))
        output.write(' price:{}'.format(self.price))
        output.write(' bonuses:{}'.format(self.bonuses))
        output.write(' level:{}'.format(self.level))

        if self.hasSocket:
            output.write(' socket:{}'.format(self.hasSocket))

        if self.tertiary:
            output.write(' tertiary:{}'.format(self.tertiary))

        if self.corruption:
            output.write(' corruption:{}'.format(self.corruption))

        return output.getvalue()


    def exportToObj(self):
        data = {
            'itemId':  self.itemId,
            'price':   self.price,
            'bonuses': self.bonuses,
            'level':   self.level,
        }

        if self.hasSocket:
            data['hasSocket'] = self.hasSocket

        if self.tertiary:
            data['tertiary'] = self.tertiary

        if self.corruption:
            data['corruption'] = self.corruption

        return data


#------------------------------------------------------------------------------
# Helpers
#------------------------------------------------------------------------------


def debugResponse(response):
    logger.error('Request: {} {}'.format(response.request.url, response.status_code))
    logger.error(response.request.headers)
    logger.error(response.text)


def getAccessToken():
    tokenEndpoint = 'https://us.battle.net/oauth/token' # Apparently a token from US can access all APIs

    response = requests.post(tokenEndpoint, auth=(CLIENT_ID, CLIENT_SECRET), data={'grant_type':'client_credentials'}, timeout=MAX_REQUEST_TIME)
    if response.status_code != 200:
        debugResponse(response)
        raise Exception('Failed to obtain access token')

    data = json.loads(response.text)
    accessToken = data['access_token']
    return accessToken


#------------------------------------------------------------------------------
# Exports
#------------------------------------------------------------------------------


def exportConfig(itemData):
    with open('{}/config.json'.format(EXPORT_DIR), 'w') as f:
        data = {
            'itemData': [item.__dict__ for itemId, item in itemData.items()],
            't26Corruptions': T26_CORRUPTIONS,
        }
        f.write(json.dumps(data, indent=2))


#------------------------------------------------------------------------------
# Main
#------------------------------------------------------------------------------


def main():
    itemData = {}
    for itemId in T26_BOE_IDS:
        itemData[itemId] = ItemData(itemId)

    for region in REGIONS:
        region = Region(*region)
        accessToken = getAccessToken()

        for itemId in T26_BOE_IDS:
            itemData[itemId].fetchItemData(accessToken, region)

        region.fetchConnectedRealms(accessToken)
        region.fetchAuctions(accessToken)
        region.exportData(itemData)

    exportConfig(itemData)


if __name__ == '__main__':
    main()

