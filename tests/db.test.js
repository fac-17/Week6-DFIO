const test = require('tape');
const runDbBuild = require('../src/database/db_build');
const queries = require('../src/queries');

test('select all data from users table', (t) => {
    runDbBuild((err, res) => {
        t.error(err, 'No error');

        let expected = [{ id: 1, name: 'Jon', gold_pieces: 20 }, { id: 2, name: 'Aria', gold_pieces: 20 }, { id: 3, name: 'Hodor', gold_pieces: 20 },
        { id: 4, name: 'Kevin', gold_pieces: 20 }];

        queries.getUsers((err, result) => {
            if (err) console.log(err);
            t.deepEqual(result, expected, 'returns expected user data');
            t.end();
        })

    })
})

test('Reduce gold in user table after purchase', (t) => {
    runDbBuild((err, res) => {
        t.error(err, 'No error');

        let expected = [{ id: 1, name: 'Jon', gold_pieces: 19 }, { id: 2, name: 'Aria', gold_pieces: 20 }, { id: 3, name: 'Hodor', gold_pieces: 20 },
        { id: 4, name: 'Kevin', gold_pieces: 20 }]
        queries.buyItem((err, result) => {
            if (err) console.log(err);
            //query to select users inventory and test it has to be inside callback for buyItem
            queries.getUsers((err, result) => {
                if (err) console.log(err);
                t.deepEqual(result, expected, 'Jon should have 1 less gold piece')
                t.end()
            })
        })
    })
})

test('Reduce quantity in inventory table after purchase', (t) => {
    runDbBuild((err, res) => {
        t.error(err, 'No error');
        let expected = [{ item_name: 'Dagger', item_quantity: 3, item_price: 8 }, { item_name: 'Cape', item_quantity: 4, item_price: 3 }, { item_name: 'Walking stick', item_quantity: 10, item_price: 2 }, { item_name: 'Toothbrush', item_quantity: 2, item_price: 10 }]

        queries.buyItem((err, result) => {
            if (err) console.log(err);
            //select inventory inside callback for buyItem(wait for completion of buyItem before trying to select the inventory)
            queries.getInventory((err, result) => {
                if (err) console.log(err);
                t.deepEqual(result, expected, 'Cape should have a quantity of 4')
                t.end();
            })
        })
    })
})

test('Add row to ownership table with new ownership details', (t) => {
    runDbBuild((err, res) => {
        t.error(err, 'No error');
        let expected = [{ id: 1, owner_id: 1, item_id: 2 }, { id: 2, owner_id: 1, item_id: 2 }, { id: 3, owner_id: 2, item_id: 1 }, { id: 4, owner_id: 3, item_id: 3 }, { id: 5, owner_id: 4, item_id: 4 }, { id: 6, owner_id: 4, item_id: 4 }, { id: 7, owner_id: 1, item_id: 2 }]

        queries.buyItem((err, result) => {
            if (err) console.log(err);
            //select inventory inside callback for buyItem(wait for completion of buyItem before trying to select the inventory)
            queries.getOwnership((err, result) => {
                if (err) console.log(err);
                t.deepEqual(result, expected, 'The ownership table should have a new row')
                t.end();
            })
        })
    })
})


test('display score for specific user', (t) => {
    runDbBuild((err, res) => {
        t.error(err, 'No error');

        let expected = [{ sum: '40' }];

        queries.getScoreByUser(4, (err, result) => {
            if (err) console.log(err);
            t.deepEqual(result, expected, 'returns score for specific user');
            t.end();
        })
    })
})


test('get the list of items that a user owns', (t) => {
    runDbBuild((err, res) => {
        t.error(err, 'No error');
        let expected = [{ item_name: 'Toothbrush', item_description: '79% of medieval dentists believe dental hygiene can keep you alive.', item_power: 20 }, { item_name: 'Toothbrush', item_description: '79% of medieval dentists believe dental hygiene can keep you alive.', item_power: 20 }];

        queries.getItemsOwnedBy(4, (err, result) => {
            if (err) console.log(err);
            t.deepEqual(result, expected, 'returns all items owned by user');
            t.end();
        })
    })
})


// test('display score for all users', (t) => {
//   runDbBuild((err,res) => {
//     t.error(err, 'No error');
//
//     let expected = [{name: 'Kevin', sun: '40'}, {name: 'Aria', sun: '10'}, {name: 'Hodor', sun: '2'}, {name: 'Jon', sun: '2'}];
//
//     queries.getAllScores((err, result) => {
//       if (err) console.log(err);
//       t.deepEqual(result,expected, 'returns score for all users');
//       t.end();
//     })
//   })
// })
