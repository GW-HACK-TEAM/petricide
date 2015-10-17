ViewPort = function ViewPort() {
  this.ctx = {
    fillStyle: '',
    fillRect: function() {}
  };
  this.canvas = {};
};

ViewPort.prototype.fill = function(color, x, y, width, height) {
  this.ctx.fillStyle = color;
  this.ctx.fillRect(x, y, width, height);
};

ViewPort.prototype.setCanvas = function(cnv) {
  this.canvas = cnv;
};

ViewPort.prototype.setCtx = function(ctx) {
  this.ctx = ctx;
};
