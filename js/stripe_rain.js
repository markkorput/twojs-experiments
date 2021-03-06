// Generated by CoffeeScript 1.6.3
(function() {
  var Stripe, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stripe = (function(_super) {
    __extends(Stripe, _super);

    function Stripe() {
      _ref = Stripe.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Stripe.prototype._isDead = function() {
      return this.get('particle').translation.y > this.get('height') * 2;
    };

    Stripe.prototype.update = function() {
      this.get('particle').translation.addSelf(new Two.Vector(0, 20));
      if (this._isDead()) {
        return this.set({
          alive: false
        });
      }
    };

    Stripe.prototype.randomize = function() {
      var key, poly;
      if (!this.get('particle')) {
        return;
      }
      if (key = _.last(Object.keys(this.get('particle').children))) {
        if (poly = this.get('particle').children[key]) {
          if (Math.random() > 0.5) {
            return poly.opacity = 0;
          } else {
            return poly.opacity = 1;
          }
        }
      }
    };

    return Stripe;

  })(Backbone.Model);

  this.StripeRain = (function() {
    function StripeRain(_opts) {
      var _base;
      this.options = _opts;
      this.two = this.options.two;
      (_base = this.options).rotation || (_base.rotation = 0);
      this._init();
    }

    StripeRain.prototype._init = function() {
      var _this = this;
      this.group = this.two.makeGroup();
      this.group.translation.set(this.two.width / 2, this.two.height / 2);
      if (this.options.translation) {
        this.group.translation.addSelf(this.options.translation);
      }
      if (this.options.rotation) {
        this.group.rotation = this.options.rotation;
      }
      this.stripes = new Backbone.Collection([]);
      this.stripes.on('add', this._added, this);
      this.stripes.on('remove', function(stripe) {
        console.log('removing stripe Two.js visual element');
        return _this.group.remove(stripe.get('particle'));
      });
      this.stripes.on('change:alive', this._onAliveChange, this);
      this.two.bind('update', this._update, this);
      return _.each(_.range(this.options.startAmount || 1), function(i) {
        return _this.addOne();
      });
    };

    StripeRain.prototype.destroy = function() {
      this.stripes.off();
      this.two.off('update', this._update);
      if (this.stripes) {
        this.stripes.each(function(stripe) {
          return stripe.destroy();
        });
        this.stripes = void 0;
      }
      if (this.two && this.group) {
        return this.two.remove(this.group);
      }
    };

    StripeRain.prototype._update = function(frameCount) {
      return this.stripes.each(function(stripe, col) {
        return stripe.update();
      });
    };

    StripeRain.prototype.addOne = function() {
      return this.stripes.add(new Stripe(this.getNewStripeData()));
    };

    StripeRain.prototype.getNewStripeData = function() {
      var pos, size, w;
      this.minSize || (this.minSize = Math.sqrt(Math.pow(this.two.width, 2), Math.pow(this.two.height, 2)));
      size = this.minSize + Math.random() * 500;
      w = this.options.fatness || 25;
      this.maxPos || (this.maxPos = _.max([this.two.width, this.two.height]));
      pos = (Math.random() - 0.5) * this.maxPos;
      return {
        x: pos,
        y: -size,
        width: w,
        height: size
      };
    };

    StripeRain.prototype.getAllParticles = function() {
      return this.stripes.map(function(stripe) {
        return stripe.get('particle');
      });
    };

    StripeRain.prototype._added = function(obj) {
      var group, h, rect, w;
      group = new Two.Group();
      w = obj.get('width');
      h = obj.get('height');
      rect = this.two.makeRectangle(w + (this.options.shadowOffset || 0), 0, w * 3, h);
      rect.fill = 'rgba(0, 0, 0, 0.3)';
      rect.addTo(group);
      rect = this.two.makeRectangle(0, 0, w, h);
      rect.fill = '#54EBFA';
      rect.addTo(group);
      rect = this.two.makeRectangle(w - 1, 0, w, h);
      rect.fill = '#FFFFFF';
      rect.addTo(group);
      rect = this.two.makeRectangle(w + w - 1, 0, w, h);
      rect.fill = '#FD031D';
      rect.addTo(group);
      group.translation.addSelf(new Two.Vector(obj.get('x'), obj.get('y')));
      group.noStroke();
      group.addTo(this.group);
      obj.set({
        particle: group
      });
      return obj.randomize();
    };

    StripeRain.prototype._onAliveChange = function(stripe, value, data) {
      if (value === false) {
        stripe.set($.extend(this.getNewStripeData(), {
          alive: true
        }));
      }
      if (value === true) {
        stripe.get('particle').translation.set(stripe.get('x'), stripe.get('y'));
        stripe.randomize();
      }
      if (value === false ? this.stripes.length < (this.options.maxAmount || 50) : void 0) {
        return this.addOne();
      }
    };

    return StripeRain;

  })();

}).call(this);
