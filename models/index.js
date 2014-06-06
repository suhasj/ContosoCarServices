module.exports.Run = function(seq, action) {
    seq.authenticate()
        .complete(function(err) {
            if ( !! err) {
                console.log('Connection cannot be attached', err);
            } else {
                console.log('Connection to db establised successfully');
            }
        });

    seq.sync({
        force: false
    })
        .complete(function(err) {
            if ( !! err) {
                console.log('Model syncing error', err);
            } else {

                action();

                console.log('Action completed');
            }
        });
}