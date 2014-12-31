'use strict';
/**
 *
 * @module
 * @name cloudify4node
 * @description
 * a wrapper for requiring implementation of cloudify4node. Either the real implementation or the mock one.
 *
 *
 * @param {boolean} mock should we use the mock version of this class?
 * @returns {object} cloudify4node either the real implementation or the
 */
module.exports = function( mock ){
    var cloudify4node;
    if ( mock ){
        cloudify4node = require('../Cloudify4node-mock');

    }else{
        cloudify4node = require('../Cloudify4node');
    }
    return cloudify4node;
};