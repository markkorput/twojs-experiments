// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.AppUi = (function(_super) {
    __extends(AppUi, _super);

    function AppUi(_opts) {
      this.options = _opts;
      this._initGui();
    }

    AppUi.prototype._initGui = function() {
      var folder,
        _this = this;
      this.gui = new dat.GUI();
      folder = this.gui.addFolder('Actions');
      folder.add({
        Shake: function() {
          return _this.trigger('shake');
        }
      }, 'Shake');
      folder.add({
        Shutter: function() {
          return _this.trigger('shutter');
        }
      }, 'Shutter');
      folder.add({
        Arrows: function() {
          return _this.trigger('arrows');
        }
      }, 'Arrows');
      folder.add({
        Rings: function() {
          return _this.trigger('scale');
        }
      }, 'Rings');
      return folder.open();
    };

    return AppUi;

  })(Backbone.Model);

  this.TwoApp = (function() {
    function TwoApp(_opts) {
      this._mouseMove = __bind(this._mouseMove, this);
      this._keyDown = __bind(this._keyDown, this);
      this.options = _opts;
      this.init();
    }

    TwoApp.prototype.init = function() {
      this.two = new Two({
        autostart: true,
        fullscreen: true,
        type: Two.Types.svg
      }).appendTo(document.body);
      $(window).on('resize', this._resize).on('keydown', this._keyDown).mousemove(this._mouseMove);
      this._initUI();
      this._initScene();
      return this._initOperations();
    };

    TwoApp.prototype._initUI = function() {
      var _this = this;
      this.app_ui = new AppUi();
      this.app_ui.on('shake', function() {
        var all_particles;
        all_particles = _.flatten(_.map(_this.stripes, function(stripe) {
          return stripe.getAllParticles();
        }));
        return _this.operations.add(new WiggleOperation({
          particles: all_particles,
          strength: 10 + Math.random() * 10
        }));
      });
      this.app_ui.on('shutter', function() {
        return _this.circle_closer_operations.shutter();
      });
      this.app_ui.on('arrows', function() {
        return _this.arrows_operations.move_out({
          spirality: 200
        });
      });
      return this.app_ui.on('scale', function() {
        return _this.ringer_operations.scale();
      });
    };

    TwoApp.prototype._initScene = function() {
      this._initBG();
      this._initStripes();
      this._initCircles();
      this._initRingers();
      this._initArrows();
      this._initTriGrid();
      this._initLetterbox();
      return this.two.bind('update', function() {
        return TWEEN.update();
      });
    };

    TwoApp.prototype._initBG = function() {
      var bg;
      bg = this.two.makeRectangle(this.two.width / 2, this.two.height / 2, this.two.width, this.two.height);
      bg.fill = '#000000';
      bg.noStroke();
      return this.two.add(bg);
    };

    TwoApp.prototype._initStripes = function() {
      return this.stripes = [
        new StripeRain({
          two: this.two,
          translation: new Two.Vector(-this.two.width / 2, 0),
          fatness: 15,
          rotation: -0.3,
          shadowOffset: 22,
          startAmount: 10
        }), new StripeRain({
          two: this.two,
          translation: new Two.Vector(this.two.width / 2, 0),
          rotation: 0.3 + Math.PI,
          shadowOffset: -22,
          startAmount: 10
        })
      ];
    };

    TwoApp.prototype._initCircles = function() {
      this.circle_closer = new CircleCloser({
        two: this.two,
        color: '#F3CB5A',
        radius: 200
      });
      this.circle_closer_operations = new CircleCloserOperations({
        target: this.circle_closer
      });
      this.circle_closer_operations.open();
      this.permanent_circle = new CircleCloser({
        two: this.two,
        radius: _.min([this.two.width, this.two.height]) * 0.6
      });
      this.permanent_circle_operations = new CircleCloserOperations({
        target: this.permanent_circle
      });
      return this.permanent_circle_operations.open(-1);
    };

    TwoApp.prototype._initRingers = function() {
      var minRadius;
      minRadius = _.min([this.two.width, this.two.height]) * 0.6 + 10;
      this.ringer = new Ringer({
        two: this.two,
        minRadius: minRadius,
        maxRadius: minRadius + 400,
        minThickness: 30,
        maxThickness: 100
      });
      this.ringer_operations = new RingerOperations({
        target: this.ringer
      });
      return this.ringer_operations.rotate();
    };

    TwoApp.prototype._initArrows = function() {
      this.arrows = new Arrows({
        two: this.two
      });
      this.arrows_operations = new ArrowsOperations({
        target: this.arrows
      });
      return this.arrows_operations.hide();
    };

    TwoApp.prototype._initTriGrid = function() {
      return this.trigrid = new TriGridOps({
        two: this.two
      });
    };

    TwoApp.prototype._initLetterbox = function() {
      var bar, fatness;
      fatness = this.two.height * 0.1;
      bar = this.two.makeRectangle(this.two.width / 2, fatness / 2, this.two.width, fatness);
      bar.fill = '#000000';
      bar.noStroke();
      this.two.add(bar);
      bar = this.two.makeRectangle(this.two.width / 2, this.two.height - fatness / 2, this.two.width, fatness);
      bar.fill = '#000000';
      bar.noStroke();
      return this.two.add(bar);
    };

    TwoApp.prototype._initOperations = function() {
      var _this = this;
      this.operations = new Backbone.Collection([]);
      this.two.bind('update', function(frameCount) {
        return _this.operations.each(function(op) {
          return op.update();
        });
      });
      return this.operations.on('change:alive', function(op) {
        return _this.operations.remove(op);
      });
    };

    TwoApp.prototype._resize = function() {
      if (!this.two) {
        return;
      }
      this.two.renderer.setSize($(window).width(), $(window).height());
      this.two.width = this.two.renderer.width;
      return this.two.height = this.two.renderer.height;
    };

    TwoApp.prototype._keyDown = function(e) {
      var _ref;
      if (e.metaKey || e.ctrlKey) {
        return;
      }
      e.preventDefault();
      if (e.keyCode === 32) {
        this.running = (_ref = this.running === false) != null ? _ref : {
          "true": false
        };
        if (this.running) {
          this.two.play();
        } else {
          this.two.pause();
        }
      }
      if (e.keyCode === 67 && this.circle_closer) {
        this.circle_closer_operations.shutter();
      }
      if (e.keyCode === 49) {
        this.app_ui.trigger('shake');
      }
      if (e.keyCode === 50) {
        this.app_ui.trigger('shutter');
      }
      if (e.keyCode === 51) {
        this.app_ui.trigger('arrows');
      }
      if (e.keyCode === 52) {
        return this.app_ui.trigger('scale');
      }
    };

    TwoApp.prototype._mouseMove = function(event) {
      var all_particles, v;
      if (this.lastMouseX && this.lastMouseY && this.operations.length < 20) {
        v = new Two.Vector(event.pageX - this.lastMouseX, event.pageY - this.lastMouseY);
        all_particles = _.flatten(_.map(this.stripes, function(stripe) {
          return stripe.getAllParticles();
        }));
        this.operations.add(new WiggleOperation({
          particles: all_particles,
          strength: v.length() * 0.03
        }));
      }
      this.lastMouseX = event.pageX;
      return this.lastMouseY = event.pageY;
    };

    return TwoApp;

  })();

}).call(this);
