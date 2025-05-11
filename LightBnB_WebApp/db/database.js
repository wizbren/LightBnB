const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');
const pool = new Pool({
  user: 'development',
  password: 'development',
  host: 'localhost',
  database: 'lightbnb'
});

/*pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });*/

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.error('Query error:', err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then ((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
};
 
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
   .query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [user.name, user.email, user.password])
    .then ((result) => {
      return result.rows[0];
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
      SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      ORDER BY reservations.start_date
      LIMIT $2;
    `, [guest_id, limit])
    .then((result) => {
      return result.rows;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  const queryParams = []; //store values
  const whereClauses = []; //for WHERE conditions
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  //by city-------
  if (options.city) {
    const cityParam = `%${options.city}%`;
    queryParams.push(cityParam);
    const placeholder = `${queryParams.length}`;
    whereClauses.push(`city LIKE $${placeholder}`);
  }

  //by owner_id------
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    const placeholder = `${queryParams.length}`;
    whereClauses.push(`owner_id = $${placeholder}`);
  }

  //Filter min and max price
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    const minPrice = Number(options.minimum_price_per_night) * 100;
    const maxPrice = Number(options.maximum_price_per_night) * 100;
    queryParams.push(minPrice);
    queryParams.push(maxPrice);
    const minPlaceholder = `${queryParams.length - 1}`;
    const maxPlaceholder = `${queryParams.length}`;
    whereClauses.push(`cost_per_night BETWEEN $${minPlaceholder} AND $${maxPlaceholder}`);
  }

  if (whereClauses.length > 0) {
    queryString += `WHERE ${whereClauses.join(" AND ")} `;
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    const placeholder = `${queryParams.length}`;
    queryString += `HAVING AVG(property_reviews.rating) >= $${placeholder}`;
  }

  queryParams.push(limit);
  const limitPlaceholder = `${queryParams.length}`;
  queryString += `ORDER BY cost_per_night LIMIT $${limitPlaceholder};`;

  return pool.query(queryString, queryParams).then((res) => {
    return res.rows;
  });
};

/*const getAllProperties = function (options, limit = 10) {
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);
};*/

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
