// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = {
    views: {
      by_resource_id: {
        map: function(doc) {
          var resource, resource_id, resource_name, _ref, _results;
          _ref = doc.rsrcs;
          _results = [];
          for (resource_name in _ref) {
            resource = _ref[resource_name];
            resource_id = resource.id;
            if (resource_id) {
              _results.push(emit([resource_name, resource_id], doc.name));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      },
      by_resource_username: {
        map: function(doc) {
          var resource, resource_name, resource_username, _ref, _results;
          _ref = doc.rsrcs;
          _results = [];
          for (resource_name in _ref) {
            resource = _ref[resource_name];
            resource_username = resource.username || resource.login;
            if (resource_username) {
              _results.push(emit([resource_name, resource_username], doc.name));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      },
      by_username: {
        map: function(doc) {
          if (doc.username) {
            return emit(doc.username);
          }
        }
      },
      by_name: {
        map: function(doc) {
          if (doc.name) {
            return emit(doc.name);
          }
        }
      },
      by_auth: {
        map: function(doc) {
          var out, role, _i, _len, _ref, _results;
          _ref = doc.roles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            role = _ref[_i];
            out = role.split('/');
            out.push(doc.name);
            _results.push(emit(out));
          }
          return _results;
        }
      },
      contractors: {
        map: function(doc) {
          var _ref;
          return emit(((_ref = doc.data) != null ? _ref.contractor : void 0) || false, doc.username);
        }
      }
    },
    shows: {
      get_user: function(doc, req) {
        var h;
        h = require('lib/helpers');
        doc = h.sanitize_user(doc);
        return {
          body: JSON.stringify(doc),
          "headers": {
            "Content-Type": "application/json"
          }
        };
      }
    },
    lists: {
      get_users: function(header, req) {
        var doc, h, out, row;
        h = require('lib/helpers');
        out = [];
        while ((row = getRow())) {
          doc = row.doc;
          doc = h.sanitize_user(doc);
          out.push(doc);
        }
        return JSON.stringify(out);
      },
      get_user: function(header, req) {
        var doc, h, row;
        h = require('lib/helpers');
        row = getRow();
        if (row) {
          doc = h.sanitize_user(row.doc);
          return JSON.stringify(doc);
        } else {
          throw ['error', 'not_found', 'document matching query does not exist'];
        }
      }
    },
    updates: {
      do_action: function(user, req) {
        var acting_user, action, body, container, h, i, key, role, value, _;
        _ = require('lib/underscore');
        h = require('lib/helpers');
        if (!user) {
          return [null, '{"status": "error", "msg": "user not found"}'];
        }
        body = JSON.parse(req.body);
        value = body.value;
        action = body.action;
        key = body.key;
        acting_user = body.user || req.userCtx.name;
        if (action === 'r+') {
          container = user.roles;
          role = key + '|' + value;
          if (__indexOf.call(container, role) >= 0) {
            return [null, JSON.stringify(h.sanitize_user(user))];
          } else {
            container.push(role);
          }
        } else if (action === 'r-') {
          container = user.roles;
          role = key + '|' + value;
          if (__indexOf.call(container, role) >= 0) {
            i = container.indexOf(role);
            container.splice(i, 1);
          } else {
            return [null, JSON.stringify(h.sanitize_user(user))];
          }
        } else {
          return [null, '{"status": "error", "msg": "invalid action"}'];
        }
        user.audit.push({
          u: acting_user,
          dt: +new Date(),
          a: action,
          k: key,
          v: value,
          id: body.uuid
        });
        return [user, JSON.stringify(h.sanitize_user(user))];
      }
    },
    rewrites: [
      {
        from: "/users",
        to: "/_list/get_users/by_username",
        method: 'GET',
        query: {
          include_docs: 'true'
        }
      }, {
        from: "/users/:user_id",
        to: "/_show/get_user/:user_id",
        query: {}
      }
    ],
    validate_doc_update: function(newDoc, oldDoc, userCtx, secObj) {}
  };

}).call(this);
