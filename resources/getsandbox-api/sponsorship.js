

/*
 * POST /sponsorships
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 */
exports.postSponsorships = function(req, res) {
	res.status(201);
	
	// retrieve players or, if there are none, init to empty array
    state.sponsorships = state.sponsorships || [];
    players = state.players || [];
    
    if(req.body === undefined) {
        return res.json(400, { error: { message: "Missing req body", request: req } });
    }
    
    // sponsorship validations
    
    creditor = players[+req.body.creditorId];
    if (creditor === undefined) { // too lazy to validate in TC
        return res.json(400, { error: { message: "player #"+req.body.creditorId+" not found, max player id = #"+players.length, request: req.body } });
    }
    if (+creditor.balance < +req.body.amount) { // TODO validate in TC
        return res.json(400, { error: { message: "Insufficient funds", creditor: creditor, request: req.body } });
    }
    if (creditor.canLend !== true) { // TODO validate in TC
        return res.json(400, { error: { message: "Lending not allowed", creditor: creditor, request: req.body } });
    }
    
    recepient = players[+req.body.recepientId];
    if (recepient === undefined) { // too lazy to validate in TC
        return res.json(400, { 
            error: { message: "player #"+req.body.recepientId+" not found, max player id = #"+players.length, request: req.body } 
        });
    }
    if (recepient.canBorrow !== true) { // TODO validate in TC
        return res.json(400, { error: { message: "Borrowing not allowed", recepient: recepient, request: req.body } });
    }
    
    if (recepient.id === creditor.id) { // TODO validate in TC
        return res.json(400, { error: { message: "Self sponsoring not allowed", request: req.body }});
    }
    
    sponsorship = {};
    sponsorship.id = state.sponsorships.length;
    sponsorship.creditorId = creditor.id;
    sponsorship.recepientId = recepient.id;
    sponsorship.amount = +req.body.amount;
    sponsorship.isPaidOff = false;
    
    creditor.balance -= sponsorship.amount;
    recepient.balance += sponsorship.amount;
    state.sponsorships.push(sponsorship);
    
    return res.json(sponsorship);
};