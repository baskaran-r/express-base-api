const _ = require('lodash');
const db = require('../utils/db');
const { canDo } = require('../routes/session');
const {
  handleError,
  currentTimeStamp,
  asyncWrap,
  logWarn,
  validate
} = require('../utils/common');

const locationRoute = module.exports = {
  list: asyncWrap(async function (req, res, next) {
    let statusFilter = req.query.filter || 'active';
    let locations = await db.exec("select * from locations WHERE status=?", [statusFilter])
    res.json({locations});
  }),

  create: asyncWrap(async function(req, res, next) {

    // Define values to insert
    const location = req.body.location;
    console.log(location);
    var values = {
      name:      location.name,
      taluk:     location.taluk,
      district:  location.district,
      state:     location.state,
      status:     location.status || 'Active',
      created_at: currentTimeStamp(),
      updated_at: currentTimeStamp()
    };

   try {
      //await canDo('add_location', req);
      await validate(location, locationRoute.createValidation);

      const newLocation = await db.exec("INSERT INTO locations SET ? ",[values]);

      if (newLocation.affectedRows < 1) {
        let error = { errors: [{
          title: 'Can not insert Location'
        }]};
        handleError(res, error, 400 ); return;
      }
      values.id = newLocation.insertId;
      res.status(200).json({location: values});
   } catch (err) {
      handleError(res, err, 400 );
   }

  }),

  findById(req, res) {
    let id = req.params.id;
    return new Promise(function(resolve, reject) {

      db.exec("select * from locations WHERE id=?", [id]).then(shop => {
        if (shop.length !== 1) {
          let error = { errors: [{
            title: 'Shop not Location'
          }]};
          handleError(res, error, 400 ); return;
        }
        resolve(shop[0]);
      }).catch( error => {
        reject(error);
      })
    });
  },

  update: asyncWrap(async function(req, res, next) {

    try {
      const location = await locationRoute.findById(req, res);

      const editedLocation = req.body.location;
      editedLocation.updated_at = currentTimeStamp();

      const updatedShop = await db.exec("UPDATE locations SET ? WHERE id = ? ", [editedLocation, req.params.id]);

      if (updatedShop.affectedRows < 1) {
        let error = { errors: [{
          title: 'Can not update location'
        }]};
        handleError(res, error, 400 ); return;
      }

      res.status(204).send();
    } catch (err) {
      handleError(res, err, 400);
    }
  }),

  delete: asyncWrap(async function(req, res) {
    var error = { errors: [] };

    const result = await db.exec("DELETE FROM locations WHERE id = ?", [req.params.id]);

    if (result.affectedRows < 1) {
      error.errors.push({ title: 'Can\'t remove location' });
      handleError(res, error, 400 ); return;
    }

    res.status(204).send();
  }),

  createValidation: {
    name: {
      required: {
        message: 'not required'
      }
    },
    taluk: {
      required: true
    },
    district: {
      required: true
    },
    state: {
      required: true
    }
  }
};

