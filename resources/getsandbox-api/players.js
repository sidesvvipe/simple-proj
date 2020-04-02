

/*
 * GET /players
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: integer) - query parameter - id of specific player
 */
exports.getPlayers = function(req, res) {
	res.status(200);
    players = state.players || [];
    
    if (req.query.id) {
        player = players[+req.query.id];
        
        if(player === undefined) {
            return res.json(400, { error: { message: "Player not found", request: req.query} });
        }
        return res.json(player);
    }
    
	return res.json(players);
};

function isTrue(prop) {
    return (prop === true || prop === 'true');
}


/*
 * POST /players
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 */
exports.postPlayers = function(req, res) {
	res.status(201);
	
	// retrieve players or, if there are none, init to empty array
    state.players = state.players || [];
    
    if(req.body === undefined) {
        return res.json(400, { error: { message: "Missing req body", request: req } });
    }
    // persist user by adding to the state object
    // TODO player validation
    if (req.body.nickname === undefined) {
        return res.json(400, { error: { message: "Missing nickname", requestBody: req.body } });
    }
    player = {};
    player.id = state.players.length;
    player.nickname = req.body.nickname;
    player.balance = +req.body.balance;
    player.canLend = isTrue(req.body.canLend) ? true : false;
    player.canBorrow = isTrue(req.body.canBorrow) ? true : false;
    
    
    state.players.push(player);
    
    return res.json(player);
};

/*
 * DELETE /players
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.deletePlayers = function(req, res) {
	res.status(200);
    state.players = [];
    state.sponsorships = [];
	// set response body and send
	res.json({});
};